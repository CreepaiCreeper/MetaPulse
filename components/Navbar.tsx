"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        setIsAuthenticated(Boolean(data.authenticated));
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsAuthenticated(false);
      window.location.href = "/login";
    }
  };

  const renderBadge = () => {
    const currentTier = userTier?.toUpperCase() || "FREE";

    if (currentTier === "ULTIMATE") {
      return (
        <div className="flex items-center px-2.5 py-1 rounded-full border border-lime-500/50 bg-lime-500/10 shadow-[0_0_12px_rgba(163,230,53,0.25)] shrink-0">
          <span className="text-lime-400 text-[11px] font-extrabold select-none tracking-wider drop-shadow-[0_0_8px_rgba(163,230,53,0.8)] whitespace-nowrap">
            ULTIMATE
          </span>
        </div>
      );
    }

    if (currentTier === "STARTER") {
      return (
        <div className="flex items-center px-2.5 py-1 rounded-full border border-lime-500/40 bg-lime-500/10 shadow-[0_0_10px_rgba(163,230,53,0.2)] shrink-0">
          <span className="text-lime-400 text-[11px] font-bold select-none tracking-wider drop-shadow-[0_0_6px_rgba(163,230,53,0.7)] whitespace-nowrap">
            STARTER
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center px-2.5 py-1 rounded-full border border-lime-600/30 bg-lime-600/10 shrink-0">
        <span className="text-lime-500 text-[11px] font-bold select-none tracking-wider drop-shadow-[0_0_5px_rgba(132,204,22,0.6)] whitespace-nowrap">
          FREE
        </span>
      </div>
    );
  };

  if (isLoading) {
    return null;
  }

  return (
    <nav
      ref={navRef}
      className="relative w-full bg-[#0a0a0a] border-b border-[#262626]"
    >
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-2">
        {/* Logo */}
        <div className="shrink-0">
          <Link href="/" className="flex items-center gap-1.5 font-normal text-sm">
            <svg
              className="w-7 h-7 lg:w-8 lg:h-8 text-lime-500 drop-shadow-[0_0_8px_rgba(163,230,53,0.5)] transform-gpu will-change-transform shrink-0"
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
            <span className="text-white/90 font-semibold tracking-wide text-lg sm:text-xl lg:text-2xl drop-shadow-[0_0_8px_rgba(163,230,53,0.5)] transform-gpu will-change-transform whitespace-nowrap">
              Meta<span className="text-lime-500 font-bold">Pulse</span>
            </span>
          </Link>
        </div>

        {isAuthenticated && (
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center min-w-0">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 text-xs font-semibold text-[#a3a3a3] hover:text-lime-400 hover:bg-[#171717] shadow-[0_0_20px_rgba(163,230,53,0.4)] hover:shadow-[0_0_30px_rgba(163,230,53,0.7)] active:scale-95 transition-all duration-200 cursor-pointer transform-gpu will-change-transform group px-3 py-2 rounded-full whitespace-nowrap"
              >
                <Icon className="w-4 h-4 text-[#a3a3a3] group-hover:text-lime-400 transition-colors shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isAuthenticated ? (
            <>
              <div className="hidden lg:flex items-center gap-2 bg-[#171717] px-3 py-1.5 rounded-full border border-[#262626] shadow-[0_0_20px_rgba(163,230,53,0.4)] hover:shadow-[0_0_30px_rgba(163,230,53,0.7)] transition-all duration-200 cursor-pointer transform-gpu will-change-transform">
                <img
                  src="reyna.jpeg"
                  alt="Profile"
                  className="h-7 w-7 rounded-full object-cover cursor-pointer shrink-0"
                />
                <span className="text-white/80 text-sm font-medium select-none whitespace-nowrap">
                  Takashi
                </span>
              </div>

              <div className="hidden lg:block">{renderBadge()}</div>

              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center gap-2 text-xs font-semibold text-white/50 cursor-pointer hover:text-lime-400 hover:bg-[#171717] transition-colors px-3 py-2 rounded-full transform-gpu will-change-transform whitespace-nowrap"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Logout</span>
              </button>

              <img
                src="reyna.jpeg"
                alt="Profile"
                className="lg:hidden h-8 w-8 rounded-full object-cover cursor-pointer border border-[#262626] shrink-0"
              />

              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full text-white/70 hover:text-lime-400 hover:bg-[#171717] transition-colors shrink-0"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/login"
                className="px-3 sm:px-5 py-2.5 text-sm font-bold text-white/80 hover:text-lime-400 transition-all duration-200 whitespace-nowrap"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 sm:px-6 py-2.5 text-sm font-bold bg-lime-500 text-black rounded-full hover:bg-lime-400 transition-all duration-200 shadow-[0_0_25px_rgba(163,230,53,0.5)] hover:shadow-[0_0_35px_rgba(163,230,53,0.8)] active:scale-95 whitespace-nowrap"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-[#0a0a0a] border-b border-[#262626] shadow-xl shadow-black/40 flex flex-col p-3 gap-1 z-50">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 text-sm font-semibold text-[#a3a3a3] hover:text-lime-400 hover:bg-[#171717] transition-colors px-4 py-3 rounded-lg"
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </Link>
          ))}

          <div className="h-px bg-[#262626] my-1" />

          <div className="flex items-center justify-between px-4 py-2 flex-wrap gap-2">
            <span className="text-white/60 text-sm font-medium select-none">
              Takashi
            </span>
            {renderBadge()}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm font-semibold text-white/50 hover:text-lime-400 hover:bg-[#171717] transition-colors px-4 py-3 rounded-lg w-full text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;