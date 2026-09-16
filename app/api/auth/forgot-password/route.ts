import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendMail, passwordResetTemplate } from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    const genericResponse = NextResponse.json(
      { message: "If an account exists for that email, a reset link has been sent." },
      { status: 200 },
    );

    if (!user) {
      return genericResponse;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email: user.email },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpiry: tokenExpiry,
      },
    });
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";
    const resetUrl = `${origin.replace(/\/$/, "")}/reset-password?token=${resetToken}`;

    const result = await sendMail({
      to: user.email,
      subject: "Reset Your MetaPulse Password",
      html: passwordResetTemplate(resetUrl),
    });

    if (!result.ok) {
      console.error("Password reset email failed:", result.error);

      if (process.env.NODE_ENV !== "production") {
        console.log(`\n[MetaPulse DEV] Reset link for ${user.email}:\n${resetUrl}\n`);
        return NextResponse.json(
          {
            message: "Email sending failed, but a reset link was printed to your server console.",
            devResetUrl: resetUrl,
            devError: result.error,
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        { message: "We couldn't send the reset email right now. Please try again later." },
        { status: 500 },
      );
    }

    return genericResponse;
  } catch (error: unknown) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
