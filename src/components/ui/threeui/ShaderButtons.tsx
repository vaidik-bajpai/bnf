import React, { useState } from "react";
import { IgnitionButton } from "./IgnitionButton";
import { InductionButton } from "./InductionButton";
import { PlasmaButton } from "./PlasmaButton";
import { TactileButton } from "./TactileButton";
import { ThinkingButton } from "./ThinkingButton";

export type ShaderButtonVariant =
  | "ignition-button"
  | "induction-button"
  | "plasma-button"
  | "tactile-button"
  | "thinking-button";

export interface ShaderButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ShaderButtonVariant;
}

export function ShaderButtons({
  variant: initialVariant = "plasma-button",
  className = "",
  style,
  ...props
}: ShaderButtonsProps) {
  const [currentVariant, setCurrentVariant] = useState<ShaderButtonVariant>(initialVariant);

  return (
    <div className={`flex flex-col items-center gap-6 p-8 w-full ${className}`} style={style} {...props}>
      <div className="flex gap-2 p-2 bg-neutral-900 border border-white/10 rounded-xl overflow-x-auto text-xs font-mono">
        {(["ignition-button", "induction-button", "plasma-button", "tactile-button", "thinking-button"] as const).map((v) => (
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
        {currentVariant === "ignition-button" && <IgnitionButton />}
        {currentVariant === "induction-button" && <InductionButton />}
        {currentVariant === "plasma-button" && <PlasmaButton />}
        {currentVariant === "tactile-button" && <TactileButton />}
        {currentVariant === "thinking-button" && <ThinkingButton />}
      </div>
    </div>
  );
}
