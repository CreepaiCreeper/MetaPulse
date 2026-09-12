import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MetaPulse",
  description: "Web Intelligence Platform",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userTier = "FREE";
  let isAuthenticated = false;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { email: string };

      if (decoded?.email) {
        const user = await prisma.user.findUnique({
          where: { email: decoded.email },
          select: { subscriptionTier: true },
        });

        isAuthenticated = true;

        if (user?.subscriptionTier) {
          userTier = user.subscriptionTier;
        }
      }
    }
  } catch (error) {
    console.error("Auth layout error:", error);
    isAuthenticated = false;
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Navbar userTier={userTier} initialIsAuthenticated={isAuthenticated} />
        {children}
      </body>
    </html>
  );
}