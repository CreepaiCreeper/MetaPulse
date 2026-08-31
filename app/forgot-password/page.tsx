"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setIsSent(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] text-slate-100 p-4 font-sans">
      <div className="w-full max-w-md bg-[#090d16] border border-slate-800/80 rounded-2xl p-8 sm:p-10 shadow-2xl">
        {!isSent ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-lime-600">
                Forgot Password?
              </h1>
              <p className="text-xs text-slate-500 mt-2">
                Enter your account email address and we will send you a
                verification link.
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-500 text-center mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-lime-600 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-3 bg-[#030712] border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/40 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 mt-2 bg-lime-600 hover:bg-lime-700 text-black font-semibold rounded-xl text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-lg shadow-green-600/20"
              >
                {loading ? "Sending Mail..." : "Send Verification Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 bg-slate-800/60 rounded-full flex items-center justify-center mx-auto text-xl text-white border border-slate-700">
              <span className="text-slate-500">✉</span>
            </div>
            <h2 className="text-xl font-bold text-lime-600">Check Your Email</h2>
            <p className="text-xs text-slate-600">
              We have sent a password reset link to <br />
              <span className="text-lime-600 font-medium">{email}</span>
            </p>
            <p className="text-[11px] text-slate-500 pt-2">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button
              onClick={() => setIsSent(false)}
              className="text-xs text-slate-400 cursor-pointer hover:text-slate-300 transition-all underline font-medium pt-2 block mx-auto"
            >
              Resend
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <Link
            href="/login"
            className="text-xs text-slate-400 hover:text-slate-300 font-medium transition-all"
          >
            ← Back to Log In
          </Link>
        </div>
      </div>
    </div>
  );
}