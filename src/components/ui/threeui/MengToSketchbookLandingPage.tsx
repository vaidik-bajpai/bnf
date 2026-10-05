import React from "react";
import { Sketchbook } from "./Sketchbook";

export interface MengToSketchbookLandingPageProps extends React.HTMLAttributes<HTMLDivElement> {
  artist?: string;
}

export function MengToSketchbookLandingPage({
  artist = "Meng To // Visual Journal",
  className = "",
  style,
  ...props
}: MengToSketchbookLandingPageProps) {
  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[500px] bg-[#0c0c0e] flex flex-col ${className}`}
      style={style}
      {...props}
    >
      <div className="p-8 border-b border-white/10 flex justify-between items-center">
        <div>
          <span className="text-xs font-mono text-amber-400">ORIGINAL ARTWORK</span>
          <h1 className="text-2xl font-bold text-white mt-1">{artist}</h1>
        </div>
      </div>
      <div className="flex-1 w-full h-full min-h-[420px] flex items-center justify-center p-6">
        <Sketchbook />
      </div>
    </div>
  );
}
