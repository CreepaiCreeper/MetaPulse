import React from "react";
import { Zap, ShieldCheck, Gauge } from "lucide-react";
import Footer from "@/components/Footer";

const Analyze = () => {
  return (
    <div className="bg-[#030712] min-h-[calc(100vh-4rem)] w-full flex flex-col justify-between lg:mt-20">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center w-full max-w-4xl text-center">
          {/* Credits Badge */}
          <div className="mb-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-lime-500/30 bg-lime-500/10 shadow-[0_0_15px_rgba(163,230,53,0.15)]">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span className="text-lime-400 text-xs font-semibold tracking-wide">
              Instant Analyze
            </span>
          </div>

          {/* Main Heading */}
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

          {/* Input Box Section */}
          <div className="mt-8 w-full max-w-xl px-2">
            <div className="relative flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl sm:rounded-full bg-[#0a0f1d]/80 border border-lime-500/30 shadow-[0_0_25px_rgba(163,230,53,0.15)] focus-within:border-lime-400 focus-within:shadow-[0_0_35px_rgba(163,230,53,0.3)] transition-all duration-300 transform-gpu will-change-transform">
              <input
                type="url"
                placeholder="Paste website URL (e.g. https://example.com)"
                className="w-full bg-transparent px-5 py-2.5 sm:py-2 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              />
              <button
                type="button"
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl sm:rounded-full bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(163,230,53,0.4)] hover:shadow-[0_0_30px_rgba(163,230,53,0.7)] active:scale-95 transition-all duration-200 cursor-pointer transform-gpu will-change-transform"
              >
                <span>Analyze Site</span>
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
            </div>
          </div>

          {/* Feature Badges */}
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
      <div className=" lg:mt-77">

      <Footer/>
      </div>
    </div>
  );
};

export default Analyze;