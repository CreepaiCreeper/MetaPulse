"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, ExternalLink, Trash2, Clock, Plus, Loader2 } from "lucide-react";

interface ScanItem {
  id: string;
  url: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  score: number | null;
  metaTitle: string | null;
  wordCount: number;
  h1Count: number;
  missingAltCount: number;
  loadTimeMs: number | null;
  summary: string | null;
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<ScanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/history", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch history");
      }

      const result = await res.json();
      const historyList = Array.isArray(result) ? result : result.data || [];
      setData(historyList);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this analysis entry?")) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/history/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setData((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Failed to delete entry. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting history entry:", error);
      alert("Something went wrong while deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) {
      return { text: "text-[#10b981]", stroke: "#10b981" };
    }
    if (score >= 50) {
      return { text: "text-amber-500", stroke: "#f59e0b" };
    }
    return { text: "text-red-500", stroke: "#ef4444" };
  };

  const filteredData = data.filter(
    (item) =>
      item.metaTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#030712] min-h-screen w-full flex flex-col justify-between text-white">
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div className="flex flex-col gap-1 text-left">
            <h1 className="text-2xl sm:text-4xl font-bold text-lime-400 drop-shadow-[0_0_20px_rgba(163,230,53,0.35)] tracking-tight select-none">
              Your <span className="text-lime-400">History</span>
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
              <Plus className="block lg:hidden w-4 h-4 stroke-[3]" />
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mt-5 w-full">
          <div className="relative flex items-center w-full p-1 rounded-full bg-[#0a0f1d]/80 border border-lime-500/30 shadow-[0_0_25px_rgba(163,230,53,0.15)] focus-within:border-lime-400 transition-all duration-300">
            <Search className="w-5 h-5 text-zinc-400 ml-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by website URL or meta title..."
              className="w-full bg-transparent px-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="mt-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin text-lime-400" />
            <p className="text-sm">Loading your scan history...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center p-8 rounded-2xl bg-[#0a0f1d]/40 border border-white/5 text-center">
            <p className="text-zinc-400 text-sm sm:text-base font-medium">
              {searchQuery ? "No matching records found." : "No analysis history available yet."}
            </p>
            <Link href="/analyze" className="mt-4">
              <span className="text-xs text-lime-400 hover:underline font-bold">
                Run your first analysis →
              </span>
            </Link>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            {filteredData.map((item) => {
              const currentScore = item.score || 0;
              const overallColor = getScoreColor(currentScore);
              const circumference = 2 * Math.PI * 22;
              const strokeDashoffset = circumference - (currentScore / 100) * circumference;

              return (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#0a0f1d]/60 border border-white/5 hover:border-white/10 transition-all duration-200 gap-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Circle Score Gauge */}
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
                      <span className={`absolute font-bold text-sm ${overallColor.text}`}>
                        {currentScore}
                      </span>
                    </div>

                    {/* Site Details */}
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-sm sm:text-base text-zinc-100 truncate max-w-[250px] sm:max-w-[400px]">
                        {item.metaTitle || item.url}
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
                        <span className="px-2 py-0.5 rounded-full bg-[#10b981]/10 text-[#10b981] text-[10px] font-medium border border-[#10b981]/20">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Analytics metrics based on Scan Model */}
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 sm:gap-8 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="flex items-center gap-4 sm:gap-6 text-center">
                      <div>
                        <div className="font-bold text-sm text-zinc-200">{item.wordCount}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-semibold">Words</div>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-zinc-200">{item.h1Count}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-semibold">H1s</div>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-zinc-200">{item.missingAltCount}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-semibold">No-Alt</div>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-zinc-200">
                          {item.loadTimeMs ? `${item.loadTimeMs}ms` : "N/A"}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase font-semibold">Speed</div>
                      </div>
                    </div>

                    {/* Actions */}
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
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="p-2 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                        title="Delete entry"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;