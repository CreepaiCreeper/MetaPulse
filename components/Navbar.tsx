"use client";

import React, { useEffect, useRef, useState } from "react";
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

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyze", label: "Analyze", icon: Search },
  { href: "/history", label: "History", icon: History },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
];

interface NavbarProps {
  userTier?: string;
}

const Navbar = ({ userTier = "FREE" }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderBadge = () => {
    const currentTier = userTier?.toUpperCase() || "FREE";

    // Ultimate Tier Badge (Lime Glowing)
    if (currentTier === "ULTIMATE") {
      return (
        <div className="flex items-center px-2.5 py-1 rounded-full border border-lime-500/50 bg-lime-500/10 shadow-[0_0_12px_rgba(163,230,53,0.25)]">
          <span
            className="text-lime-400 text-[11px] font-extrabold select-none tracking-wider drop-shadow-[0_0_8px_rgba(163,230,53,0.8)]"
          >
            ULTIMATE
          </span>
        </div>
      );
    }

    // Starter Tier Badge (Lime Glowing)
    if (currentTier === "STARTER") {
      return (
        <div className="flex items-center px-2.5 py-1 rounded-full border border-lime-500/40 bg-lime-500/10 shadow-[0_0_10px_rgba(163,230,53,0.2)]">
          <span
            className="text-lime-400 text-[11px] font-bold select-none tracking-wider drop-shadow-[0_0_6px_rgba(163,230,53,0.7)]"
          >
            STARTER
          </span>
        </div>
      );
    }

    // Free Tier Badge (Lime Soft Glow)
    return (
      <div className="flex items-center px-2.5 py-1 rounded-full border border-lime-600/30 bg-lime-600/10">
        <span
          className="text-lime-500 text-[11px] font-bold select-none tracking-wider drop-shadow-[0_0_5px_rgba(132,204,22,0.6)]"
        >
          FREE
        </span>
      </div>
    );
  };

  return (
    <nav
      ref={navRef}
      className="relative h-16 w-full bg-[#0a0a0a] px-4 sm:px-8 flex items-center justify-between sm:justify-evenly border-b border-[#262626]"
    >
      {/* 1. Logo */}
      <Link href="/" className="flex items-center gap-1.5 font-normal text-sm">
        <svg
          className="w-6 h-6 text-lime-500 drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]"
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
          Meta<span className="text-lime-500 font-bold">Pulse</span>
        </span>
      </Link>

      <div className="hidden sm:flex items-center gap-2">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 text-xs font-semibold text-[#a3a3a3] hover:text-lime-400 hover:bg-[#171717] transition-all duration-200 group px-3 py-2 rounded-full shadow-[0_0_20px_rgba(163,230,53,0.4)]"
          >
            <Icon className="w-4 h-4 text-[#a3a3a3] group-hover:text-lime-400 transition-colors" />
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1 bg-[#171717] pl-1.5 pr-3 py-1.5 rounded-full h-12 w-30 flex justify-center border border-[#262626] hover:shadow-[0_0_20px_rgba(163,230,53,0.4)] transition-all duration-200 cursor-pointer">
          <img
            src="reyna.jpeg"
            alt="Profile"
            className="h-7 w-7 rounded-full object-cover cursor-pointer"
          />
          <span className="text-white/60 text-sm font-medium select-none">
            Takashi
          </span>
        </div>

        <div className="hidden sm:block">{renderBadge()}</div>

        <button className="hidden sm:flex items-center gap-2 text-xs font-semibold text-white/50 cursor-pointer hover:text-lime-400 hover:bg-[#171717] transition-colors px-3 py-2 rounded-full">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>

        <img
          src="reyna.jpeg"
          alt="Profile"
          className="sm:hidden h-8 w-8 rounded-full object-cover cursor-pointer border border-[#262626]"
        />

        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full text-white/70 hover:text-lime-400 hover:bg-[#171717] transition-colors"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 w-full bg-[#0a0a0a] border-b border-[#262626] shadow-xl shadow-black/40 flex flex-col p-3 gap-1 z-50">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 text-sm font-semibold text-[#a3a3a3] hover:text-lime-400 hover:bg-[#171717] transition-colors px-4 py-3 rounded-lg"
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          ))}

          <div className="h-px bg-[#262626] my-1" />

          <div className="flex items-center justify-between px-4 py-2 ">
            <span className="text-white/60 text-sm font-medium select-none ">
              Takashi
            </span>
            {renderBadge()}
          </div>

          <button className="flex items-center gap-3 text-sm font-semibold text-white/50 hover:text-lime-400 hover:bg-[#171717] transition-colors px-4 py-3 rounded-lg">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;