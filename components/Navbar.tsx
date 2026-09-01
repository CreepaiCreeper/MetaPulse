"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Search,
  History,
  CreditCard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="relative w-full bg-[#0a0a0a] border-b border-[#262626]">
      {/* Main Navbar Bar */}
      <div className="h-16 px-4 md:px-8 flex items-center justify-between">
        {/* 1. Logo */}
        <Link href="/" className="flex items-center gap-1.5 text-sm">
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

        {/* 2. Desktop Links (Large screens par hi dikhenge) */}
        <div className="hidden lg:flex items-center gap-2">
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

        {/* 3. Right Side: Profile & Mobile Menu Button */}
        <div className="flex items-center gap-2">
          {/* Profile Badge */}
          <div className="flex items-center gap-2 bg-[#171717] pl-1.5 pr-3 py-1.5 rounded-full border border-[#262626]">
            <img
              src="reyna.jpeg"
              alt="Profile"
              className="h-7 w-7 rounded-full object-cover cursor-pointer"
            />
            <span className="text-white/60 text-sm font-medium select-none hidden sm:inline">
              Takashi
            </span>
          </div>

          {/* Plan Badge */}
          <div className="flex items-center px-2 py-1 rounded-full border border-lime-600/50 bg-lime-600/10">
            <span
              className="text-lime-500 text-[11px] font-bold select-none tracking-wider"
              style={{ textShadow: "0 0 8px rgba(132, 204, 22, 0.8)" }}
            >
              FREE
            </span>
          </div>

          {/* Logout (Desktop Par Display Hoga) */}
          <button className="hidden lg:flex items-center gap-2 text-xs font-semibold text-white/50 cursor-pointer hover:text-lime-600 hover:bg-[#171717] transition-colors px-3 py-2 rounded-full">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>

          {/* Mobile / Tablet Toggle Button (3 Lines / Close Icon) */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-2 rounded-lg text-white/70 hover:text-lime-600 hover:bg-[#171717] transition-colors focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 4. Mobile / Tablet Dropdown Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden w-full bg-[#0d0d0d] border-b border-[#262626] px-6 py-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-sm font-semibold text-[#a3a3a3] hover:text-lime-600 hover:bg-[#171717] transition-colors px-4 py-3 rounded-xl"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/analyze"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-sm font-semibold text-[#a3a3a3] hover:text-lime-600 hover:bg-[#171717] transition-colors px-4 py-3 rounded-xl"
          >
            <Search className="w-5 h-5" />
            <span>Analyze</span>
          </Link>

          <Link
            href="/history"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-sm font-semibold text-[#a3a3a3] hover:text-lime-600 hover:bg-[#171717] transition-colors px-4 py-3 rounded-xl"
          >
            <History className="w-5 h-5" />
            <span>History</span>
          </Link>

          <Link
            href="/pricing"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-sm font-semibold text-[#a3a3a3] hover:text-lime-600 hover:bg-[#171717] transition-colors px-4 py-3 rounded-xl"
          >
            <CreditCard className="w-5 h-5" />
            <span>Pricing</span>
          </Link>

          <div className="border-t border-[#262626] my-1 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 text-sm font-semibold text-red-500/80 hover:text-red-500 hover:bg-[#171717] transition-colors px-4 py-3 rounded-xl"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;