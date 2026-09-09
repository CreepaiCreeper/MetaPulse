"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  TrendingUp,
  BarChart2,
  Search,
  ArrowRight,
  Clock,
} from "lucide-react";

const Page = () => {
  const [urlInput, setUrlInput] = useState("");

  const recentAnalyses = [
    {
      id: "1",
      name: "amazon.in",
      url: "https://amazon.in/",
      date: "5/6/2026",
      overallScore: 72,
      seo: 65,
      perf: 50,
      a11y: 85,
      bp: 70,
    },
    {
      id: "2",
      name: "ebay.in",
      url: "https://ebay.in/",
      date: "5/6/2026",
      overallScore: 72,
      seo: 65,
      perf: 55,
      a11y: 60,
      bp: 80,
    },
    {
      id: "3",
      name: "microsoft.com",
      url: "https://microsoft.com/",
      date: "5/6/2026",
      overallScore: 75,
      seo: 85,
      perf: 75,
      a11y: 70,
      bp: 80,
    },
    {
      id: "4",
      name: "greatstack.dev",
      url: "https://greatstack.dev/",
      date: "5/6/2026",
      overallScore: 93,
      seo: 91,
      perf: 100,
      a11y: 90,
      bp: 90,
    },
    {
      id: "5",
      name: "www.browserbase.com",
      url: "https://www.browserbase.com/",
      date: "4/17/2026",
      overallScore: 81,
      seo: 80,
      perf: 100,
      a11y: 60,
      bp: 85,
    },
    {
      id: "6",
      name: "vercel.com",
      url: "https://vercel.com/",
      date: "4/16/2026",
      overallScore: 91,
      seo: 86,
      perf: 93,
      a11y: 83,
      bp: 100,
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) {
      return {
        text: "text-[#10b981]",
        stroke: "#10b981",
      };
    }
    if (score >= 50) {
      return {
        text: "text-amber-500",
        stroke: "#f59e0b",
      };
    }
    return {
      text: "text-red-500",
      stroke: "#ef4444",
    };
  };

  return (
    <div className="bg-[#030712] min-h-screen w-full text-white font-sans">
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Banner */}
        <div className="flex flex-col gap-1 text-left select-none">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-lime-400 drop-shadow-[0_0_20px_rgba(163,230,53,0.35)]">
            Welcome back
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            Analyze websites and boost your SEO performance.
          </p>
        </div>

        {/* Search URL Input Bar */}
        <div className="mt-8 w-full">
          <div className="relative flex items-center w-full p-1.5 rounded-full bg-[#0a0f1d]/80 border border-lime-500/30 shadow-[0_0_25px_rgba(163,230,53,0.15)] focus-within:border-lime-400 focus-within:shadow-[0_0_35px_rgba(163,230,53,0.3)] transition-all duration-300">
            <Search className="w-5 h-5 text-zinc-400 ml-4 shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste website URL (e.g. https://example.com)..."
              className="w-full bg-transparent px-4 py-2 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
            <button
              type="button"
              className="shrink-0 flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-6 sm:py-2.5 rounded-full bg-lime-500 hover:bg-lime-400 text-black font-bold text-[11px] sm:text-sm tracking-wide shadow-[0_0_20px_rgba(163,230,53,0.5)] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span>Analyze Site</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#0a0f1d]/60 border border-white/5 hover:border-lime-500/20 transition-all duration-200">
            <div className="p-3 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">7</div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">
                Total Scans
              </div>
            </div>
          </div>

          {/* Avg Score */}
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#0a0f1d]/60 border border-white/5 hover:border-lime-500/20 transition-all duration-200">
            <div className="p-3 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#10b981]">82</div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">
                Avg Score
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#0a0f1d]/60 border border-white/5 hover:border-lime-500/20 transition-all duration-200">
            <div className="p-3 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-lime-400">3</div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">
                Scans Left Today
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-lime-400 drop-shadow-[0_0_20px_rgba(163,230,53,0.35)] ">
            Recent Analyses
          </h2>
          <Link
            href="/history"
            className="text-xs sm:text-sm text-lime-400 hover:text-lime-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentAnalyses.map((item) => {
            const overallColor = getScoreColor(item.overallScore);
            const seoColor = getScoreColor(item.seo);
            const perfColor = getScoreColor(item.perf);
            const a11yColor = getScoreColor(item.a11y);
            const bpColor = getScoreColor(item.bp);

            const circumference = 2 * Math.PI * 18;
            const strokeDashoffset =
              circumference - (item.overallScore / 100) * circumference;

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between p-5 rounded-2xl bg-[#0a0f1d]/60 border border-lime-500/20 hover:border-lime-500/50 hover:shadow-[0_0_25px_rgba(163,230,53,0.15)] transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <h3 className="font-bold text-sm sm:text-base tracking-tight text-lime-500 truncate max-w-[170px]">
                      {item.name}
                    </h3>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-400 hover:text-zinc-200 truncate max-w-[170px] mt-0.5"
                    >
                      {item.url}
                    </a>
                  </div>

                  <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-zinc-800"
                        fill="transparent"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke={overallColor.stroke}
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <span
                      className={`absolute font-bold text-xs ${overallColor.text}`}
                    >
                      {item.overallScore}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  <div className="grid grid-cols-4 gap-2 text-center pt-2">
                    <div>
                      <div className={`font-bold text-xs ${seoColor.text}`}>
                        {item.seo}
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold mt-0.5">
                        SEO
                      </div>
                    </div>
                    <div>
                      <div className={`font-bold text-xs ${perfColor.text}`}>
                        {item.perf}
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold mt-0.5">
                        Perf
                      </div>
                    </div>
                    <div>
                      <div className={`font-bold text-xs ${a11yColor.text}`}>
                        {item.a11y}
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold mt-0.5">
                        A11y
                      </div>
                    </div>
                    <div>
                      <div className={`font-bold text-xs ${bpColor.text}`}>
                        {item.bp}
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold mt-0.5">
                        BP
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] tracking-tight text-zinc-500 pt-1 border-t border-white/5">
                    <Clock className="w-3.5 h-3.5 text-lime-500 " />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Page;