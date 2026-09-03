"use client";
import Navbar from "@/components/Navbar";
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
      console.log("Purchase success:", data);
    } catch (err) {
      console.error("Purchase error:", err);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-auto">
      <Navbar />
      <div className="flex-1 min-h-0 w-full bg-[#030712] flex flex-col items-center justify-center gap-6 px-4 select-none">
        {/* logo */}
        <div className="flex items-center gap-1.5 font-normal">
          <svg
            className="w-11 h-11 text-lime-600"
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
            Meta<span className="text-lime-600 font-bold">Pulse</span>
          </span>
        </div>

        <div className="text-center max-w-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-2">
            Flexible Plans for Web Intelligence
          </h2>
          <p className="text-slate-600  text-sm md:text-base">
            Pick the plan that matches how you work — quick audits for solo
            projects, or full-scale analysis for teams shipping at volume.
          </p>
        </div>

        {/* pricing cards */}
        <div className="w-full max-w-3xl mx-auto z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col p-6 bg-black/20 ring ring-green-900 mx-auto w-full max-w-sm rounded-lg text-white shadow-lg hover:ring-green-500 transition-all duration-400"
              >
                <h3 className="text-xl font-bold text-lime-600">{plan.name}</h3>
                <div className="my-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                </div>

                <p className="text-slate-400 mb-6">{plan.description}</p>

                <ul className="space-y-1.5 mb-6 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-400 mr-2 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-slate-600 ">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={loadingPlan === plan.id}
                  className="mt-auto w-full py-2 px-4 bg-green-600 hover:bg-green-700 active:scale-95 text-sm font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-black"
                >
                  {loadingPlan === plan.id ? "Processing..." : "Buy Now"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;