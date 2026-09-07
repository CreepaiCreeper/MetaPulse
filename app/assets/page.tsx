export const HomeWave = () => (
  <>
    <style>{`
      @keyframes move-forever {
        0% { transform: translate3d(-90px, 0, 0); }
        100% { transform: translate3d(85px, 0, 0); }
      }
      .parallax > use {
        animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
      }
      <div className="parallax"></div> > use:nth-child(1) { animation-delay: -2s; animation-duration: 7s; }
      .parallax > use:nth-child(2) { animation-delay: -3s; animation-duration: 10s; }
      .parallax > use:nth-child(3) { animation-delay: -4s; animation-duration: 13s; }
      .parallax > use:nth-child(4) { animation-delay: -5s; animation-duration: 20s; }
    `}</style>

    <svg 
      className="w-full h-[15vh] min-h-[60px] max-h-[120px]" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink" 
      viewBox="0 24 150 28" 
      preserveAspectRatio="none" 
      shapeRendering="auto"
    >
      <defs>
        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
      </defs>
      <g className="parallax">
        <use xlinkHref="#gentle-wave" x="48" y="0" fill="#a3e635" opacity="0.05" />
        <use xlinkHref="#gentle-wave" x="48" y="3" fill="#a3e635" opacity="0.10" />
        <use xlinkHref="#gentle-wave" x="48" y="5" fill="#a3e635" opacity="0.15" />
        <use xlinkHref="#gentle-wave" x="48" y="7" fill="#a3e635" opacity="0.25" />
      </g>
    </svg>
  </>
);