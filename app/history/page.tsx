"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, Trash2, Clock, Plus } from "lucide-react";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const data = [
    {
      id: "1",
      name: "amazon.tr",
      url: "https://amazon.tr/",
      date: "08-08-2026",
      status: "completed",
      overallScore: 72,
      seo: 65,
      perf: 50,
      a11y: 85,
      bp: 70,
    },
    {
      id: "2",
      name: "metapulse.io",
      url: "https://metapulse.io/",
      date: "09-08-2026",
      status: "completed",
      overallScore: 92,
      seo: 95,
      perf: 88,
      a11y: 90,
      bp: 96,
    },
    {
      id: "3",
      name: "slowsite.com",
      url: "https://slowsite.com/",
      date: "01-08-2026",
      status: "completed",
      overallScore: 42,
      seo: 45,
      perf: 30,
      a11y: 55,
      bp: 40,
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) {
      return {
        text: "text-[#10b981]",
        border: "border-[#10b981]",
        stroke: "#10b981",
      };
    }
    if (score >= 50) {
      return {
        text: "text-amber-500",
        border: "border-amber-500",
        stroke: "#f59e0b",
      };
    }
    return {
      text: "text-red-500",
      border: "border-red-500",
      stroke: "#ef4444",
    };
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#030712] min-h-screen w-full flex flex-col justify-between text-white">
      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div className="flex flex-col gap-1 text-left">
            <h1 className="text-2xl sm:text-4xl font-bold text-lime-400 drop-shadow-[0_0_20px_rgba(163,230,53,0.35)] tracking-tight select-none">
              Your{" "}
              <span className="text-lime-400 drop-shadow-[0_0_20px_rgba(163,230,53,0.35)]">
                History
              </span>
            </h1>
            <p className="text-white/40 text-xs sm:text-sm select-none">
              View and manage all your past site analysis records.
            </p>
          </div>

          <Link href="/analyze">
            <button
              type="button"
              className="shrink-0 flex items-center justify-center gap-2 p-2.5 lg:px-6 lg:py-2 rounded-full bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs lg:text-sm tracking-wide shadow-[0_0_20px_rgba(163,230,53,0.5)] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span className="hidden lg:inline">New Analysis</span>
              <svg
                className="hidden lg:block w-4 h-4 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>

              <Plus className="block lg:hidden w-4 h-4 stroke-[3]" />
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mt-5 w-full">
          <div className="relative flex items-center w-full p-1 rounded-full bg-[#0a0f1d]/80 border border-lime-500/30 shadow-[0_0_25px_rgba(163,230,53,0.15)] focus-within:border-lime-400 focus-within:shadow-[0_0_35px_rgba(163,230,53,0.3)] transition-all duration-300">
            <Search className="w-5 h-5 text-zinc-400 ml-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by website URL..."
              className="w-full bg-transparent px-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {filteredData.map((item) => {
            const overallColor = getScoreColor(item.overallScore);
            const seoColor = getScoreColor(item.seo);
            const perfColor = getScoreColor(item.perf);
            const a11yColor = getScoreColor(item.a11y);
            const bpColor = getScoreColor(item.bp);

            const circumference = 2 * Math.PI * 22;
            const strokeDashoffset =
              circumference - (item.overallScore / 100) * circumference;

            return (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#0a0f1d]/60 border border-white/5 hover:border-white/10 transition-all duration-200 gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r="22"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        className="text-zinc-800"
                        fill="transparent"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="22"
                        stroke={overallColor.stroke}
                        strokeWidth="3.5"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <span
                      className={`absolute font-bold text-sm ${overallColor.text}`}
                    >
                      {item.overallScore}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-sm sm:text-base text-zinc-100">
                      {item.name}
                    </h3>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-400 hover:text-zinc-200 truncate max-w-[200px] sm:max-w-[300px]"
                    >
                      {item.url}
                    </a>
                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.date}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#10b981]/10 text-[#10b981] text-[10px] font-medium border border-[#10b981]/20">
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 sm:gap-8 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">

                  <div className="flex items-center gap-4 sm:gap-6 text-center">
                    <div>
                      <div className={`font-bold text-sm ${seoColor.text}`}>
                        {item.seo}
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold">
                        SEO
                      </div>
                    </div>
                    <div>
                      <div className={`font-bold text-sm ${perfColor.text}`}>
                        {item.perf}
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold">
                        Perf
                      </div>
                    </div>
                    <div>
                      <div className={`font-bold text-sm ${a11yColor.text}`}>
                        {item.a11y}
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold">
                        A11y
                      </div>
                    </div>
                    <div>
                      <div className={`font-bold text-sm ${bpColor.text}`}>
                        {item.bp}
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold">
                        BP
                      </div>
                    </div>
                  </div>

                  {/* Icons */}
                  <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-white/5 transition-colors"
                      title="Open URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      className="p-2 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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