import React from "react";

export interface PerformanceGaugesProps extends React.HTMLAttributes<HTMLDivElement> {
  score?: number;
  label?: string;
}

export function PerformanceGauges({
  score = 98,
  label = "SYSTEM EFFICIENCY",
  className = "",
  style,
  ...props
}: PerformanceGaugesProps) {
  const strokeDash = (score / 100) * 283;

  return (
    <div
      className={`inline-flex flex-col items-center p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl ${className}`}
      style={{ fontFamily: "inherit", ...style }}
      {...props}
    >
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#262626"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#10b981"
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={283 - strokeDash}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold text-white tracking-tight">{score}</span>
          <span className="text-[10px] uppercase tracking-wider text-emerald-400">FPS / MAX</span>
        </div>
      </div>
      <span className="mt-4 text-xs font-semibold tracking-widest text-neutral-400 uppercase">
        {label}
      </span>
    </div>
  );
}
