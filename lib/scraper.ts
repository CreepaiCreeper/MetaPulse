import * as cheerio from "cheerio";

export async function scrapeWebsite(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website. Status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 1. Meta Title
    const metaTitle = $("title").text().trim() || null;

    const metaDescription =
      $('meta[name="description"]').attr("content")?.trim() ||
      $('meta[property="og:description"]').attr("content")?.trim() ||
      null;

    // 3. Elements Count
    const h1Count = $("h1").length;
    const missingAltCount = $("img:not([alt])").length;

    $("script, style, noscript").remove(); 
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount = bodyText ? bodyText.split(" ").filter(Boolean).length : 0;

    return {
      metaTitle,
      metaDescription,
      h1Count,
      missingAltCount,
      wordCount,
    };
} catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Scraper Error:", errorMessage);
    throw new Error("Could not scrape the target website.");
  }
}