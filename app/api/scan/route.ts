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

    const scrapedData = await scrapeWebsite(url);

    const aiResult = await analyzeSEO(scrapedData);

    const newScan = await prisma.scan.create({
      data: {
        url,
        score: aiResult.score,
        summary: aiResult.summary,
        criticalFixes: aiResult.criticalFixes,
        metaTitle: scrapedData.metaTitle,
        metaDescription: scrapedData.metaDescription,
        h1Count: scrapedData.h1Count,
        missingAltCount: scrapedData.missingAltCount,
        wordCount: scrapedData.wordCount,
        userId: userId || null,
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
