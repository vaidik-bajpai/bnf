import React from "react";

export interface InterfaceLinesProps extends React.HTMLAttributes<HTMLDivElement> {
  code?: string;
}

export function InterfaceLines({
  code = "SEC-09 // HUD GRID",
  className = "",
  style,
  ...props
}: InterfaceLinesProps) {
  return (
    <div
      className={`relative w-full h-full min-h-[300px] p-6 border border-white/10 bg-neutral-950 flex flex-col justify-between font-mono text-xs text-neutral-400 select-none ${className}`}
      style={style}
      {...props}
    >
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-cyan-400 font-semibold">{code}</span>
        <span>LAT: 37.7749° N</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-24 h-24 border border-cyan-500/20 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
        </div>
      </div>
      <div className="flex justify-between items-center border-t border-white/5 pt-2">
        <span>FREQ: 1420.405 MHz</span>
        <span className="text-emerald-400">TELEMETRY NOMINAL</span>
      </div>
    </div>
  );
}
