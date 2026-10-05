import React from "react";

export interface GlassmorphismCtaProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string;
  heading?: string;
  actionText?: string;
  onAction?: () => void;
}

export function GlassmorphismCta({
  badge = "VERSION 2.0",
  heading = "A modern design system for tactile components",
  actionText = "Join the private beta",
  onAction,
  className = "",
  style,
  ...props
}: GlassmorphismCtaProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-xl border border-white/15 ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        boxShadow: "0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
        fontFamily: "inherit",
        ...style,
      }}
      {...props}
    >
      <div className="flex flex-col items-start gap-4 max-w-lg">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-cyan-300 border border-cyan-400/30">
          {badge}
        </span>
        <h4 className="text-xl sm:text-2xl font-medium text-white tracking-tight leading-snug">
          {heading}
        </h4>
        <button
          type="button"
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 px-5 py-2.5 text-sm font-medium text-cyan-200 border border-cyan-500/40 transition-all hover:bg-cyan-500/30 active:scale-95"
        >
          <span>{actionText}</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
