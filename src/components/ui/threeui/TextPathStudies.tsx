import React, { useState } from "react";
import { RippleStudy } from "./RippleStudy";
import { BallStudy } from "./BallStudy";
import { ClothStudy } from "./ClothStudy";
import { MorphingGlyphCloud } from "./MorphingGlyphCloud";
import { OutlineTypeflow } from "./OutlineTypeflow";

export type TextPathVariant =
  | "ripple-study"
  | "ball-study"
  | "cloth-study"
  | "morphing-glyph-cloud"
  | "outline-typeflow";

export interface TextPathStudiesProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TextPathVariant;
}

export function TextPathStudies({
  variant: initialVariant = "outline-typeflow",
  className = "",
  style,
  ...props
}: TextPathStudiesProps) {
  const [currentVariant, setCurrentVariant] = useState<TextPathVariant>(initialVariant);

  return (
    <div className={`flex flex-col w-full h-full ${className}`} style={style} {...props}>
      <div className="flex gap-2 p-3 bg-neutral-900 border-b border-white/10 overflow-x-auto text-xs font-mono">
        {(["outline-typeflow", "morphing-glyph-cloud", "cloth-study", "ripple-study", "ball-study"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setCurrentVariant(v)}
            className={`px-3 py-1 rounded transition-colors ${
              currentVariant === v ? "bg-white text-black font-semibold" : "text-neutral-400 hover:text-white"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="flex-1 w-full h-full min-h-[400px]">
        {currentVariant === "outline-typeflow" && <OutlineTypeflow />}
        {currentVariant === "morphing-glyph-cloud" && <MorphingGlyphCloud />}
        {currentVariant === "cloth-study" && <ClothStudy />}
        {currentVariant === "ripple-study" && <RippleStudy />}
        {currentVariant === "ball-study" && <BallStudy />}
      </div>
    </div>
  );
}
