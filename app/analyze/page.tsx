"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, ShieldCheck, Gauge, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";

const Analyze = () => {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");

  const analysisSteps = [
    "Connecting to site...",
    "Extracting HTML & Meta Tags...",
    "Running AI SEO Analysis...",
    "Generating Final Report...",
  ];

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

  return (
    <div className="bg-[#030712] min-h-[calc(100vh-4rem)] w-full flex flex-col justify-between lg:mt-20 relative">
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

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center w-full max-w-4xl text-center">
          <div className="mb-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-lime-500/30 bg-lime-500/10 shadow-[0_0_15px_rgba(163,230,53,0.15)]">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span className="text-lime-400 text-xs font-semibold tracking-wide">
              Instant Analyze
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-lime-400 select-none drop-shadow-[0_0_35px_rgba(163,230,53,0.35)] transform-gpu will-change-transform tracking-tight">
            Deep Site
          </h1>
          <span className="font-bold text-3xl sm:text-5xl lg:text-6xl text-lime-400 mt-2 select-none text-center drop-shadow-[0_0_35px_rgba(132,204,22,0.35)] transform-gpu will-change-transform">
            Audit & Intelligence
          </span>
          <p className="text-white/40 mt-4 text-xs sm:text-sm md:text-base max-w-xl sm:max-w-2xl leading-relaxed select-none">
            Run deep real-time audits on any web page. Analyze Core Web Vitals,
            HTML structural integrity, security headers, and performance
            bottlenecks in seconds.
          </p>

          <div className="mt-8 w-full max-w-xl px-2">
            <form
              onSubmit={handleAnalyze}
              className="relative flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl sm:rounded-full bg-[#0a0f1d]/80 border border-lime-500/30 shadow-[0_0_25px_rgba(163,230,53,0.15)] focus-within:border-lime-400 focus-within:shadow-[0_0_35px_rgba(163,230,53,0.3)] transition-all duration-300 transform-gpu will-change-transform"
            >
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste website URL (e.g. https://example.com)"
                className="w-full bg-transparent px-5 py-2.5 sm:py-2 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl sm:rounded-full bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(163,230,53,0.4)] hover:shadow-[0_0_30px_rgba(163,230,53,0.7)] active:scale-95 transition-all duration-200 cursor-pointer transform-gpu will-change-transform disabled:opacity-50"
              >
                <span>{isAnalyzing ? "Analyzing..." : "Analyze Site"}</span>
                <svg
                  className="w-4 h-4 text-black"
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
              </button>
            </form>
            {error && (
              <p className="text-red-400 text-xs sm:text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full max-w-2xl px-2">
            <div className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-[#0a0f1d]/50 border border-white/5 shadow-sm">
              <Zap className="w-4 h-4 text-lime-400" />
              <span className="text-white/70 text-xs font-medium">
                Instant Analysis
              </span>
            </div>
            <div className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-[#0a0f1d]/50 border border-white/5 shadow-sm">
              <Gauge className="w-4 h-4 text-lime-400" />
              <span className="text-white/70 text-xs font-medium">
                Core Web Vitals
              </span>
            </div>
            <div className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-[#0a0f1d]/50 border border-white/5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              <span className="text-white/70 text-xs font-medium">
                Security Header Checks
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="lg:mt-77">
        <Footer />
      </div>
    </div>
  );
};

export default Analyze;