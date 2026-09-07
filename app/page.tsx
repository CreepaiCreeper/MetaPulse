import React from "react";
import { HomeWave } from "./assets/page";
import {
  Check,
  FileCode2,
  SearchCheck,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import Footer from "@/components/Footer";

const Page = () => {
  const features = [
    {
      Icon: SearchCheck,
      Title: "Deep Audit Engine",
      Desc: "Scans over 70+ ranking signals including meta tags, canonicals, and indexing readiness.",
    },
    {
      Icon: Zap,
      Title: "Speed & Core Vitals",
      Desc: "Real-time LCP, CLS, and FID performance profiling to eliminate page load delays.",
    },
    {
      Icon: Sparkles,
      Title: "AI Fix Recommendations",
      Desc: "Step-by-step code snippets and priority patches generated directly for your tech stack.",
    },
    {
      Icon: ShieldCheck,
      Title: "Security & SSL Health",
      Desc: "Verifies HTTPS configuration, security headers, open ports, and domain trust factors.",
    },
    {
      Icon: Smartphone,
      Title: "Mobile Responsiveness",
      Desc: "Tests viewport sizing, touch target elements, and mobile-first indexing standards.",
    },
    {
      Icon: FileCode2,
      Title: "Content & Schema Check",
      Desc: "Validates JSON-LD structured data, heading hierarchy, and keyword placement accuracy.",
    },
  ];

  const plans = [
    {
      id: "free",
      name: "Free Tier",
      price: "$0",
      type: "forever",
      description:
        "Quick daily checks for individual site owners and casual testing.",
      features: [
        "5 Free Analyses Per Day",
        "Basic SEO Score Overview",
        "Meta Tag & Title Inspection",
        "Mobile Responsiveness Test",
        "Community Support",
      ],
      highlighted: false,
      ctaText: "Get Started Free",
    },
    {
      id: "starter",
      name: "Starter Plan",
      price: "$9",
      type: "one-time",
      description:
        "Essential toolkit for developers and site owners auditing core web metrics.",
      features: [
        "15 Detailed Page Audits",
        "Lighthouse Performance Metrics",
        "Broken Link & Redirect Detection",
        "Core Web Vitals Breakdown",
        "HTML Structure & DOM Inspection",
        "Standard Email Support",
      ],
      highlighted: false,
      ctaText: "Buy Now",
    },
    {
      id: "ultimate",
      name: "Ultimate Plan",
      price: "$29",
      type: "one-time",
      description:
        "Advanced intelligence suite for technical teams and web agencies.",
      features: [
        "100 Detailed Page Audits",
        "Security Headers & SSL Check",
        "Competitor Performance Contrast",
        "JavaScript Bundle Analysis",
        "API Access for Raw Data",
        "Priority Queue Processing",
        "24/7 Dedicated Support",
      ],
      highlighted: true,
      badge: "MOST POPULAR",
      ctaText: "Buy Now",
    },
  ];

  return (
    <div className="bg-[#030712] min-h-screen w-full flex flex-col items-center px-4 pb-24">
      {/* Hero Section */}
      <div className="flex flex-col items-center w-full max-w-4xl mt-0 lg:mt-15">
        <div className="mt-12 sm:mt-16 lg:mt-20 flex gap-2 border border-lime-500/30 bg-lime-500/10 px-3 py-1.5 items-center rounded-full shadow-[0_0_15px_rgba(163,230,53,0.15)] transform-gpu will-change-transform">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-semibold text-lime-400 tracking-wider select-none">
            INSTANT SEO ANALYSIS IN SECONDS
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl text-lime-400 mt-6 select-none font-bold text-center drop-shadow-[0_0_35px_rgba(163,230,53,0.35)] transform-gpu will-change-transform">
          Analyze & Boost Your{" "}
        </h1>
        <span className="font-bold text-3xl sm:text-5xl lg:text-6xl text-lime-400 mt-2 select-none text-center drop-shadow-[0_0_35px_rgba(132,204,22,0.35)] transform-gpu will-change-transform">
          SEO Rankings
        </span>

        <p className="text-white/40 mt-6 text-sm sm:text-base text-center max-w-xl lg:max-w-2xl leading-relaxed select-none">
          Paste any website URL below to get instant AI-driven insights on SEO,
          performance, and accessibility.
        </p>
        <p className="text-white/40 text-sm sm:text-base text-center mt-1 select-none">
          Stop guessing—optimize your site in one click.
        </p>

        {/* Input box */}
        <div className="mt-8 w-full max-w-2xl px-2">
          <div className="relative flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl sm:rounded-full bg-[#0a0f1d]/80 border border-lime-500/30 shadow-[0_0_25px_rgba(163,230,53,0.15)] focus-within:border-lime-400 focus-within:shadow-[0_0_35px_rgba(163,230,53,0.3)] transition-all duration-300 transform-gpu will-change-transform">
            <input
              type="url"
              placeholder="Paste website URL (e.g. https://example.com)"
              className="w-full bg-transparent px-5 py-3 sm:py-2 text-sm sm:text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />

            <button
              type="button"
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-full bg-lime-500 hover:bg-lime-400 text-black font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(163,230,53,0.4)] hover:shadow-[0_0_30px_rgba(163,230,53,0.7)] active:scale-95 transition-all duration-200 cursor-pointer transform-gpu will-change-transform"
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

        {/* Free text */}
        <span className="text-white/40 mt-3 text-sm sm:text-base text-center max-w-xl lg:max-w-2xl leading-relaxed select-none">
          Free — No credit card required • 5 analyses per day
        </span>

        {/* Wave Animation */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none z-0">
          <HomeWave />
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-6xl mt-50 lg:mt-105 flex flex-col items-center">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl text-lime-400 font-bold text-center drop-shadow-[0_0_35px_rgba(163,230,53,0.35)] select-none">
          Everything Included for
        </h2>
        <span className="text-2xl sm:text-4xl lg:text-5xl text-lime-400 font-bold text-center drop-shadow-[0_0_35px_rgba(163,230,53,0.35)] select-none">
          Maximum Traffic
        </span>
        <p className="text-white/40 mt-4 text-sm sm:text-base text-center max-w-2xl leading-relaxed select-none mb-14">
          High-level SEO, performance, and technical intelligence packaged into
          actionable insights to scale your online presence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {features.map((item, index) => {
            const IconComponent = item.Icon;
            return (
              <div
                key={index}
                className="p-6 sm:p-7 rounded-2xl bg-[#0a0f1d]/70 border border-lime-500/20 hover:border-lime-500/50 hover:shadow-[0_0_25px_rgba(163,230,53,0.15)] transition-all duration-300 flex flex-col items-start justify-start group"
              >
                <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200">
                  <IconComponent className="w-5 h-5 text-lime-400" />
                </div>
                <h3 className="text-lime-400 font-semibold text-lg mb-2">
                  {item.Title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {item.Desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="w-full max-w-6xl mt-32 flex flex-col items-center">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl text-lime-400 font-bold text-center drop-shadow-[0_0_35px_rgba(163,230,53,0.35)] select-none">
          Simple Pricing
        </h2>
        <p className="text-white/40 mt-4 text-sm sm:text-base text-center max-w-2xl leading-relaxed select-none mb-16">
          Pick the plan that matches how you work — quick audits for solo
          projects, or full-scale analysis for teams shipping at volume.
        </p>

        {/*Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between p-8 rounded-3xl bg-[#070c18]/90 transition-all duration-300 ${
                plan.highlighted
                  ? "border-2 border-lime-400 shadow-[0_0_35px_rgba(163,230,53,0.2)]"
                  : "border border-white/10 hover:border-lime-500/30"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 right-6 bg-lime-400 text-black text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full shadow-[0_0_12px_rgba(163,230,53,0.8)]">
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-lime-400 text-xl font-bold mb-3">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">
                    {plan.price}
                  </span>
                  <span className="text-white/40 text-sm">/{plan.type}</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-8">
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-lime-400 shrink-0" />
                      <span className="text-white/70 text-sm">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                  plan.highlighted
                    ? "bg-lime-400 hover:bg-lime-300 text-black shadow-[0_0_20px_rgba(163,230,53,0.4)]"
                    : "bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 border border-lime-500/30"
                }`}
              >
                {plan.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bottom-0 w-full mt-30">
        <Footer />
      </div>
    </div>
  );
};

export default Page;
