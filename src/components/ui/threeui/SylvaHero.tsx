import React from "react";
import { SylvaLivingWorldScene } from "./SylvaLivingWorldScene";

export interface SylvaHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  tagline?: string;
}

export function SylvaHero({
  title = "SYLVA",
  tagline = "Into the living world.",
  className = "",
  style,
  ...props
}: SylvaHeroProps) {
  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[500px] bg-[#03140d] flex flex-col ${className}`}
      style={style}
      {...props}
    >
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-8 pointer-events-none">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-4 pointer-events-auto">
          BIOSPHERE ENGINE
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg">
          {title}
        </h1>
        <p className="text-sm md:text-base font-mono text-emerald-300/80 max-w-md">
          {tagline}
        </p>
      </div>
      <div className="flex-1 w-full h-full min-h-[420px]">
        <SylvaLivingWorldScene />
      </div>
    </div>
  );
}
