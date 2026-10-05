import React from "react";

export interface GradientPillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function GradientPillButton({
  children = "Demo Lesson",
  className = "",
  style,
  ...props
}: GradientPillButtonProps) {
  return (
    <button
      type="button"
      className={`group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-slate-200 transition-all duration-300 hover:text-white active:scale-95 ${className}`}
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
        boxShadow: "0 18px 35px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.2)",
        fontFamily: "inherit",
        ...style,
      }}
      {...props}
    >
      <span className="tracking-tight">{children}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </button>
  );
}
