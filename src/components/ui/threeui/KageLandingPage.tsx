import React from "react";
import { JapaneseTowerLandscape } from "./JapaneseTowerLandscape";

export interface KageLandingPageProps extends React.HTMLAttributes<HTMLDivElement> {
  headline?: string;
}

export function KageLandingPage({
  headline = "Where stillness reveals the unseen.",
  className = "",
  style,
  ...props
}: KageLandingPageProps) {
  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[520px] bg-neutral-950 flex flex-col ${className}`}
      style={style}
      {...props}
    >
      <div className="absolute top-8 left-8 z-30 space-y-2">
        <span className="text-xs font-mono tracking-widest text-pink-300 uppercase">
          KAGE // 影
        </span>
        <h1 className="text-3xl md:text-5xl font-serif text-white max-w-md drop-shadow-md">
          {headline}
        </h1>
      </div>
      <div className="flex-1 w-full h-full min-h-[440px]">
        <JapaneseTowerLandscape />
      </div>
    </div>
  );
}
