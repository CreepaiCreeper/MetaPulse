import { scrapeWebsite } from "@/lib/scraper";
import { analyzeSEO } from "@/lib/ai-analyzer";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const TIER_LIMITS: Record<string, number> = {
  FREE: 5,
  STARTER: 25,
  ULTIMATE: 100,
};

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

// Performance score derived from actual load time — buckets roughly mirror
// common Core Web Vitals thresholds. This used to just be a copy of the
// AI's overall score, which is why every score on the report page looked
// identical.
function scorePerformance(loadTimeMs: number): number {
  if (loadTimeMs <= 800) return 100;
  if (loadTimeMs <= 1500) return 90;
  if (loadTimeMs <= 2500) return 75;
  if (loadTimeMs <= 4000) return 55;
  if (loadTimeMs <= 6000) return 35;
  return 15;
}

function scoreAccessibility(totalImages: number, missingAltCount: number): number {
  if (totalImages === 0) return 100;
  const withAlt = totalImages - missingAltCount;
  return clamp((withAlt / totalImages) * 100);
}

function scoreBestPractices(scraped: Awaited<ReturnType<typeof scrapeWebsite>>, isHttps: boolean): number {
  let score = 0;
  if (isHttps) score += 20;
  if (scraped.viewport) score += 15;
  if (scraped.charset) score += 15;
  if (scraped.canonicalUrl) score += 15;
  if (scraped.robots) score += 15;
  if (scraped.ogTitle) score += 10;
  if (scraped.ogImage) score += 10;
  return clamp(score);
}

