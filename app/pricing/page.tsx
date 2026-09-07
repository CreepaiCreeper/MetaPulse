"use client";
import Footer from "@/components/Footer";
import React, { useState } from "react";

const Pricing = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "starter",
      name: "Starter Plan",
      price: "$9",
      credits: 150,
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
    },
    {
      id: "ultimate",
      name: "Ultimate Plan",
      price: "$29",
      credits: 1000,
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
    },
  ];

  const handlePurchase = async (planId: string) => {
    try {
      setLoadingPlan(planId);

      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (!res.ok) {
        throw new Error("Purchase request failed");
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      } else {
        throw new Error(data.error || "No checkout URL returned");
      }
    } catch (err) {
      console.error("Purchase error:", err);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] flex flex-col justify-between overflow-y-auto">

      <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-12 px-4 select-none">
        {/* Logo Section */}
        <div className="flex items-center gap-2 mb-6">
          <svg
            className="w-10 h-10 text-lime-400 drop-shadow-[0_0_15px_rgba(163,230,53,0.5)] transform-gpu will-change-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M12 2L2 12l10 10 10-10L12 2zM8 12h2l1-3 2 6 1-3h2"
            />
          </svg>
          <span className="text-white/90 font-semibold tracking-wide text-2xl">
            Meta<span className="text-lime-400 font-bold">Pulse</span>
          </span>
        </div>

        {/* Heading & Subtitle */}
        <div className="text-center max-w-xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-lime-400 select-none text-center drop-shadow-[0_0_25px_rgba(163,230,53,0.35)] mb-3 transform-gpu will-change-transform">
            Flexible Plans for Web Intelligence
          </h2>
          <p className="text-white/40 text-sm md:text-base leading-relaxed">
            Pick the plan that matches how you work — quick audits for solo
            projects, or full-scale analysis for teams shipping at volume.
          </p>
        </div>

        {/* Pricing Cards Container */}
        <div className="w-full max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col p-7 rounded-2xl bg-[#0a0f1d]/80 border transition-all duration-300 ${
                  plan.highlighted
                    ? "border-lime-500/50 shadow-[0_0_30px_rgba(163,230,53,0.15)]"
                    : "border-lime-500/20 hover:border-lime-500/40 shadow-[0_0_15px_rgba(163,230,53,0.05) transform-gpu will-change-transform"
                }`}
              >
                {/* Popular Badge for Highlighted Plan */}
                {plan.highlighted && (
                  <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-lime-500/10 border border-lime-500/40 text-lime-400 text-[10px] font-semibold tracking-wider uppercase shadow-[0_0_10px_rgba(163,230,53,0.2)] transform-gpu will-change-transform">
                    Most Popular
                  </span>
                )}

                <h3 className="text-xl font-bold text-lime-400 drop-shadow-[0_0_15px_rgba(163,230,53,0.3)] transform-gpu will-change-transform">
                  {plan.name}
                </h3>

                <div className="my-3 flex items-baseline gap-1">
                  <span className="text-4xl text-white/90 font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-white/40 text-xs">/ one-time</span>
                </div>

                <p className="text-white/60 text-sm mb-6 min-h-[40px]">
                  {plan.description}
                </p>

                <ul className="space-y-2.5 mb-8 text-sm flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <svg
                        className="h-4 w-4 text-lime-400 shrink-0 drop-shadow-[0_0_6px_rgba(163,230,53,0.6)] transform-gpu will-change-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-white/40 text-xs sm:text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Clean Glowing CTA Button */}
                <button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={loadingPlan === plan.id}
                  className="mt-auto w-full py-3 px-4 bg-lime-500 hover:bg-lime-400 text-black font-bold text-sm tracking-wide rounded-xl shadow-[0_0_15px_rgba(163,230,53,0.35)] hover:shadow-[0_0_25px_rgba(163,230,53,0.6)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer transform-gpu will-change-transform"
                >
                  {loadingPlan === plan.id ? "Processing..." : "Buy Now"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bottom-0 w-full">
        <Footer/>
      </div>
    </div>
  );
};

export default Pricing;