import React, { useState } from "react";
import { LaunchButton } from "./LaunchButton";
import { DotBorderButton } from "./DotBorderButton";
import { GradientPillButton } from "./GradientPillButton";
import { GenerateButton } from "./GenerateButton";
import { SpinningBorderButton } from "./SpinningBorderButton";
import { LumenCta } from "./LumenCta";

export type RectangleButtonVariant =
  | "launch-button"
  | "dot-border-button"
  | "gradient-pill-button"
  | "generate-button"
  | "spinning-border-button"
  | "lumen-cta";

export interface RectangleButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: RectangleButtonVariant;
}

export function RectangleButtons({
  variant: initialVariant = "launch-button",
  className = "",
  style,
  ...props
}: RectangleButtonsProps) {
  const [currentVariant, setCurrentVariant] = useState<RectangleButtonVariant>(initialVariant);

  return (
    <div className={`flex flex-col items-center gap-6 p-8 w-full ${className}`} style={style} {...props}>
      <div className="flex gap-2 p-2 bg-neutral-900 border border-white/10 rounded-xl overflow-x-auto text-xs font-mono">
        {(["launch-button", "dot-border-button", "gradient-pill-button", "generate-button", "spinning-border-button", "lumen-cta"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setCurrentVariant(v)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentVariant === v ? "bg-white text-black font-semibold" : "text-neutral-400 hover:text-white"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center p-12 min-h-[160px]">
        {currentVariant === "launch-button" && <LaunchButton />}
        {currentVariant === "dot-border-button" && <DotBorderButton />}
        {currentVariant === "gradient-pill-button" && <GradientPillButton />}
        {currentVariant === "generate-button" && <GenerateButton />}
        {currentVariant === "spinning-border-button" && <SpinningBorderButton />}
        {currentVariant === "lumen-cta" && <LumenCta />}
      </div>
    </div>
  );
}
