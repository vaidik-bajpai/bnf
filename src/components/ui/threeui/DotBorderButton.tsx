import React from "react";

export interface DotBorderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  dotColor?: string;
  speed?: number;
}

export function DotBorderButton({
  children = "Explore Catalog",
  dotColor = "rgba(255,255,255,0.7)",
  speed = 1,
  className = "",
  style,
  ...props
}: DotBorderButtonProps) {
  return (
    <button
      type="button"
      className={`threeui-dot-border-btn relative inline-flex items-center justify-center px-8 py-3.5 rounded-lg text-sm font-medium tracking-wide text-neutral-100 transition-all duration-300 hover:text-white active:scale-95 ${className}`}
      style={{
        background: "rgba(10, 10, 12, 0.8)",
        border: "1px dashed rgba(255,255,255,0.25)",
        fontFamily: "inherit",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        ...style,
      }}
      {...props}
    >
      <style>{`
        .threeui-dot-border-btn::before {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 12px;
          border: 1px dotted ${dotColor};
          opacity: 0.4;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .threeui-dot-border-btn:hover::before {
          opacity: 0.9;
        }
      `}</style>
      <span className="relative z-10 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        {children}
      </span>
    </button>
  );
}
