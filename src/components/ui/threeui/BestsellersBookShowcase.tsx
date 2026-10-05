import React from "react";

export interface BestsellersBookShowcaseProps extends React.HTMLAttributes<HTMLDivElement> {
  headline?: string;
}

export function BestsellersBookShowcase({
  headline = "FIELD MANUALS // TOOLS FOR THOUGHT",
  className = "",
  style,
  ...props
}: BestsellersBookShowcaseProps) {
  const books = [
    { title: "KINETIC CODE", author: "DESIGNCODE", color: "from-amber-600 to-rose-900" },
    { title: "SHADER PATTERNS", author: "THREEUI", color: "from-cyan-600 to-blue-900" },
    { title: "SYSTEM ARCHITECTURE", author: "CORE LABS", color: "from-emerald-600 to-teal-900" },
  ];

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[440px] bg-neutral-950 text-white flex flex-col justify-between p-10 border border-white/10 rounded-2xl select-none ${className}`}
      style={style}
      {...props}
    >
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <span className="font-mono text-xs tracking-widest text-neutral-400">{headline}</span>
        <span className="font-mono text-xs text-amber-400 font-semibold">BESTSELLERS</span>
      </div>

      <div className="flex items-center justify-around gap-6 py-8">
        {books.map((b, i) => (
          <div
            key={i}
            className={`w-48 h-64 rounded-xl bg-gradient-to-br ${b.color} p-6 shadow-2xl flex flex-col justify-between border border-white/20 hover:scale-105 transition-transform cursor-pointer`}
          >
            <span className="text-[10px] font-mono tracking-widest text-white/70">VOL. 0{i + 1}</span>
            <div>
              <h3 className="text-xl font-black text-white leading-tight">{b.title}</h3>
              <p className="text-xs font-mono text-white/80 mt-2">{b.author}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center text-xs font-mono text-neutral-500 pt-4 border-t border-white/10">
        <span>CURATED COLLECTION</span>
        <span>VERIFIED EDITION</span>
      </div>
    </div>
  );
}
