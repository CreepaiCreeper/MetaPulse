import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

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
        { success: false, error: "Invalid token payload" },
        { status: 401 }
      );
    }

    const scans = await prisma.scan.findMany({
      where: {
        userId: decoded.id,
      },
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        url: true,
        status: true,
        score: true,
        metaTitle: true,
        wordCount: true,
        h1Count: true,
        missingAltCount: true,
        loadTimeMs: true,
        summary: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: scans,
    });
  } catch (error) {
    console.error("Error fetching scan history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch scan history" },
      { status: 500 }
    );
  }
}
