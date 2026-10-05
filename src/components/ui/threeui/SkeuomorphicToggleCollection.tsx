import React, { useState } from "react";
import { SkeuomorphicToggle } from "./SkeuomorphicToggle";

export type SkeuomorphicToggleVariant = "skeuomorphic-toggle" | "modern" | "glass";

export interface SkeuomorphicToggleCollectionProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeuomorphicToggleVariant;
}

export function SkeuomorphicToggleCollection({
  variant: initialVariant = "skeuomorphic-toggle",
  className = "",
  style,
  ...props
}: SkeuomorphicToggleCollectionProps) {
  const [currentVariant, setCurrentVariant] = useState<SkeuomorphicToggleVariant>(initialVariant);

  return (
    <div className={`flex flex-col items-center gap-6 p-8 w-full ${className}`} style={style} {...props}>
      <div className="flex gap-2 p-2 bg-neutral-900 border border-white/10 rounded-xl overflow-x-auto text-xs font-mono">
        {(["skeuomorphic-toggle", "modern", "glass"] as const).map((v) => (
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
        <SkeuomorphicToggle />
      </div>
    </div>
  );
}
