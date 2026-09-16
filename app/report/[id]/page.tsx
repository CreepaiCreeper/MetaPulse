"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Search,
  Gauge,
  Accessibility,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  Loader2,
  FileCode,
  Link2,
  Image as ImageIcon,
  Heading,
  Layers,
  Trash2,
} from "lucide-react";

interface ScanData {
  id: string;
  url: string;
  createdAt: string;
  scores: {
    overall: number;
    seo: number;
    performance: number;
    accessibility: number;
    bestPractices: number;
  };
  quickStats: {
    loadTime: string;
    pageSize: string;
    words: number;
  };
  issuesSummary: {
    critical: number;
    warnings: number;
    info: number;
  };
  issues: Array<{
    id: string;
    type: "critical" | "warning" | "info";
    category: string;
    message: string;
  }>;
  linksAnalysis: {
    internal: number;
    external: number;
    total: number;
  };
  imagesAudit: {
    total: number;
    withAlt: number;
    missingAlt: number;
  };
  headingStructure: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
    h1Text: string;
  };
  topKeywords: Array<{
    word: string;
    count: number;
    density: string;
  }>;
  metaTags: Array<{
    title: string;
    value: string;
    subtext?: string;
    status: "good" | "warning" | "error";
    badge?: string;
  }>;
}

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const scanId = params?.id as string;

  const [scan, setScan] = useState<ScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "meta" | "content" | "issues">("overview");
  const [issueFilter, setIssueFilter] = useState<"all" | "critical" | "warning" | "info">("all");

  useEffect(() => {
    if (!scanId) return;

    const fetchScan = async () => {
      try {
        const res = await fetch(`/api/scans/${scanId}`);
        const data = await res.json();
        if (data.success && data.scan) {
          setScan(data.scan);
        }
      } catch (err) {
        console.error("Failed to fetch scan details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScan();
  }, [scanId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this scan report?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/scans/${scanId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Failed to delete scan:", err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-3" />
        <p className="text-zinc-400 text-sm">Loading Scan Details...</p>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4">
        <p className="text-red-400 font-semibold text-lg">Scan Report Not Found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-zinc-800 rounded-lg text-xs text-zinc-300 hover:text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const cleanDomain = scan.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const filteredIssues = (scan.issues || []).filter((issue) => {
    if (issueFilter === "all") return true;
    return issue.type === issueFilter;
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 font-sans pb-20 selection:bg-emerald-500/30">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            <span>Delete Scan</span>
          </button>
        </div>

        {/* Header Details */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">{cleanDomain}</h1>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
            <a
              href={scan.url}
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1 text-zinc-400 hover:text-emerald-400"
            >
              <span>{scan.url}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>{new Date(scan.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Scoreboard Cards */}
        <div className="p-6 rounded-2xl bg-[#0d111a] border border-zinc-800/80 mb-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-3 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-zinc-800/80 pb-6 lg:pb-0 lg:pr-6">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-zinc-800"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - (scan.scores?.overall || 0) / 100)}
                    strokeLinecap="round"
                    className="text-emerald-400 transition-all duration-1000 ease-out"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-4xl font-black text-white">{scan.scores?.overall || 0}</span>
              </div>
              <span className="text-xs font-semibold text-zinc-400 mt-2">Overall Score</span>
            </div>

            <div className="lg:col-span-9 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-[#121824] border border-zinc-800/60 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-1">
                    <Search className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SEO</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">{scan.scores?.seo || 0}</span>
                </div>

                <div className="p-4 rounded-xl bg-[#121824] border border-zinc-800/60 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-1">
                    <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Performance</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">{scan.scores?.performance || 0}</span>
                </div>

                <div className="p-4 rounded-xl bg-[#121824] border border-zinc-800/60 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-1">
                    <Accessibility className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Accessibility</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">{scan.scores?.accessibility || 0}</span>
                </div>

                <div className="p-4 rounded-xl bg-[#121824] border border-zinc-800/60 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Best Practices</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">{scan.scores?.bestPractices || 0}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#121824]/60 border border-zinc-800/40 text-center">
                  <p className="text-base font-bold text-white">{scan.quickStats?.loadTime || "N/A"}</p>
                  <p className="text-[11px] text-zinc-500 font-medium">Load Time</p>
                </div>

                <div className="p-3 rounded-xl bg-[#121824]/60 border border-zinc-800/40 text-center">
                  <p className="text-base font-bold text-white">{scan.quickStats?.pageSize || "N/A"}</p>
                  <p className="text-[11px] text-zinc-500 font-medium">Page Size</p>
                </div>

                <div className="p-3 rounded-xl bg-[#121824]/60 border border-zinc-800/40 text-center">
                  <p className="text-base font-bold text-indigo-400">{scan.quickStats?.words || 0}</p>
                  <p className="text-[11px] text-zinc-500 font-medium">Words</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-3">
          {(["overview", "meta", "content", "issues"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "bg-white text-black shadow-md"
                  : "text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800/50"
              }`}
            >
              {tab === "issues" ? `Issues (${scan.issues?.length || 0})` : tab}
            </button>
          ))}
        </div>

        {/* Active Tab View */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#0d111a] border border-zinc-800/80">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Issues Summary</h3>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                    <p className="text-xl font-bold text-red-400">{scan.issuesSummary?.critical || 0}</p>
                    <p className="text-[10px] font-semibold text-red-400/80">Critical</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <p className="text-xl font-bold text-amber-400">{scan.issuesSummary?.warnings || 0}</p>
                    <p className="text-[10px] font-semibold text-amber-400/80">Warnings</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                    <p className="text-xl font-bold text-blue-400">{scan.issuesSummary?.info || 0}</p>
                    <p className="text-[10px] font-semibold text-blue-400/80">Info</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(scan.issues || []).slice(0, 3).map((issue) => (
                    <div
                      key={issue.id}
                      className="p-3 rounded-xl bg-[#121824] border border-zinc-800/80 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            {issue.type}
                          </span>
                          <span className="text-[11px] text-zinc-500 font-medium">{issue.category}</span>
                        </div>
                        <p className="text-xs text-zinc-300 font-medium leading-relaxed">{issue.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#0d111a] border border-zinc-800/80">
                <div className="flex items-center gap-2 mb-4">
                  <Link2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Links & Media Audit</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#121824] border border-zinc-800/60 text-center">
                    <p className="text-xl font-bold text-white">{scan.linksAnalysis?.total || 0}</p>
                    <p className="text-[10px] text-zinc-500 font-medium">Total Links</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#121824] border border-zinc-800/60 text-center">
                    <p className="text-xl font-bold text-emerald-400">{scan.imagesAudit?.withAlt || 0}</p>
                    <p className="text-[10px] text-zinc-500 font-medium">Images with Alt</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "issues" && (
          <div className="p-6 rounded-2xl bg-[#0d111a] border border-zinc-800/80 space-y-3">
            {filteredIssues.map((issue) => (
              <div key={issue.id} className="p-4 rounded-xl bg-[#121824] border border-zinc-800/70 flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                    {issue.type}
                  </span>
                  <p className="text-xs text-zinc-200 mt-1">{issue.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}