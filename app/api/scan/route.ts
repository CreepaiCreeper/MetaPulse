import { scrapeWebsite } from "@/lib/scraper";
import { analyzeSEO } from "@/lib/ai-analyzer";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

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

    const startTime = Date.now();
    const scrapedData = await scrapeWebsite(url);
    const aiResult = await analyzeSEO(scrapedData);
    const loadTimeMs = Date.now() - startTime;

    const overallScore = aiResult.score ?? 0;

    // These two are computed from real scraped signals we do have.
    // The others (performance / bestPractices) fall back to the overall
    // AI score until ai-analyzer.ts returns real per-category numbers.
    const accessibilityScore = Math.max(
      0,
      100 - (scrapedData.missingAltCount || 0) * 5,
    );
    const seoScore = Math.max(
      0,
      Math.min(
        100,
        overallScore +
          (scrapedData.metaDescription ? 5 : -10) +
          (scrapedData.metaTitle ? 5 : -10),
      ),
    );

    // Build a real issues list out of the AI's critical fixes + scraped signals.
    // NOTE: lib/scraper.ts and lib/ai-analyzer.ts weren't in the upload, so this
    // route only knows about metaTitle, metaDescription, h1Count,
    // missingAltCount, wordCount, score, summary and criticalFixes. If your
    // scraper/analyzer already return richer data (link counts, h2-h6 counts,
    // keyword density, meta tag list, per-category scores), send me those two
    // files and I'll wire the real values through instead of the 0/N/A
    // placeholders below.
    const issues: Array<{
      id: string;
      type: "critical" | "warning" | "info";
      category: string;
      message: string;
    }> = [];

    (aiResult.criticalFixes || []).forEach((fix: string, idx: number) => {
      issues.push({
        id: `ai-${idx}`,
        type: "critical",
        category: "AI Recommendation",
        message: fix,
      });
    });

    if ((scrapedData.missingAltCount || 0) > 0) {
      issues.push({
        id: "missing-alt",
        type: "warning",
        category: "Accessibility",
        message: `${scrapedData.missingAltCount} image(s) are missing alt text.`,
      });
    }

    if (!scrapedData.metaDescription) {
      issues.push({
        id: "missing-meta-desc",
        type: "warning",
        category: "SEO",
        message: "Meta description is missing.",
      });
    }

    if (!scrapedData.h1Count || scrapedData.h1Count === 0) {
      issues.push({
        id: "missing-h1",
        type: "critical",
        category: "SEO",
        message: "Page has no H1 heading.",
      });
    } else if (scrapedData.h1Count > 1) {
      issues.push({
        id: "multiple-h1",
        type: "info",
        category: "SEO",
        message: `Page has ${scrapedData.h1Count} H1 headings; ideally there should be exactly one.`,
      });
    }

    const issuesSummary = {
      critical: issues.filter((i) => i.type === "critical").length,
      warnings: issues.filter((i) => i.type === "warning").length,
      info: issues.filter((i) => i.type === "info").length,
    };

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
        userId: userId || null,

        // --- Previously missing entirely — this is *why* the report page
        // always showed blank. The Prisma model has these columns but this
        // route never filled them in, so GET /api/scans/[id] returned null
        // for every one of them. ---
        scores: {
          overall: overallScore,
          seo: seoScore,
          performance: overallScore,
          accessibility: accessibilityScore,
          bestPractices: overallScore,
        },
        quickStats: {
          loadTime: `${(loadTimeMs / 1000).toFixed(2)}s`,
          pageSize: "N/A",
          words: scrapedData.wordCount || 0,
        },
        issuesSummary,
        issues,
        linksAnalysis: {
          internal: 0,
          external: 0,
          total: 0,
        },
        imagesAudit: {
          total: scrapedData.missingAltCount || 0,
          withAlt: 0,
          missingAlt: scrapedData.missingAltCount || 0,
        },
        headingStructure: {
          h1: scrapedData.h1Count || 0,
          h2: 0,
          h3: 0,
          h4: 0,
          h5: 0,
          h6: 0,
          h1Text: scrapedData.metaTitle || "",
        },
        topKeywords: [],
        metaTags: [
          {
            title: "Title",
            value: scrapedData.metaTitle || "Missing",
            status: scrapedData.metaTitle ? "good" : "error",
          },
          {
            title: "Description",
            value: scrapedData.metaDescription || "Missing",
            status: scrapedData.metaDescription ? "good" : "error",
          },
        ],
      },
    });

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
