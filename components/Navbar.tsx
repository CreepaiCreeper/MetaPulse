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

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close the phone dropdown on any click outside the navbar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      ref={navRef}
      className="relative h-16 w-full bg-[#0a0a0a] px-4 sm:px-8 flex items-center justify-between sm:justify-evenly border-b border-[#262626]"
    >
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

      {/* 2. Links (Center Spacing) - hidden on phones only, visible from tablet up */}
      <div className="hidden sm:flex items-center gap-2">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 text-xs font-semibold text-[#a3a3a3] hover:text-lime-600 hover:bg-[#171717] transition-colors group px-3 py-2 rounded-full"
          >
            <Icon className="w-4 h-4 text-[#a3a3a3] group-hover:text-lime-600 transition-colors" />
            <span>{label}</span>
          </Link>
        ))}
      </div>

      {/* 3. Profile + Menu Trigger */}
      <div className="flex items-center gap-1">
        {/* Full profile pill - tablet and up */}
        <div className="hidden sm:flex items-center gap-2 bg-[#171717] pl-1.5 pr-3 py-1.5 rounded-full border border-[#262626]">
          <img
            src="reyna.jpeg"
            alt="Profile"
            className="h-7 w-7 rounded-full object-cover cursor-pointer"
          />
          <span className="text-white/60 text-sm font-medium select-none">
            Takashi
          </span>
        </div>

        {/* FREE badge - tablet and up */}
        <div className="hidden sm:flex items-center px-2 py-1 rounded-full border border-lime-600/50 bg-lime-600/10">
          <span
            className="text-lime-500 text-[11px] font-bold select-none tracking-wider"
            style={{ textShadow: "0 0 8px rgba(132, 204, 22, 0.8)" }}
          >
            FREE
          </span>
        </div>

        {/* Logout - tablet and up */}
        <button className="hidden sm:flex items-center gap-2 text-xs font-semibold text-white/50 cursor-pointer hover:text-lime-600 hover:bg-[#171717] transition-colors px-3 py-2 rounded-full">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>

        {/* Compact avatar - phones only */}
        <img
          src="reyna.jpeg"
          alt="Profile"
          className="sm:hidden h-8 w-8 rounded-full object-cover cursor-pointer border border-[#262626]"
        />

        {/* Hamburger toggle - phones only */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full text-white/70 hover:text-lime-600 hover:bg-[#171717] transition-colors"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 4. Dropdown Menu - phones only, shown when hamburger is open */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 w-full bg-[#0a0a0a] border-b border-[#262626] shadow-xl shadow-black/40 flex flex-col p-3 gap-1 z-50">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 text-sm font-semibold text-[#a3a3a3] hover:text-lime-600 hover:bg-[#171717] transition-colors px-4 py-3 rounded-lg"
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          ))}

          <div className="h-px bg-[#262626] my-1" />

          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-white/60 text-sm font-medium select-none">
              Takashi
            </span>
            <div className="flex items-center px-2 py-1 rounded-full border border-lime-600/50 bg-lime-600/10">
              <span
                className="text-lime-500 text-[11px] font-bold select-none tracking-wider"
                style={{ textShadow: "0 0 8px rgba(132, 204, 22, 0.8)" }}
              >
                FREE
              </span>
            </div>
          </div>

          <button className="flex items-center gap-3 text-sm font-semibold text-white/50 hover:text-lime-600 hover:bg-[#171717] transition-colors px-4 py-3 rounded-lg">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;