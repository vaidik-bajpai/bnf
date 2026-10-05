import React, { useState } from "react";

export interface GalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  activeIndex?: number;
}

export function Gallery({
  activeIndex = 2,
  className = "",
  style,
  ...props
}: GalleryProps) {
  const [selected, setSelected] = useState(activeIndex);
  const items = [
    { title: "KINETIC FLUIDS", tag: "STUDY 01", color: "from-blue-600 to-indigo-900" },
    { title: "NEURAL TOPOLOGY", tag: "STUDY 02", color: "from-emerald-600 to-teal-900" },
    { title: "EMERALD HORIZON", tag: "STUDY 03", color: "from-purple-600 to-pink-900" },
    { title: "ORBITAL SPHERES", tag: "STUDY 04", color: "from-amber-600 to-orange-900" },
    { title: "STREAM CONVERGENCE", tag: "STUDY 05", color: "from-cyan-600 to-blue-900" },
  ];

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[420px] bg-neutral-950 flex flex-col items-center justify-center p-6 select-none ${className}`}
      style={style}
      {...props}
    >
      <div className="flex items-center justify-center gap-4 w-full max-w-4xl perspective-[1000px]">
        {items.map((item, idx) => {
          const diff = idx - selected;
          const isActive = idx === selected;
          return (
            <div
              key={idx}
              onClick={() => setSelected(idx)}
              className={`relative cursor-pointer transition-all duration-500 rounded-2xl p-6 bg-gradient-to-br ${item.color} shadow-2xl flex flex-col justify-end overflow-hidden border border-white/20 ${
                isActive
                  ? "w-72 h-96 z-20 scale-105 opacity-100 ring-2 ring-white/40"
                  : "w-48 h-80 z-10 scale-95 opacity-50 hover:opacity-75"
              }`}
              style={{
                transform: `rotateY(${diff * -15}deg) translateZ(${isActive ? 40 : -20}px)`,
              }}
            >
              <div className="text-[10px] font-mono tracking-widest text-white/70 mb-1">{item.tag}</div>
              <div className="text-xl font-black text-white leading-tight">{item.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
