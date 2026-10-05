import React from "react";

export interface GenerateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function GenerateButton({
  children = "Generate UI",
  className = "",
  style,
  ...props
}: GenerateButtonProps) {
  return (
    <button
      type="button"
      className={`group relative inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
      style={{
        background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
        boxShadow: "0 12px 30px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
        fontFamily: "inherit",
        ...style,
      }}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-spin-slow"
      >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
      <span>{children}</span>
    </button>
  );
}
