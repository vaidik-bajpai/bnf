import React from "react";

export interface GradientBeamCtaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function GradientBeamCta({
  children = "Explore Architecture",
  className = "",
  style,
  ...props
}: GradientBeamCtaProps) {
  return (
    <button
      type="button"
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full p-[2px] transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
      style={{ fontFamily: "inherit", ...style }}
      {...props}
    >
      <span className="absolute inset-0 bg-[linear-gradient(90deg,#ff4545,#00d2ff,#ff4545)] animate-[spin_4s_linear_infinite] opacity-75" />
      <span className="relative flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white shadow-xl">
        <span>{children}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
    </button>
  );
}
