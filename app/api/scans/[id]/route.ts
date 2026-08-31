import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

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

// 1. GET Single Scan Detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    return NextResponse.json({ success: true, scan });
  } catch (error) {
    console.error("Fetch single scan error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// 2. DELETE Single Scan
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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