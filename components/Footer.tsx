import React from "react";
import { Search } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-[#030712] border-t border-white/10 pt-16 pb-8 px-4 flex flex-col items-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-4 md:col-span-1">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-normal text-sm"
          >
            <svg
              className="w-8 h-8 text-lime-500 drop-shadow-[0_0_8px_rgba(163,230,53,0.5)] transform-gpu will-change-transform"
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
            <span className="text-white/90 font-semibold tracking-wide text-xl drop-shadow-[0_0_8px_rgba(163,230,53,0.5)] transform-gpu will-change-transform select-none">
              Meta<span className="text-lime-500 font-bold">Pulse</span>
            </span>
          </Link>
          <p className="text-white/40 text-sm leading-relaxed select-none">
            Instant AI-driven SEO insights, speed metrics, and actionable code
            fixes for web developers.
          </p>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col gap-3">
          <h4 className="text-lime-400 font-semibold text-sm tracking-wider uppercase drop-shadow-[0_0_8px_rgba(163,230,53,0.5)] transform-gpu will-change-transform select-none">
            Product
          </h4>
          <Link
            href="/dashboard"
            className="text-white/40 hover:text-lime-400 text-sm transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-white/40 hover:text-lime-400 text-sm transition-colors duration-200"
          >
            Pricing
          </Link>
          <Link
            href="/analyze"
            className="text-white/40 hover:text-lime-400 text-sm transition-colors duration-200"
          >
            Analyze
          </Link>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col gap-3">
          <h4 className="text-lime-400 font-semibold text-sm tracking-wider uppercase drop-shadow-[0_0_8px_rgba(163,230,53,0.5)] transform-gpu will-change-transform select-none">
            Resources
          </h4>
          <Link
            href="#"
            className="text-white/40 hover:text-lime-400 text-sm transition-colors duration-200"
          >
            Documentation
          </Link>
          <Link
            href="#"
            className="text-white/40 hover:text-lime-400 text-sm transition-colors duration-200"
          >
            SEO Guide
          </Link>
          <Link
            href="#"
            className="text-white/40 hover:text-lime-400 text-sm transition-colors duration-200"
          >
            API Docs
          </Link>
        </div>

        {/* Links Column 3 */}
        <div className="flex flex-col gap-3">
          <h4 className="text-lime-400 font-semibold text-sm tracking-wider uppercase drop-shadow-[0_0_8px_rgba(163,230,53,0.5)] transform-gpu will-change-transform select-none">
            Legal & Social
          </h4>
          <Link
            href="#"
            className="text-white/40 hover:text-lime-400 text-sm transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-white/40 hover:text-lime-400 text-sm transition-colors duration-200"
          >
            Terms of Service
          </Link>

          <div className="flex items-center gap-4 mt-2">
            {/* X / Twitter Link */}
            <a
              href="https://x.com/CreeperXD8759"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-lime-500/10 border border-white/10 hover:border-lime-500/30 flex items-center justify-center text-white/60 hover:text-lime-400 transition-all duration-200"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/CreepaiCreeper/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-lime-500/10 border border-white/10 hover:border-lime-500/30 flex items-center justify-center text-white/60 hover:text-lime-400 transition-all duration-200"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn Link */}
            <a
              href="https://www.linkedin.com/in/abuzar-gazdar-a5821130b"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-lime-500/10 border border-white/10 hover:border-lime-500/30 flex items-center justify-center text-white/60 hover:text-lime-400 transition-all duration-200"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* Fiverr Link */}
            <a
              href="https://www.fiverr.com/s/jyvz6am"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-lime-500/10 border border-white/10 hover:border-lime-500/30 flex items-center justify-center text-white/60 hover:text-lime-400 transition-all duration-200"
            >
              <span className="text-xl font-bold">fi</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl w-full pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 select-none">
        <p>© 2026 MetaPulse. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;