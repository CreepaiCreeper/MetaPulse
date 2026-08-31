import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email address" },
        { status: 404 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email: user.email },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpiry: tokenExpiry,
      },
    });

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;

    const { data, error } = await resend.emails.send({
      from: "MetaPulse <onboarding@resend.dev>", 
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: sans-serif; background-color: #030712; color: #f1f5f9; padding: 40px; border-radius: 12px;">
          <h2 style="color: #ffffff;">Password Reset Request</h2>
          <p style="color: #94a3b8; font-size: 14px;">
            You requested to reset your password. Click the button below to set a new password. This link is valid for 1 hour.
          </p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #f8fafc; color: #0f172a; padding: 12px 24px; font-weight: 600; font-size: 14px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
            Reset Password
          </a>
          <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Reset link has been sent." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}