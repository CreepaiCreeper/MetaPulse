import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ id: string }>;
};

function getUserId(request: NextRequest): string | null {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
}

function safeJsonParse(data: unknown) {
  if (data === null || data === undefined) return null;
  if (typeof data === "object") return data;
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch (err) {
    console.error("JSON parse error for value:", data, err);
    return data;
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const scan = await prisma.scan.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!scan) {
      return NextResponse.json(
        { success: false, message: "Scan report not found" },
        { status: 404 }
      );
    }

    const reportData = {
      id: scan.id,
      url: scan.url,
      timestamp: scan.createdAt ? new Date(scan.createdAt).toLocaleString() : new Date().toLocaleString(),
      createdAt: scan.createdAt,
      scores: safeJsonParse(scan.scores),
      quickStats: safeJsonParse(scan.quickStats),
      issuesSummary: safeJsonParse(scan.issuesSummary),
      issues: safeJsonParse(scan.issues),
      linksAnalysis: safeJsonParse(scan.linksAnalysis),
      imagesAudit: safeJsonParse(scan.imagesAudit),
      headingStructure: safeJsonParse(scan.headingStructure),
      topKeywords: safeJsonParse(scan.topKeywords),
      metaTags: safeJsonParse(scan.metaTags),
    };

    return NextResponse.json({ success: true, report: reportData, scan: reportData });
  } catch (error) {
    console.error("Fetch scan error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingScan = await prisma.scan.findFirst({
      where: { id, userId },
    });

    if (!existingScan) {
      return NextResponse.json(
        { success: false, message: "Scan not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.scan.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Scan deleted successfully",
    });
  } catch (error) {
    console.error("Delete scan error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}