import React, { useState } from "react";

export const LANDSCAPE_VARIANTS = ["sunrise", "noon", "sunset", "night", "storm"] as const;
export type LandscapeVariant = (typeof LANDSCAPE_VARIANTS)[number];

export interface LandscapeSceneProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: LandscapeVariant;
}

export function LandscapeScene({
  variant: initialVariant = "sunset",
  className = "",
  style,
  ...props
}: LandscapeSceneProps) {
  const [variant, setVariant] = useState<LandscapeVariant>(initialVariant);

  const palettes: Record<LandscapeVariant, { sky: string; sun: string; mountain: string }> = {
    sunrise: { sky: "from-amber-700 via-rose-900 to-indigo-950", sun: "bg-amber-300", mountain: "text-amber-950" },
    noon: { sky: "from-sky-400 via-blue-600 to-indigo-900", sun: "bg-yellow-100", mountain: "text-slate-800" },
    sunset: { sky: "from-orange-600 via-purple-900 to-slate-950", sun: "bg-rose-400", mountain: "text-purple-950" },
    night: { sky: "from-indigo-950 via-slate-900 to-black", sun: "bg-slate-200", mountain: "text-neutral-950" },
    storm: { sky: "from-slate-700 via-zinc-800 to-neutral-950", sun: "bg-slate-400", mountain: "text-black" },
  };

  const current = palettes[variant];

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[380px] bg-gradient-to-b ${current.sky} flex flex-col justify-between p-6 select-none transition-all duration-700 ${className}`}
      style={style}
      {...props}
    >
      <div className="flex gap-2 z-20">
        {LANDSCAPE_VARIANTS.map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`px-3 py-1 rounded text-xs font-mono uppercase backdrop-blur border ${
              variant === v
                ? "bg-white/20 border-white text-white font-bold"
                : "bg-black/30 border-white/10 text-neutral-300 hover:text-white"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div
        className={`w-24 h-24 rounded-full ${current.sun} shadow-2xl absolute top-12 right-24 transition-all duration-700`}
      />

      <div className="relative w-full h-48 flex items-end">
        <svg
          viewBox="0 0 1200 400"
          className={`w-full h-full ${current.mountain} fill-current transition-colors duration-700`}
          preserveAspectRatio="none"
        >
          <path d="M0,400 L0,220 L250,90 L500,280 L750,60 L1000,210 L1200,120 L1200,400 Z" />
        </svg>
      </div>
    </div>
  );
}
