import React from "react";
import Link from "next/link";
import { LayoutDashboard, Search, History, CreditCard, LogOut } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="h-16 w-full bg-[#0a0a0a] px-8 flex items-center justify-evenly border-b border-[#262626]">
      {/* 1. Logo */}
      <Link href="/" className="flex items-center gap-1.5 font-normal text-sm">
        <svg
          className="w-6 h-6 text-lime-600"
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
        <span className="text-white/90 font-semibold tracking-wide">
          Meta<span className="text-lime-600 font-bold">Pulse</span>
        </span>
      </Link>

      {/* 2. Links (Center Spacing) */}
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs font-semibold text-[#a3a3a3] hover:text-lime-600 hover:bg-[#171717] transition-colors group px-3 py-2 rounded-full"
        >
          <LayoutDashboard className="w-4 h-4 text-[#a3a3a3] group-hover:text-lime-600 transition-colors" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/analyze"
          className="flex items-center gap-2 text-xs font-semibold text-[#a3a3a3] hover:text-lime-600 hover:bg-[#171717] transition-colors group px-3 py-2 rounded-full"
        >
          <Search className="w-4 h-4 text-[#a3a3a3] group-hover:text-lime-600 transition-colors" />
          <span>Analyze</span>
        </Link>

        <Link
          href="/history"
          className="flex items-center gap-2 text-xs font-semibold text-[#a3a3a3] hover:text-lime-600 hover:bg-[#171717] transition-colors group px-3 py-2 rounded-full"
        >
          <History className="w-4 h-4 text-[#a3a3a3] group-hover:text-lime-600 transition-colors" />
          <span>History</span>
        </Link>

        <Link
          href="/pricing"
          className="flex items-center gap-2 text-xs font-semibold text-[#a3a3a3] hover:text-lime-600 hover:bg-[#171717] transition-colors group px-3 py-2 rounded-full"
        >
          <CreditCard className="w-4 h-4 text-[#a3a3a3] group-hover:text-lime-600 transition-colors" />
          <span>Pricing</span>
        </Link>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2 bg-[#171717] pl-1.5 pr-3 py-1.5 rounded-full border border-[#262626]">
          <img
            src="reyna.jpeg"
            alt="Profile"
            className="h-7 w-7 rounded-full object-cover cursor-pointer"
          />
          <span className="text-white/60 text-sm font-medium select-none">
            Takashi
          </span>
        </div>
        <div className="flex items-center px-2 py-1 rounded-full border border-lime-600/50 bg-lime-600/10">
          <span
            className="text-lime-500 text-[11px] font-bold select-none tracking-wider"
            style={{ textShadow: "0 0 8px rgba(132, 204, 22, 0.8)" }}
          >
            FREE
          </span>
        </div>

        {/* Logout */}
        <button className="flex items-center gap-2 text-xs font-semibold text-white/50 cursor-pointer hover:text-lime-600 hover:bg-[#171717] transition-colors px-3 py-2 rounded-full">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;