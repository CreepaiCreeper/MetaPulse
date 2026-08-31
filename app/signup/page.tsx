"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to sign up");
      }

      router.push("/");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen select-none flex items-center justify-center bg-[#030712] text-slate-100 p-4 font-sans selection:bg-green-900/40 selection:text-white">
      <div className="w-full max-w-md bg-[#090d16] border border-slate-800/80 rounded-2xl p-8 sm:p-10 shadow-2xl">
        <div className="flex justify-center mb-6">
          <svg
            className="w-7 h-7 text-[#36a50a]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
              d="M12 2L2 12l10 10 10-10L12 2zM8 12h2l1-3 2 6 1-3h2"
            />
          </svg>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-lime-600 ">
            Create an account
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Start analyzing your website with MetaPulse
          </p>
        </div>

        {error && (
          <p className="text-xs text-red-500 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handlesubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-lime-600 mb-2 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-[#030712] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/40 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-lime-600 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@metapulse.io"
              className="w-full px-4 py-3 bg-[#030712] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/40 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-lime-600 mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-[#030712] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/40 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 mt-2 bg-lime-600 hover:bg-lime-700 text-black font-semibold rounded-xl text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-lg shadow-green-600/20"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-green-600 hover:text-green-500 hover:underline font-medium ml-1"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}