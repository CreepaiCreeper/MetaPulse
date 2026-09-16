"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Globe,
  TrendingUp,
  BarChart2,
  Search,
  ArrowRight,
  Clock,
  Loader2,
} from "lucide-react";

interface ScanItem {
  id: string;
  url: string;
  metaTitle?: string;
  score: number;
  date?: string;
  seo?: number;
  perf?: number;
  a11y?: number;
  bp?: number;
}

interface DashboardStats {
  totalScans: number;
  avgScore: number;
  scansLeftToday: number;
  subscriptionTier: string;
}

const Page = () => {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");

  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 0,
    avgScore: 0,
    scansLeftToday: 0,
    subscriptionTier: "FREE",
  });
  const [recentAnalyses, setRecentAnalyses] = useState<ScanItem[]>([]);

  const analysisSteps = [
    "Connecting to site...",
    "Extracting HTML & Meta Tags...",
    "Running AI SEO Analysis...",
    "Generating Final Report...",
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch dashboard");

        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecentAnalyses(data.recentScans);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      }finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      setCurrentStep(0);
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < analysisSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing, analysisSteps.length]);

  useEffect(() => {
    if (isAnalyzing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAnalyzing]);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setError("");

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to analyze website");
      }

      if (data.scan && data.scan.id) {
        router.push(`/report/${data.scan.id}`);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
      setIsAnalyzing(false);
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

  return (
    <div className="bg-[#030712] min-h-screen w-full text-white font-sans">
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-[#030712]/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0a0f1d] border-2 border-lime-400/80 shadow-[0_0_60px_rgba(163,230,53,0.35)] max-w-md w-full flex flex-col items-center text-center relative overflow-hidden transition-all">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-lime-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-lime-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-center justify-center mb-6">
              <Loader2 className="w-14 h-14 text-lime-400 animate-spin drop-shadow-[0_0_20px_rgba(163,230,53,0.8)]" />
            </div>

            <h3 className="text-2xl font-extrabold text-lime-400 tracking-wide drop-shadow-[0_0_15px_rgba(163,230,53,0.5)] mb-2">
              Analyzing Website
            </h3>
            <p className="text-white/80 font-medium text-sm mb-8 animate-pulse tracking-wide">
              {analysisSteps[currentStep]}
            </p>

            <div className="w-full space-y-3">
              {analysisSteps.map((step, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-xs font-bold transition-all duration-300 ${
                      isDone
                        ? "bg-lime-500/10 border-lime-500/50 text-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.15)]"
                        : isCurrent
                        ? "bg-lime-400 text-black border-lime-400 shadow-[0_0_25px_rgba(163,230,53,0.6)] animate-pulse"
                        : "bg-white/5 border-white/10 text-white/30"
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        isDone
                          ? "bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,1)]"
                          : isCurrent
                          ? "bg-black"
                          : "bg-white/20"
                      }`}
                    />
                    <span className="truncate">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-1 text-left select-none">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-lime-400 drop-shadow-[0_0_20px_rgba(163,230,53,0.35)]">
            Welcome back
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            Analyze websites and boost your SEO performance.
          </p>
        </div>

        {/* Input & Form */}
        <div className="mt-8 w-full">
          <form
            onSubmit={handleAnalyze}
            className="relative flex items-center w-full p-1.5 rounded-full bg-[#0a0f1d]/80 border border-lime-500/30 shadow-[0_0_25px_rgba(163,230,53,0.15)] focus-within:border-lime-400 focus-within:shadow-[0_0_35px_rgba(163,230,53,0.3)] transition-all duration-300"
          >
            <Search className="w-5 h-5 text-zinc-400 ml-4 shrink-0" />
            <input
              type="url"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste website URL (e.g. https://example.com)..."
              className="w-full bg-transparent px-4 py-2 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isAnalyzing}
              className="shrink-0 flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-6 sm:py-2.5 rounded-full bg-lime-500 hover:bg-lime-400 text-black font-bold text-[11px] sm:text-sm tracking-wide shadow-[0_0_20px_rgba(163,230,53,0.5)] active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <span>{isAnalyzing ? "Analyzing..." : "Analyze Site"}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>
          </form>
          {error && (
            <p className="text-red-400 text-xs sm:text-sm mt-2 ml-4">{error}</p>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#0a0f1d]/60 border border-white/5 hover:border-lime-500/20 transition-all duration-200">
            <div className="p-3 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {loading ? "..." : stats.totalScans}
              </div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">
                Total Scans
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#0a0f1d]/60 border border-white/5 hover:border-lime-500/20 transition-all duration-200">
            <div className="p-3 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#10b981]">
                {loading ? "..." : stats.avgScore}
              </div>
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
              <div className="text-2xl font-bold text-lime-400">
                {loading ? "..." : stats.scansLeftToday}
              </div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">
                Scans Left Today
              </div>
            </div>
          </div>
        </div>

        {/* Recent Analyses Header */}
        <div className="mt-12 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-lime-400 drop-shadow-[0_0_20px_rgba(163,230,53,0.35)]">
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

        {/* Recent Analyses List */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-lime-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : recentAnalyses.length === 0 ? (
          <div className="mt-6 text-center py-10 border border-dashed border-white/10 rounded-2xl text-zinc-500">
            No scans analyzed yet. Paste a URL above to get started!
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentAnalyses.map((item) => {
              const overallScore = item.score || 0;
              const overallColor = getScoreColor(overallScore);

              const seoScore = item.seo ?? overallScore;
              const perfScore = item.perf ?? overallScore;
              const a11yScore = item.a11y ?? overallScore;
              const bpScore = item.bp ?? overallScore;

              const seoColor = getScoreColor(seoScore);
              const perfColor = getScoreColor(perfScore);
              const a11yColor = getScoreColor(a11yScore);
              const bpColor = getScoreColor(bpScore);

              const circumference = 2 * Math.PI * 18;
              const strokeDashoffset =
                circumference - (overallScore / 100) * circumference;

              const formattedName = item.url
                .replace(/^https?:\/\//, "")
                .replace(/\/$/, "");

              return (
                <div
                  key={item.id}
                  onClick={() => router.push(`/report/${item.id}`)}
                  className="flex flex-col justify-between p-5 rounded-2xl bg-[#0a0f1d]/60 border border-lime-500/20 hover:border-lime-500/50 hover:shadow-[0_0_25px_rgba(163,230,53,0.15)] transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <h3 className="font-bold text-sm sm:text-base tracking-tight text-lime-500 truncate max-w-[170px]">
                        {formattedName}
                      </h3>
                      <span className="text-xs text-zinc-400 truncate max-w-[170px] mt-0.5">
                        {item.url}
                      </span>
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
                        {overallScore}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-4">
                    <div className="grid grid-cols-4 gap-2 text-center pt-2">
                      <div>
                        <div className={`font-bold text-xs ${seoColor.text}`}>
                          {seoScore}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase font-semibold mt-0.5">
                          SEO
                        </div>
                      </div>
                      <div>
                        <div className={`font-bold text-xs ${perfColor.text}`}>
                          {perfScore}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase font-semibold mt-0.5">
                          Perf
                        </div>
                      </div>
                      <div>
                        <div className={`font-bold text-xs ${a11yColor.text}`}>
                          {a11yScore}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase font-semibold mt-0.5">
                          A11y
                        </div>
                      </div>
                      <div>
                        <div className={`font-bold text-xs ${bpColor.text}`}>
                          {bpScore}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase font-semibold mt-0.5">
                          BP
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] tracking-tight text-zinc-500 pt-1 border-t border-white/5">
                      <Clock className="w-3.5 h-3.5 text-lime-500" />
                      <span>{item.date || "Recently"}</span>
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