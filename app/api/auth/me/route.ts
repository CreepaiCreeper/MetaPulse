import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };

    return NextResponse.json(
      { authenticated: true, user: decoded },
      { status: 200 },
    );
  } catch {
    const response = NextResponse.json(
      { authenticated: false },
      { status: 200 },
    );
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    return response;
  }
}