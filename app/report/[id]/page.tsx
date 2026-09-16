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
  Loader2,
  Link2,
  Trash2,
  Image as ImageIcon,
  Type,
  Tag,
  FileText,
  Info,
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

const getScoreColor = (score: number) => {
  if (score >= 80) return { text: "text-lime-400", stroke: "#a3e635" };
  if (score >= 50) return { text: "text-amber-500", stroke: "#f59e0b" };
  return { text: "text-red-500", stroke: "#ef4444" };
};

const getIssueBadgeClasses = (type: "critical" | "warning" | "info") => {
  if (type === "critical") return "bg-red-500/20 text-red-400 border-red-500/30";
  if (type === "warning") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  return "bg-blue-500/20 text-blue-400 border-blue-500/30";
};

const getStatusDotClasses = (status: "good" | "warning" | "error") => {
  if (status === "good") return "bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]";
  if (status === "warning") return "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]";
  return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]";
};

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
      <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-lime-400 animate-spin mb-3" />
        <p className="text-zinc-400 text-sm">Loading Scan Details...</p>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-4">
        <p className="text-red-400 font-semibold text-lg">Scan Report Not Found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-[#0a0f1d] border border-white/10 rounded-lg text-xs text-zinc-300 hover:text-lime-400 hover:border-lime-500/30 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const cleanDomain = scan.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const overallColor = getScoreColor(scan.scores?.overall || 0);

  const filteredIssues = (scan.issues || []).filter((issue) => {
    if (issueFilter === "all") return true;
    return issue.type === issueFilter;
  });

  const heading = scan.headingStructure || {
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    h5: 0,
    h6: 0,
    h1Text: "",
  };
  const headingLevels: Array<{ label: string; count: number }> = [
    { label: "H1", count: heading.h1 || 0 },
    { label: "H2", count: heading.h2 || 0 },
    { label: "H3", count: heading.h3 || 0 },
    { label: "H4", count: heading.h4 || 0 },
    { label: "H5", count: heading.h5 || 0 },
    { label: "H6", count: heading.h6 || 0 },
  ];
  const maxHeadingCount = Math.max(1, ...headingLevels.map((h) => h.count));
  const totalHeadings = headingLevels.reduce((sum, h) => sum + h.count, 0);
  const maxKeywordCount = Math.max(1, ...(scan.topKeywords || []).map((k) => k.count));

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 font-sans pb-20 selection:bg-lime-500/30">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-24">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-lime-400 text-xs font-medium transition-colors"
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
          <h1 className="text-2xl font-bold tracking-tight text-lime-400 drop-shadow-[0_0_20px_rgba(163,230,53,0.25)]">{cleanDomain}</h1>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
            <a
              href={scan.url}
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1 text-zinc-400 hover:text-lime-400"
            >
              <span>{scan.url}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>{new Date(scan.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Scoreboard Cards */}
        <div className="p-6 rounded-2xl bg-[#0a0f1d]/60 border border-white/5 mb-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-3 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 pb-6 lg:pb-0 lg:pr-6">
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
                    stroke={overallColor.stroke}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - (scan.scores?.overall || 0) / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-4xl font-black text-white">{scan.scores?.overall || 0}</span>
              </div>
              <span className="text-xs font-semibold text-zinc-400 mt-2">Overall Score</span>
            </div>

            <div className="lg:col-span-9 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-[#0f1420] border border-white/5 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-1">
                    <Search className="w-3.5 h-3.5 text-lime-400" />
                    <span>SEO</span>
                  </div>
                  <span className={`text-2xl font-bold ${getScoreColor(scan.scores?.seo || 0).text}`}>{scan.scores?.seo || 0}</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0f1420] border border-white/5 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-1">
                    <Gauge className="w-3.5 h-3.5 text-lime-400" />
                    <span>Performance</span>
                  </div>
                  <span className={`text-2xl font-bold ${getScoreColor(scan.scores?.performance || 0).text}`}>{scan.scores?.performance || 0}</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0f1420] border border-white/5 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-1">
                    <Accessibility className="w-3.5 h-3.5 text-lime-400" />
                    <span>Accessibility</span>
                  </div>
                  <span className={`text-2xl font-bold ${getScoreColor(scan.scores?.accessibility || 0).text}`}>{scan.scores?.accessibility || 0}</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0f1420] border border-white/5 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Best Practices</span>
                  </div>
                  <span className={`text-2xl font-bold ${getScoreColor(scan.scores?.bestPractices || 0).text}`}>{scan.scores?.bestPractices || 0}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#0f1420]/60 border border-white/5 text-center">
                  <p className="text-base font-bold text-white">{scan.quickStats?.loadTime || "N/A"}</p>
                  <p className="text-[11px] text-zinc-500 font-medium">Load Time</p>
                </div>

                <div className="p-3 rounded-xl bg-[#0f1420]/60 border border-white/5 text-center">
                  <p className="text-base font-bold text-white">{scan.quickStats?.pageSize || "N/A"}</p>
                  <p className="text-[11px] text-zinc-500 font-medium">Page Size</p>
                </div>

                <div className="p-3 rounded-xl bg-[#0f1420]/60 border border-white/5 text-center">
                  <p className="text-base font-bold text-lime-400">{scan.quickStats?.words || 0}</p>
                  <p className="text-[11px] text-zinc-500 font-medium">Words</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
          {(["overview", "meta", "content", "issues"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "bg-lime-500 text-black shadow-[0_0_15px_rgba(163,230,53,0.4)]"
                  : "text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10"
              }`}
            >
              {tab === "issues" ? `Issues (${scan.issues?.length || 0})` : tab === "meta" ? "Meta Tags" : tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-[#0a0f1d]/60 border border-white/5">
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
                        className="p-3 rounded-xl bg-[#0f1420] border border-white/5 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border capitalize ${getIssueBadgeClasses(issue.type)}`}>
                              {issue.type}
                            </span>
                            <span className="text-[11px] text-zinc-500 font-medium">{issue.category}</span>
                          </div>
                          <p className="text-xs text-zinc-300 font-medium leading-relaxed">{issue.message}</p>
                        </div>
                      </div>
                    ))}
                    {(scan.issues || []).length === 0 && (
                      <p className="text-xs text-zinc-500 text-center py-4">No issues found. Nice and clean!</p>
                    )}
                  </div>

                  {(scan.issues || []).length > 3 && (
                    <button
                      onClick={() => setActiveTab("issues")}
                      className="w-full mt-4 text-center text-xs font-semibold text-lime-400 hover:text-lime-300 transition-colors"
                    >
                      View all {scan.issues.length} issues →
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-[#0a0f1d]/60 border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Link2 className="w-4 h-4 text-lime-400" />
                    <h3 className="text-sm font-bold text-white">Links Analysis</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[#0f1420] border border-white/5 text-center">
                      <p className="text-xl font-bold text-white">{scan.linksAnalysis?.internal || 0}</p>
                      <p className="text-[10px] text-zinc-500 font-medium">Internal</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0f1420] border border-white/5 text-center">
                      <p className="text-xl font-bold text-white">{scan.linksAnalysis?.external || 0}</p>
                      <p className="text-[10px] text-zinc-500 font-medium">External</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0f1420] border border-white/5 text-center">
                      <p className="text-xl font-bold text-lime-400">{scan.linksAnalysis?.total || 0}</p>
                      <p className="text-[10px] text-zinc-500 font-medium">Total</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0a0f1d]/60 border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <ImageIcon className="w-4 h-4 text-lime-400" />
                    <h3 className="text-sm font-bold text-white">Images Audit</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[#0f1420] border border-white/5 text-center">
                      <p className="text-xl font-bold text-white">{scan.imagesAudit?.total || 0}</p>
                      <p className="text-[10px] text-zinc-500 font-medium">Total</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0f1420] border border-white/5 text-center">
                      <p className="text-xl font-bold text-lime-400">{scan.imagesAudit?.withAlt || 0}</p>
                      <p className="text-[10px] text-zinc-500 font-medium">With Alt</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0f1420] border border-white/5 text-center">
                      <p className="text-xl font-bold text-red-400">{scan.imagesAudit?.missingAlt || 0}</p>
                      <p className="text-[10px] text-zinc-500 font-medium">Missing Alt</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="p-5 rounded-2xl bg-[#0a0f1d]/60 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <Type className="w-4 h-4 text-lime-400" />
                  <h3 className="text-sm font-bold text-white">Heading Structure</h3>
                </div>
                <div className="space-y-2.5">
                  {headingLevels.map((h) => (
                    <div key={h.label} className="flex items-center gap-3">
                      <span className="w-7 text-[11px] font-bold text-zinc-400">{h.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full bg-lime-400 rounded-full transition-all duration-500"
                          style={{ width: h.count > 0 ? `${Math.max(4, (h.count / maxHeadingCount) * 100)}%` : "0%" }}
                        />
                      </div>
                      <span className="w-6 text-right text-xs font-semibold text-zinc-300">{h.count}</span>
                    </div>
                  ))}
                </div>
                {heading.h1Text && (
                  <div className="mt-4 p-3 rounded-xl bg-[#0f1420] border border-white/5">
                    <p className="text-[10px] font-semibold text-zinc-500 mb-1">H1 Text:</p>
                    <p className="text-xs text-zinc-200 font-medium">{heading.h1Text}</p>
                  </div>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-[#0a0f1d]/60 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-lime-400" />
                  <h3 className="text-sm font-bold text-white">Top Keywords</h3>
                </div>
                {(scan.topKeywords || []).length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-6">No keyword data available for this scan.</p>
                ) : (
                  <div className="space-y-2.5">
                    {scan.topKeywords.slice(0, 10).map((kw, idx) => (
                      <div key={kw.word} className="flex items-center gap-3">
                        <span className="w-4 text-[11px] font-bold text-zinc-600">{idx + 1}</span>
                        <span className="w-24 shrink-0 text-xs font-semibold text-zinc-200 truncate">{kw.word}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-lime-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(4, (kw.count / maxKeywordCount) * 100)}%` }}
                          />
                        </div>
                        <span className="w-8 shrink-0 text-right text-[11px] text-zinc-400">{kw.count}×</span>
                        <span className="w-12 shrink-0 text-right text-[11px] text-zinc-500">{kw.density}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Meta Tags Tab */}
        {activeTab === "meta" && (
          <div className="p-6 rounded-2xl bg-[#0a0f1d]/60 border border-white/5">
            <div className="flex items-center gap-2 mb-5">
              <FileText className="w-4 h-4 text-lime-400" />
              <h3 className="text-sm font-bold text-white">Meta Tags Analysis</h3>
            </div>

            {(scan.metaTags || []).length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-8">No meta tag data available for this scan.</p>
            ) : (
              <div className="space-y-3">
                {scan.metaTags.map((tag) => (
                  <div key={tag.title} className="p-4 rounded-xl bg-[#0f1420] border border-white/5 flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white mb-1">{tag.title}</p>
                      <p
                        className={`text-xs break-words ${
                          tag.status === "error" ? "text-red-400 italic" : "text-zinc-300"
                        }`}
                      >
                        {tag.value}
                      </p>
                      {tag.subtext && <p className="text-[10px] text-zinc-500 mt-1">{tag.subtext}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {tag.badge && <span className="text-[11px] text-zinc-500 font-medium">{tag.badge}</span>}
                      <span className={`w-2 h-2 rounded-full ${getStatusDotClasses(tag.status)}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#0a0f1d]/60 border border-white/5">
              <h3 className="text-sm font-bold text-white mb-4">Content Stats</h3>
              <div className="space-y-1">
                {[
                  { label: "Word Count", value: scan.quickStats?.words ?? 0 },
                  { label: "Page Size", value: scan.quickStats?.pageSize || "N/A" },
                  { label: "Load Time", value: scan.quickStats?.loadTime || "N/A" },
                  { label: "Total Links", value: scan.linksAnalysis?.total ?? 0 },
                  { label: "Total Images", value: scan.imagesAudit?.total ?? 0 },
                  { label: "Total Headings", value: totalHeadings },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0">
                    <span className="text-xs text-zinc-400 font-medium">{row.label}</span>
                    <span className="text-sm font-bold text-white">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0f1d]/60 border border-white/5">
              <h3 className="text-sm font-bold text-white mb-4">Heading Hierarchy</h3>
              <div className="space-y-2.5">
                {headingLevels.map((h) => {
                  let statusBadge: { text: string; classes: string } | null = null;
                  if (h.label === "H1") {
                    if (h.count === 1) statusBadge = { text: "Good", classes: "bg-lime-500/10 text-lime-400 border-lime-500/20" };
                    else if (h.count === 0) statusBadge = { text: "Missing", classes: "bg-red-500/10 text-red-400 border-red-500/20" };
                    else statusBadge = { text: "Multiple", classes: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
                  }
                  return (
                    <div
                      key={h.label}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#0f1420] border border-white/5"
                    >
                      <span className="text-xs font-mono font-semibold text-zinc-300">
                        {`<${h.label}>`} <span className="text-zinc-500 font-sans">{h.count} tag{h.count === 1 ? "" : "s"}</span>
                      </span>
                      {statusBadge && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge.classes}`}>
                          {statusBadge.text}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Issues Tab */}
        {activeTab === "issues" && (
          <div className="p-6 rounded-2xl bg-[#0a0f1d]/60 border border-white/5">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs font-semibold text-zinc-400 mr-1">Filter:</span>
              {(
                [
                  { key: "all", label: "All", count: scan.issues?.length || 0 },
                  { key: "critical", label: "Critical", count: scan.issuesSummary?.critical || 0 },
                  { key: "warning", label: "Warnings", count: scan.issuesSummary?.warnings || 0 },
                  { key: "info", label: "Info", count: scan.issuesSummary?.info || 0 },
                ] as const
              ).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setIssueFilter(f.key)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                    issueFilter === f.key
                      ? "bg-lime-500 text-black border-lime-500"
                      : "bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {f.count} {f.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="p-4 rounded-xl bg-[#0f1420] border border-white/5">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase shrink-0 ${getIssueBadgeClasses(issue.type)}`}>
                      {issue.type}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-200 mt-2">{issue.message}</p>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1">{issue.category}</p>
                </div>
              ))}
              {filteredIssues.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-zinc-500">
                  <Info className="w-6 h-6 mb-2" />
                  <p className="text-xs">No issues match this filter.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
