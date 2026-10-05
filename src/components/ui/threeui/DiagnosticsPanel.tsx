import React, { useEffect, useState } from "react";

export interface DiagnosticsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  systemName?: string;
}

export function DiagnosticsPanel({
  systemName = "AEONIX CORE",
  className = "",
  style,
  ...props
}: DiagnosticsPanelProps) {
  const [load, setLoad] = useState(42);
  const [temp, setTemp] = useState(68);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoad(38 + Math.floor(Math.random() * 25));
      setTemp(65 + Math.floor(Math.random() * 10));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`inline-block w-80 rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-neutral-200 font-mono shadow-2xl ${className}`}
      style={{ fontFamily: "inherit", ...style }}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
        <span className="text-xs font-semibold tracking-wider text-emerald-400">
          SYS // DIAGNOSTICS
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
      <div className="text-sm font-bold text-white mb-4">{systemName}</div>
      <div className="space-y-3 text-xs">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-neutral-400">PROCESSING LOAD</span>
            <span className="text-emerald-300 font-semibold">{load}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${load}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-neutral-400">THERMAL JUNCTION</span>
            <span className="text-cyan-300 font-semibold">{temp} °C</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-500"
              style={{ width: `${temp}%` }}
            />
          </div>
        </div>
      </div>
      <div className="mt-5 pt-3 border-t border-neutral-900 flex justify-between text-[11px] text-neutral-500">
        <span>STATUS: NOMINAL</span>
        <span>LINK: SECURE</span>
      </div>
    </div>
  );
}
