import * as cheerio from "cheerio";

// NOTE: lib/scraper.ts was not included in the project export, so this is a
// full rewrite. If you already had a scraper.ts with its own fetch/proxy
// logic, keep that fetch step and drop in the parsing logic below — the
// important part is that every field on ScrapedData below gets filled in,
// because app/api/scan/route.ts and the report page both depend on them.

export interface ScrapedData {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string | null;
  robots: string | null;
  viewport: string | null;
  charset: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;

  h1Count: number;
  h2Count: number;
  h3Count: number;
  h4Count: number;
  h5Count: number;
  h6Count: number;
  h1Text: string;

  wordCount: number;

  totalImages: number;
  imagesWithAlt: number;
  missingAltCount: number;

  totalLinks: number;
  internalLinks: number;
  externalLinks: number;

  topKeywords: Array<{ word: string; count: number; density: string }>;

  pageSizeBytes: number;
  pageSizeFormatted: string;
}

const STOPWORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "your", "with", "this",
  "that", "from", "have", "will", "can", "all", "our", "was", "were", "has",
  "had", "its", "it's", "their", "they", "them", "than", "then", "into",
  "about", "also", "more", "most", "some", "such", "only", "over", "each",
  "other", "how", "what", "when", "where", "which", "who", "why", "there",
  "here", "these", "those", "been", "being", "does", "did", "doing", "out",
  "off", "get", "got", "one", "two", "new", "use", "using", "used",
]);

function resolveUrl(href: string, base: string): string | null {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let html: string;
  try {
    const res = await fetch(normalizedUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MetaPulseBot/1.0; +https://meta-pulse.app/bot)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!res.ok) {
      throw new Error(`Site responded with status ${res.status}`);
    }

    html = await res.text();
  } finally {
    clearTimeout(timeout);
  }

  const pageSizeBytes = Buffer.byteLength(html, "utf8");
  const $ = cheerio.load(html);
  const baseHost = new URL(normalizedUrl).hostname;

  // --- Meta tags ---
  const metaTitle = $("title").first().text().trim();
  const metaDescription =
    $('meta[name="description" i]').attr("content")?.trim() || "";
  const canonicalUrl = $('link[rel="canonical" i]').attr("href")?.trim() || null;
  const robots = $('meta[name="robots" i]').attr("content")?.trim() || null;
  const viewport = $('meta[name="viewport" i]').attr("content")?.trim() || null;
  const charset =
    $("meta[charset]").attr("charset")?.trim() ||
    $('meta[http-equiv="Content-Type" i]')
      .attr("content")
      ?.match(/charset=([^;]+)/i)?.[1]
      ?.trim() ||
    null;
  const ogTitle = $('meta[property="og:title" i]').attr("content")?.trim() || null;
  const ogDescription =
    $('meta[property="og:description" i]').attr("content")?.trim() || null;
  const ogImage = $('meta[property="og:image" i]').attr("content")?.trim() || null;
  const twitterCard =
    $('meta[name="twitter:card" i]').attr("content")?.trim() || null;

  // --- Headings ---
  const h1Count = $("h1").length;
  const h2Count = $("h2").length;
  const h3Count = $("h3").length;
  const h4Count = $("h4").length;
  const h5Count = $("h5").length;
  const h6Count = $("h6").length;
  const h1Text = $("h1").first().text().trim().replace(/\s+/g, " ");

  // --- Word count (visible body text only) ---
  $("script, style, noscript, template").remove();
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const words = bodyText.length ? bodyText.split(" ") : [];
  const wordCount = words.length;

  // --- Images ---
  const images = $("img");
  const totalImages = images.length;
  let imagesWithAlt = 0;
  images.each((_, el) => {
    const alt = $(el).attr("alt");
    if (alt && alt.trim().length > 0) imagesWithAlt += 1;
  });
  const missingAltCount = totalImages - imagesWithAlt;

  // --- Links ---
  let internalLinks = 0;
  let externalLinks = 0;
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    ) {
      return;
    }
    const resolved = resolveUrl(href, normalizedUrl);
    if (!resolved) return;
    try {
      const linkHost = new URL(resolved).hostname;
      if (linkHost === baseHost) internalLinks += 1;
      else externalLinks += 1;
    } catch {
      // ignore malformed URLs
    }
  });
  const totalLinks = internalLinks + externalLinks;

  // --- Top keywords ---
  const freq = new Map<string, number>();
  for (const raw of words) {
    const word = raw.toLowerCase().replace(/[^a-z0-9'-]/g, "");
    if (word.length < 3) continue;
    if (STOPWORDS.has(word)) continue;
    if (/^\d+$/.test(word)) continue;
    freq.set(word, (freq.get(word) || 0) + 1);
  }
  const topKeywords = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({
      word,
      count,
      density: wordCount > 0 ? `${((count / wordCount) * 100).toFixed(2)}%` : "0%",
    }));

  return {
    metaTitle,
    metaDescription,
    canonicalUrl,
    robots,
    viewport,
    charset,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    h1Count,
    h2Count,
    h3Count,
    h4Count,
    h5Count,
    h6Count,
    h1Text,
    wordCount,
    totalImages,
    imagesWithAlt,
    missingAltCount,
    totalLinks,
    internalLinks,
    externalLinks,
    topKeywords,
    pageSizeBytes,
    pageSizeFormatted: formatBytes(pageSizeBytes),
  };
}
