import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 },
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const CreateUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const token = jwt.sign(
      { id: CreateUser.id, email: CreateUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "15d" },
    );

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          name: CreateUser.name,
          image: CreateUser.image,
        },
      },
      { status: 201 },
    );

    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 24 * 60 * 60, 
        path: "/",
    });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
