import React, { useState } from "react";
import { AudioWordmark } from "./AudioWordmark";
import { GalleryHeading } from "./GalleryHeading";
import { ParticleWordmark } from "./ParticleWordmark";
import { ThreeUIIntro } from "./ThreeUIIntro";
import { NeonTypography } from "./NeonTypography";

export type TextAnimationVariant =
  | "audio-wordmark"
  | "gallery-heading"
  | "particle-wordmark"
  | "threeui-intro"
  | "neon-sign";

export interface TextAnimationCollectionProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TextAnimationVariant;
}

export function TextAnimationCollection({
  variant: initialVariant = "gallery-heading",
  className = "",
  style,
  ...props
}: TextAnimationCollectionProps) {
  const [currentVariant, setCurrentVariant] = useState<TextAnimationVariant>(initialVariant);

  return (
    <div className={`flex flex-col w-full h-full ${className}`} style={style} {...props}>
      <div className="flex gap-2 p-3 bg-neutral-900 border-b border-white/10 overflow-x-auto text-xs font-mono">
        {(["gallery-heading", "audio-wordmark", "particle-wordmark", "threeui-intro", "neon-sign"] as const).map((v) => (
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
        {currentVariant === "gallery-heading" && <GalleryHeading />}
        {currentVariant === "audio-wordmark" && <AudioWordmark />}
        {currentVariant === "particle-wordmark" && <ParticleWordmark />}
        {currentVariant === "threeui-intro" && <ThreeUIIntro />}
        {currentVariant === "neon-sign" && <NeonTypography />}
      </div>
    </div>
  );
}
