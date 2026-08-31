"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      router.push("/login?reset=success");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex select-none items-center justify-center bg-[#030712] text-slate-100 p-4 font-sans">
      <div className="w-full max-w-md bg-[#090d16] border border-slate-800/80 rounded-2xl p-8 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-lime-600">Create New Password</h1>
          <p className="text-xs text-slate-500 mt-2">
            Enter your new password.
          </p>
        </div>

        {error && <p className="text-xs text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-lime-600 mb-2 uppercase tracking-wider">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-[#030712] border border-slate-800 rounded-xl text-slate-400 text-sm focus:outline-none focus:border-lime-600 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-lime-600 mb-2 uppercase tracking-wider">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-[#030712] border border-slate-800 rounded-xl text-slate-400 text-sm focus:outline-none focus:border-lime-600 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 mt-2 bg-lime-600 hover:bg-lime-700 text-black font-semibold rounded-xl text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-lg shadow-green-600/20"
          >
            {loading ? "Updating Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-slate-400 text-sm">
        Loading...
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}