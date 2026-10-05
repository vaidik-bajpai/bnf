import React from "react";
import { BookshelfScene } from "./BookshelfScene";

export interface CompleteShelfLandingPageProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function CompleteShelfLandingPage({
  title = "Working Volumes // Seven Tools for Making",
  className = "",
  style,
  ...props
}: CompleteShelfLandingPageProps) {
  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[500px] bg-neutral-950 flex flex-col ${className}`}
      style={style}
      {...props}
    >
      <div className="p-8 border-b border-white/10 flex justify-between items-center">
        <div>
          <span className="text-xs font-mono text-cyan-400">ARCHIVE CATALOG</span>
          <h1 className="text-2xl font-bold text-white mt-1">{title}</h1>
        </div>
        <button className="px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-xs font-mono text-white hover:bg-white/20 transition-colors">
          EXPLORE CODEX
        </button>
      </div>
      <div className="flex-1 w-full h-full min-h-[400px]">
        <BookshelfScene />
      </div>
    </div>
  );
}
