export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background">
      {/* Logo card with animated scanning line */}
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className="absolute -inset-3 rounded-2xl border border-primary/20"
          style={{ animation: "ping-slow 2.4s cubic-bezier(0.4,0,0.6,1) infinite" }}
        />

        {/* Logo box */}
        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg">
          {/* Scanning bar */}
          <div
            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/70 to-transparent"
            style={{ animation: "scan 1.8s ease-in-out infinite" }}
          />

          {/* Bolt icon — pure SVG, no lucide import needed */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7 text-foreground"
            aria-hidden="true"
          >
            <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-lg font-black tracking-tight text-foreground">IndexFast</span>
        <span className="text-xs font-medium text-muted-foreground">Getting things ready…</span>
      </div>

      {/* Three staggered dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary/50"
            style={{
              animation: "bounce-dot 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes ping-slow {
          0%   { transform: scale(1);   opacity: 0.4; }
          50%  { transform: scale(1.14); opacity: 0.1; }
          100% { transform: scale(1);   opacity: 0.4; }
        }
        @keyframes scan {
          0%   { top: 0%;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0);    opacity: 0.4; }
          40%           { transform: translateY(-6px); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
