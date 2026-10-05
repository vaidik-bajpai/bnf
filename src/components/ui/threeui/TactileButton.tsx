import React from "react";

export interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function TactileButton({
  children = "SURGE",
  className = "",
  style,
  ...props
}: TactileButtonProps) {
  return (
    <div className="inline-block p-[1px] rounded-[19px] bg-gradient-to-b from-cyan-500/30 via-neutral-800/20 to-cyan-950/40 shadow-2xl">
      <button
        type="button"
        className={`relative flex items-center justify-center w-[230px] h-[64px] border-0 p-0 rounded-[18px] overflow-hidden cursor-pointer bg-[#050b11] transition-all duration-300 ease-out shadow-[0_22px_44px_rgba(4,24,36,0.35),0_3px_9px_rgba(5,10,15,0.4),inset_0_0_0_1px_rgba(255,255,255,0.05)] hover:-translate-y-[2px] hover:shadow-[0_28px_56px_rgba(6,182,212,0.25),0_4px_11px_rgba(5,10,15,0.45)] active:translate-y-[1px] active:scale-[0.985] ${className}`}
        style={{ fontFamily: "inherit", ...style }}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-transparent to-cyan-900/20 opacity-40 pointer-events-none" />
        <span className="relative z-10 pointer-events-none font-medium text-sm tracking-[0.3em] indent-[0.3em] text-[#e0faff] drop-shadow-[0_1px_10px_rgba(0,18,25,0.85)] flex items-center gap-2">
          {children}
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </button>
    </div>
  );
}