function scoreSeoRuleBased(scraped: Awaited<ReturnType<typeof scrapeWebsite>>): number {
  let score = 0;

  const titleLen = scraped.metaTitle?.length || 0;
  if (titleLen > 0) score += titleLen >= 50 && titleLen <= 60 ? 20 : 10;

  const descLen = scraped.metaDescription?.length || 0;
  if (descLen > 0) score += descLen >= 150 && descLen <= 160 ? 20 : 10;

  if (scraped.h1Count === 1) score += 20;
  else if (scraped.h1Count > 1) score += 10;

  if (scraped.canonicalUrl) score += 15;

  score += scraped.wordCount >= 300 ? 15 : Math.round((scraped.wordCount / 300) * 15);

  if (!scraped.robots || !/noindex/i.test(scraped.robots)) score += 10;

  return clamp(score);
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, message: "URL is required" },
        { status: 400 },
      );
    }

    const token = request.cookies.get("token")?.value;
    let userId: string | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          id: string;
        };
        userId = decoded.id;
      } catch {}
    }

    // --- Daily quota enforcement ---
    // The scan count / date on the user record was never being updated
    // anywhere in this route, so "scans left today" on the dashboard never
    // actually went down and the tier limit was never enforced.
    let userRecord: { subscriptionTier: string; dailyScansCount: number; lastScanDate: Date } | null = null;
    if (userId) {
      userRecord = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionTier: true, dailyScansCount: true, lastScanDate: true },
      });

      if (userRecord) {
        const today = new Date().toDateString();
        const lastScanDay = new Date(userRecord.lastScanDate).toDateString();
        const currentDailyCount = today === lastScanDay ? userRecord.dailyScansCount : 0;
        const maxAllowed = TIER_LIMITS[userRecord.subscriptionTier] ?? TIER_LIMITS.FREE;

        if (currentDailyCount >= maxAllowed) {
          return NextResponse.json(
            {
              success: false,
              message: `Daily scan limit reached (${maxAllowed}/day on your plan). Upgrade or try again tomorrow.`,
            },
            { status: 429 },
          );
        }
      }
    }

    const startTime = Date.now();
    const scrapedData = await scrapeWebsite(url);
    const aiResult = await analyzeSEO(scrapedData);
    const loadTimeMs = Date.now() - startTime;

    const isHttps = /^https:\/\//i.test(url);

    // --- Independent sub-scores ---
    // Previously performance and bestPractices were literally set to the
    // same overall AI score, and SEO was that same score +/- a fixed
    // offset — which is why every card on the report showed near-identical
    // numbers no matter what site was scanned.
    const performanceScore = scorePerformance(loadTimeMs);
    const accessibilityScore = scoreAccessibility(scrapedData.totalImages, scrapedData.missingAltCount);
    const bestPracticesScore = scoreBestPractices(scrapedData, isHttps);
    const ruleBasedSeo = scoreSeoRuleBased(scrapedData);
    const seoScore = clamp((ruleBasedSeo + (aiResult.score ?? ruleBasedSeo)) / 2);
    const overallScore = clamp((seoScore + performanceScore + accessibilityScore + bestPracticesScore) / 4);

    // --- Issues ---
    const issues: Array<{
      id: string;
      type: "critical" | "warning" | "info";
      category: string;
      message: string;
    }> = [];

    (aiResult.criticalFixes || []).forEach((fix: string, idx: number) => {
      issues.push({ id: `ai-${idx}`, type: "critical", category: "AI Recommendation", message: fix });
    });

    if (!scrapedData.h1Count || scrapedData.h1Count === 0) {
      issues.push({ id: "missing-h1", type: "critical", category: "SEO", message: "Page has no H1 heading." });
    } else if (scrapedData.h1Count > 1) {
      issues.push({
        id: "multiple-h1",
        type: "info",
        category: "SEO",
        message: `Page has ${scrapedData.h1Count} H1 headings; ideally there should be exactly one.`,
      });
    }

    if (scrapedData.missingAltCount > 0) {
      issues.push({
        id: "missing-alt",
        type: "warning",
        category: "Accessibility",
        message: `${scrapedData.missingAltCount} images are missing alt text, which harms accessibility and SEO image indexing.`,
      });
    }

    const titleLen = scrapedData.metaTitle?.length || 0;
    if (titleLen === 0) {
      issues.push({ id: "missing-title", type: "critical", category: "SEO", message: "The page is missing a <title> tag." });
    } else if (titleLen < 50 || titleLen > 60) {
      issues.push({
        id: "title-length",
        type: "warning",
        category: "SEO",
        message: `The page title tag is ${titleLen} characters long, which is ${
          titleLen > 60 ? "slightly above" : "below"
        } the recommended 50-60 character limit.`,
      });
    }

    const descLen = scrapedData.metaDescription?.length || 0;
    if (descLen === 0) {
      issues.push({ id: "missing-meta-desc", type: "critical", category: "SEO", message: "Meta description is missing." });
    } else if (descLen < 150 || descLen > 160) {
      issues.push({
        id: "desc-length",
        type: "warning",
        category: "SEO",
        message: `The meta description is ${descLen} characters, slightly ${
          descLen < 150 ? "below" : "above"
        } the optimal range of 150-160 characters.`,
      });
    }

    if (scrapedData.h1Count === 1 && scrapedData.h2Count > 0 && scrapedData.h3Count === 0 && scrapedData.h4Count === 0) {
      issues.push({
        id: "flat-heading-structure",
        type: "warning",
        category: "Best Practices",
        message: `The page uses one H1 and ${scrapedData.h2Count} H2s, but lacks H3-H6 headings, indicating a flat heading structure.`,
      });
    }

    if (!scrapedData.robots) {
      issues.push({ id: "missing-robots", type: "info", category: "SEO", message: "The page does not explicitly define a robots meta tag." });
    }

    if (scrapedData.topKeywords[0] && parseFloat(scrapedData.topKeywords[0].density) < 3) {
      issues.push({
        id: "low-keyword-density",
        type: "info",
        category: "SEO",
        message: `While key terms are present, core phrases like '${scrapedData.topKeywords[0].word}' could have higher density to match user search intent more closely.`,
      });
    }

    if (scrapedData.externalLinks < 5) {
      issues.push({
        id: "low-external-links",
        type: "info",
        category: "SEO",
        message: `The page contains only ${scrapedData.externalLinks} external links, which is relatively low.`,
      });
    }

    const issuesSummary = {
      critical: issues.filter((i) => i.type === "critical").length,
      warnings: issues.filter((i) => i.type === "warning").length,
      info: issues.filter((i) => i.type === "info").length,
    };

    const metaTags = [
      {
        title: "Title",
        value: scrapedData.metaTitle || "Missing",
        badge: scrapedData.metaTitle ? `${titleLen} chars` : undefined,
        subtext: "Ideal: 50-60 characters",
        status: (scrapedData.metaTitle ? (titleLen >= 50 && titleLen <= 60 ? "good" : "warning") : "error") as
          | "good"
          | "warning"
          | "error",
      },
      {
        title: "Description",
        value: scrapedData.metaDescription || "Missing",
        badge: scrapedData.metaDescription ? `${descLen} chars` : undefined,
        subtext: "Ideal: 150-160 characters",
        status: (scrapedData.metaDescription ? (descLen >= 150 && descLen <= 160 ? "good" : "warning") : "error") as
          | "good"
          | "warning"
          | "error",
      },
      {
        title: "Canonical URL",
        value: scrapedData.canonicalUrl || "Missing",
        status: (scrapedData.canonicalUrl ? "good" : "error") as "good" | "warning" | "error",
      },
      {
        title: "Robots",
        value: scrapedData.robots || "Missing",
        status: (scrapedData.robots ? "good" : "error") as "good" | "warning" | "error",
      },
      {
        title: "Viewport",
        value: scrapedData.viewport || "Missing",
        status: (scrapedData.viewport ? "good" : "error") as "good" | "warning" | "error",
      },
      {
        title: "Charset",
        value: scrapedData.charset || "Missing",
        status: (scrapedData.charset ? "good" : "error") as "good" | "warning" | "error",
      },
      {
        title: "OG Title",
        value: scrapedData.ogTitle || "Missing",
        status: (scrapedData.ogTitle ? "good" : "error") as "good" | "warning" | "error",
      },
      {
        title: "OG Description",
        value: scrapedData.ogDescription || "Missing",
        status: (scrapedData.ogDescription ? "good" : "error") as "good" | "warning" | "error",
      },
      {
        title: "OG Image",
        value: scrapedData.ogImage || "Missing",
        status: (scrapedData.ogImage ? "good" : "error") as "good" | "warning" | "error",
      },
      {
        title: "Twitter Card",
        value: scrapedData.twitterCard || "Missing",
        status: (scrapedData.twitterCard ? "good" : "error") as "good" | "warning" | "error",
      },
    ];

    const newScan = await prisma.scan.create({
      data: {
        url,
        status: "COMPLETED",
        score: overallScore,
        summary: aiResult.summary,
        criticalFixes: aiResult.criticalFixes,
        metaTitle: scrapedData.metaTitle,
        metaDescription: scrapedData.metaDescription,
        h1Count: scrapedData.h1Count,
        missingAltCount: scrapedData.missingAltCount,
        wordCount: scrapedData.wordCount,
        loadTimeMs,
        pageSizeKb: Math.round(scrapedData.pageSizeBytes / 1024),
        userId: userId || null,

        scores: {
          overall: overallScore,
          seo: seoScore,
          performance: performanceScore,
          accessibility: accessibilityScore,
          bestPractices: bestPracticesScore,
        },
        quickStats: {
          loadTime: `${(loadTimeMs / 1000).toFixed(2)}s`,
          pageSize: scrapedData.pageSizeFormatted,
          words: scrapedData.wordCount || 0,
        },
        issuesSummary,
        issues,
        linksAnalysis: {
          internal: scrapedData.internalLinks,
          external: scrapedData.externalLinks,
          total: scrapedData.totalLinks,
        },
        imagesAudit: {
          total: scrapedData.totalImages,
          withAlt: scrapedData.imagesWithAlt,
          missingAlt: scrapedData.missingAltCount,
        },
        headingStructure: {
          h1: scrapedData.h1Count || 0,
          h2: scrapedData.h2Count || 0,
          h3: scrapedData.h3Count || 0,
          h4: scrapedData.h4Count || 0,
          h5: scrapedData.h5Count || 0,
          h6: scrapedData.h6Count || 0,
          h1Text: scrapedData.h1Text || "",
        },
        topKeywords: scrapedData.topKeywords,
        metaTags,
      },
    });

    // --- Update quota usage (only for signed-in users) ---
    if (userId && userRecord) {
      const today = new Date().toDateString();
      const lastScanDay = new Date(userRecord.lastScanDate).toDateString();
      const nextCount = today === lastScanDay ? userRecord.dailyScansCount + 1 : 1;

      await prisma.user.update({
        where: { id: userId },
        data: { dailyScansCount: nextCount, lastScanDate: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Website scanned successfully",
      scan: newScan,
    });
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process scan" },
      { status: 500 },
    );
  }
}
