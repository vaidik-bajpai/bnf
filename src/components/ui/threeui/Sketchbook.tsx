import React, { useState } from "react";

export interface SketchbookProps extends React.HTMLAttributes<HTMLDivElement> {
  initialPage?: number;
}

export function Sketchbook({
  initialPage = 0,
  className = "",
  style,
  ...props
}: SketchbookProps) {
  const [page, setPage] = useState(initialPage);
  const totalPages = 4;

  const sketches = [
    { title: "KINETIC STUDY", notes: "Fluid oscillation dynamics along curved vector paths." },
    { title: "TOPOLOGY MESH", notes: "Subdivision surfaces responding to local stress vectors." },
    { title: "CHROMATIC DISPERSION", notes: "Multi-wavelength spectral refraction on glass surfaces." },
    { title: "NEURAL LATTICE", notes: "Node clustering with dynamic harmonic thresholds." },
  ];

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[400px] bg-[#121214] flex items-center justify-center p-8 select-none ${className}`}
      style={style}
      {...props}
    >
      <div className="relative w-full max-w-xl aspect-[4/3] bg-[#f7f5ed] text-[#1c1a17] rounded-xl shadow-2xl p-8 flex flex-col justify-between border border-neutral-300">
        {/* Ring binder holes */}
        <div className="absolute left-3 top-0 bottom-0 flex flex-col justify-around py-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-[#121214] shadow-inner" />
          ))}
        </div>

        <div className="pl-6">
          <div className="flex justify-between items-center text-xs font-mono text-neutral-500 border-b border-neutral-300 pb-2">
            <span>SKETCHBOOK NO. 04</span>
            <span>PAGE {page + 1} / {totalPages}</span>
          </div>
          <h3 className="text-2xl font-serif font-bold mt-6 tracking-wide">
            {sketches[page].title}
          </h3>
          <p className="mt-4 text-sm font-sans text-neutral-700 leading-relaxed max-w-md">
            {sketches[page].notes}
          </p>
        </div>

        <div className="pl-6 flex justify-between items-center pt-4 border-t border-neutral-300">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-1.5 rounded text-xs font-mono bg-neutral-200 hover:bg-neutral-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            ← PREV
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-1.5 rounded text-xs font-mono bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            NEXT →
          </button>
        </div>
      </div>
    </div>
  );
}
