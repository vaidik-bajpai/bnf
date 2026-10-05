import React, { useState } from "react";

export type CharacterCarouselVariant = "filmstrip" | "wave";

export interface CharacterCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CharacterCarouselVariant;
  activeIndex?: number;
}

export function CharacterCarousel({
  variant = "filmstrip",
  activeIndex = 1,
  className = "",
  style,
  ...props
}: CharacterCarouselProps) {
  const [selected, setSelected] = useState(activeIndex);

  const characters = [
    { id: "c1", name: "KAGE", role: "SHADOW ARCHITECT", bg: "from-zinc-800 to-black" },
    { id: "c2", name: "SYLVA", role: "BOTANICAL GUARDIAN", bg: "from-emerald-900 to-black" },
    { id: "c3", name: "AURA", role: "LUMEN SYNTHESIS", bg: "from-amber-900 to-black" },
    { id: "c4", name: "CODEX", role: "VECTOR WEAVER", bg: "from-sky-900 to-black" },
  ];

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[420px] bg-[#0c0d10] flex flex-col items-center justify-center p-8 select-none ${className}`}
      style={style}
      {...props}
    >
      <div className="flex items-center justify-center gap-6 w-full max-w-4xl perspective-[1200px]">
        {characters.map((c, idx) => {
          const diff = idx - selected;
          const isActive = idx === selected;
          const waveY = variant === "wave" ? Math.sin(idx * 1.5) * 30 : 0;

          return (
            <div
              key={c.id}
              onClick={() => setSelected(idx)}
              className={`relative cursor-pointer transition-all duration-500 rounded-2xl p-6 bg-gradient-to-b ${c.bg} border border-white/10 shadow-2xl flex flex-col justify-end ${
                isActive
                  ? "w-64 h-96 scale-105 z-20 opacity-100 ring-2 ring-white/30"
                  : "w-44 h-80 scale-95 z-10 opacity-40 hover:opacity-75"
              }`}
              style={{
                transform: `translateY(${waveY}px) rotateY(${diff * -12}deg) translateZ(${isActive ? 30 : -20}px)`,
              }}
            >
              <div className="text-[10px] font-mono tracking-widest text-white/60 mb-1">{c.role}</div>
              <div className="text-2xl font-black text-white">{c.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
