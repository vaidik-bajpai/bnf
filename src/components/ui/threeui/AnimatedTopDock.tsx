import React, { useState } from "react";

export type AnimatedTopDockVariant = "sable" | "modern" | "retro" | "glass";

export interface AnimatedTopDockProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AnimatedTopDockVariant;
  items?: Array<{ id: string; label: string; icon: string }>;
}

export function AnimatedTopDock({
  variant = "glass",
  items = [
    { id: "finder", label: "Finder", icon: "⌘" },
    { id: "terminal", label: "Terminal", icon: ">_" },
    { id: "code", label: "Editor", icon: "{ }" },
    { id: "browser", label: "Browser", icon: "🌐" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ],
  className = "",
  style,
  ...props
}: AnimatedTopDockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={`flex items-center justify-center p-4 w-full select-none ${className}`}
      style={style}
      {...props}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-neutral-900/80 backdrop-blur-xl border border-white/10 shadow-2xl">
        {items.map((item, idx) => {
          const isHovered = hoveredIndex === idx;
          const isNeighbor = hoveredIndex !== null && Math.abs(hoveredIndex - idx) === 1;
          const scale = isHovered ? 1.35 : isNeighbor ? 1.15 : 1;
          const translateY = isHovered ? -8 : isNeighbor ? -4 : 0;

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative flex flex-col items-center group cursor-pointer transition-all duration-200 ease-out"
              style={{
                transform: `translateY(${translateY}px) scale(${scale})`,
              }}
            >
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-lg font-mono text-white shadow-md hover:border-cyan-400/50 hover:bg-white/10 transition-colors">
                {item.icon}
              </div>
              {isHovered && (
                <span className="absolute -bottom-6 px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-sans font-medium text-neutral-200 whitespace-nowrap border border-white/10 shadow-lg">
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
