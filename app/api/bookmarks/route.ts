import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

function getUserId(request: NextRequest): string | null {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    return decoded.id;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, bookmarks });
  } catch (error) {
    console.error("Fetch bookmarks error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { url, title } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, message: "URL is required" },
        { status: 400 },
      );
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        url,
        title: title || null,
        userId,
      },
    });

    return NextResponse.json({ success: true, bookmark });
  } catch (error) {
    console.error("Create bookmark error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add bookmark" },
      { status: 500 },
    );
  }
}
