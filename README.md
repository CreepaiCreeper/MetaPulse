<div align="center">

# ⚡ MetaPulse — AI Web Intelligence

**Instant AI-powered SEO, performance, and accessibility audits.**

[![Next.js 15](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://meta-pulse-woad.vercel.app/)

### 🌐 [Live Demo](https://meta-pulse-woad.vercel.app/)

</div>

---

## 🌟 Overview

**MetaPulse** scans websites against 70+ technical signals, Core Web Vitals, and security factors—turning raw audit metrics into actionable, AI-generated code fixes in seconds.

---

## ✨ Core Features

- 🎯 **Deep Technical Audit:** Scans meta tags, canonicals, indexability, and heading structures.
- ⚡ **Core Web Vitals:** Real-time tracking for LCP, CLS, and page load speed.
- 🧠 **AI-Powered Solutions:** Auto-generated code snippets and priority fixes.
- 🔒 **Security Check:** SSL health, security headers, and domain trust validation.
- 🔖 **Report Management:** Save, track, and delete historical scan reports easily.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Next.js API Routes, JWT Authentication
- **Database & ORM:** PostgreSQL, Prisma ORM
- **Deployment:** Vercel

---

## 🚀 Step-by-Step Setup Guide

### Step 1: Clone & Install Dependencies
```bash
git clone [https://github.com/your-username/metapulse.git](https://github.com/your-username/metapulse.git)
cd metapulse
npm install

Step 2: Configure Environment Variables
Create a .env file in the root directory:

DATABASE_URL="postgresql://username:password@localhost:5432/metapulse"
JWT_SECRET="your_secure_jwt_secret"

Step 3: Set Up Database
Push the Prisma schema to your PostgreSQL database and generate client types:

npx prisma db push
npx prisma generate

Step 4: Run Development Server

npm run dev

Open http://localhost:3000 in your browser.

📖 How to Use MetaPulse

1.Enter URL: Paste any live website URL into the main search input.
2.Run Analysis: Click Analyze to generate a real-time technical & SEO audit report.
3.Review Metrics: View Core Web Vitals, meta configuration, and security scores.
4.Apply AI Fixes: Copy the AI-recommended code snippets directly into your codebase.
5.Save & Manage: Bookmark scan results or delete old reports directly from your dashboard.

Crafted with by MetaPulse
