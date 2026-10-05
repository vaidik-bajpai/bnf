import React, { useEffect, useState } from "react";

export interface ThreeUIIntroProps extends React.HTMLAttributes<HTMLDivElement> {
  productName?: string;
  tagline?: string;
}

export function ThreeUIIntro({
  productName = "THREE UI",
  tagline = "SHADERS FOR THE NEXT GENERATION",
  className = "",
  style,
  ...props
}: ThreeUIIntroProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((prev) => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[380px] bg-black text-white flex flex-col items-center justify-center p-8 select-none ${className}`}
      style={style}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none z-10" />
      <div className="relative z-20 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[11px] font-mono tracking-widest uppercase text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          KEYNOTE STUDY 01
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-200 to-neutral-500 transition-all duration-700 transform">
          {phase === 0 ? productName : phase === 1 ? "PURE KINETICS" : "HARDWARE ACCELERATED"}
        </h1>
        <p className="text-xs md:text-sm font-mono text-neutral-400 tracking-wider uppercase max-w-md">
          {tagline}
        </p>
        <div className="flex items-center gap-3 pt-4">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${
                phase === idx ? "w-8 bg-cyan-400" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
