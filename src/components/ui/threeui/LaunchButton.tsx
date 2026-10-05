import React from "react";

export interface LaunchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function LaunchButton({
  children = "Initialize Launch",
  className = "",
  style,
  ...props
}: LaunchButtonProps) {
  return (
    <button
      type="button"
      className={`group relative inline-flex items-center justify-center cursor-pointer transition-all duration-200 active:translate-y-[2px] ${className}`}
      style={{ fontFamily: "inherit", ...style }}
      {...props}
    >
      <div className="absolute -inset-1 rounded-xl bg-amber-500/30 blur opacity-40 transition duration-500 group-hover:opacity-75" />
      <div className="relative flex items-center gap-3 rounded-xl bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 px-8 py-3.5 font-medium tracking-tight text-amber-950 shadow-[0_0_0_1px_rgba(251,191,36,0.5),0_4px_0_#b45309,0_10px_15px_-3px_rgba(0,0,0,0.5)] active:shadow-[0_0_0_1px_rgba(251,191,36,0.5),0_2px_0_#b45309]">
        <span>{children}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="fill-amber-950/20"
        >
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
        </svg>
      </div>
    </button>
  );
}
