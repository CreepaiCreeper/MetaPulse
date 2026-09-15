import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    if (!decoded?.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const deletedScan = await prisma.scan.deleteMany({
      where: {
        id: id,
        userId: decoded.userId,
      },
    });

    if (deletedScan.count === 0) {
      return NextResponse.json(
        { success: false, error: "Scan record not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Scan history entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting scan entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete scan entry" },
      { status: 500 }
    );
  }
}