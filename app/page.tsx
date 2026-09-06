import React from "react";

const page = () => {
  return (
    <div className="bg-[#030712] min-h-screen w-full flex flex-col items-center px-4">
      <div className="flex flex-col items-center w-full max-w-4xl">
        <div className="mt-12 sm:mt-16 lg:mt-20 flex gap-2 border border-lime-500/30 bg-lime-500/10 px-3 py-1.5 items-center rounded-full shadow-[0_0_15px_rgba(163,230,53,0.15)]">
          <svg
            className="w-4 h-4 text-lime-400 shrink-0 drop-shadow-[0_0_8px_rgba(163,230,53,0.8)]"
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
          <span className="text-[11px] sm:text-xs font-semibold text-lime-400 tracking-wider select-none">
            INSTANT SEO ANALYSIS IN SECONDS
          </span>
        </div>

        <h1 className=" sm:text-5xl lg:text-6xl text-lime-400 mt-6 select-none text-center drop-shadow-[0_0_35px_rgba(163,230,53,0.35)]">
          Analyze & Boost Your{" "}
        </h1>
        <span className="font-bold text-3xl sm:text-5xl lg:text-6xl text-lime-500 mt-2 select-none text-center drop-shadow-[0_0_35px_rgba(132,204,22,0.35)]">
          SEO Rankings
        </span>

        <p className="text-white/40 mt-6 text-sm sm:text-base text-center max-w-xl lg:max-w-2xl leading-relaxed select-none">
          Paste any website URL below to get instant AI-driven insights on SEO,
          performance, and accessibility.
        </p>
        <p className="text-white/40 text-sm sm:text-base text-center mt-1 select-none">
          Stop guessing—optimize your site in one click.
        </p>

        {/* Input box */}
        <div className="mt-8 w-full max-w-2xl px-2">
          <div className="relative flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl sm:rounded-full bg-[#0a0f1d]/80 border border-lime-500/30 shadow-[0_0_25px_rgba(163,230,53,0.15)] focus-within:border-lime-400 focus-within:shadow-[0_0_35px_rgba(163,230,53,0.3)] transition-all duration-300">
            {/* Input Box */}
            <input
              type="url"
              placeholder="Paste website URL (e.g. https://example.com)"
              className="w-full bg-transparent px-5 py-3 sm:py-2 text-sm sm:text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />

            {/* Glow Action Button */}
            <button
              type="button"
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-full bg-lime-500 hover:bg-lime-400 text-black font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(163,230,53,0.4)] hover:shadow-[0_0_30px_rgba(163,230,53,0.7)] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span>Analyze Site</span>
              <svg
                className="w-4 h-4 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Free */}
        <span className="text-white/40 mt-3 text-sm sm:text-base text-center max-w-xl lg:max-w-2xl leading-relaxed select-none">Free — No credit card required • 5 analyses per day</span>
      </div>
    </div>
  );
};

export default page;
