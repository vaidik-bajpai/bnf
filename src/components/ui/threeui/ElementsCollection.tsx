import React, { useState } from "react";
import { ElementsBackground, type ElementVariant } from "./ElementsBackground";
import { GenerativeTree } from "./GenerativeTree";

export type ElementsVariant = ElementVariant | "generative-tree";

export interface ElementsCollectionProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ElementsVariant;
}

export function ElementsCollection({
  variant: initialVariant = "fire",
  className = "",
  style,
  ...props
}: ElementsCollectionProps) {
  const [currentVariant, setCurrentVariant] = useState<ElementsVariant>(initialVariant);

  return (
    <div className={`flex flex-col w-full h-full ${className}`} style={style} {...props}>
      <div className="flex gap-2 p-3 bg-neutral-900 border-b border-white/10 overflow-x-auto text-xs font-mono">
        {(["fire", "water", "lightning", "generative-tree"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setCurrentVariant(v)}
            className={`px-3 py-1 rounded transition-colors uppercase ${
              currentVariant === v ? "bg-white text-black font-semibold" : "text-neutral-400 hover:text-white"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="flex-1 w-full h-full min-h-[400px]">
        {currentVariant === "generative-tree" ? (
          <GenerativeTree />
        ) : (
          <ElementsBackground variant={currentVariant} />
        )}
      </div>
    </div>
  );
}
