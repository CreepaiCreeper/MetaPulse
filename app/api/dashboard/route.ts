import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const TIER_LIMITS = {
  FREE: 5,
  STARTER: 25,
  ULTIMATE: 100,
};

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    if (!decoded?.id) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        scans: {
          orderBy: { id: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const totalScans = user.scans.length;

    const validScores = user.scans
      .map((s) => s.score)
      .filter((score): score is number => score !== null);

    const avgScore =
      validScores.length > 0
        ? Math.round(
            validScores.reduce((acc, curr) => acc + curr, 0) / validScores.length
          )
        : 0;

    const today = new Date().toDateString();
    const lastScanDate = new Date(user.lastScanDate).toDateString();
    const currentDailyCount = today === lastScanDate ? user.dailyScansCount : 0;

    const maxAllowed = TIER_LIMITS[user.subscriptionTier] || 5;
    const scansLeftToday = Math.max(0, maxAllowed - currentDailyCount);

    const recentScans = user.scans.slice(0, 6).map((scan) => ({
      id: scan.id,
      url: scan.url,
      metaTitle: scan.metaTitle || scan.url,
      score: scan.score || 0,
      wordCount: scan.wordCount,
      h1Count: scan.h1Count,
      missingAltCount: scan.missingAltCount,
      loadTimeMs: scan.loadTimeMs,
      status: scan.status,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalScans,
        avgScore,
        scansLeftToday,
        subscriptionTier: user.subscriptionTier,
      },
      recentScans,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load dashboard metrics" },
      { status: 500 }
    );
  }
}
