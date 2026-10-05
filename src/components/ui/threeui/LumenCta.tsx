import React from "react";

export type LumenCtaVariant = "primary" | "ghost";
export type LumenCtaMode = "light" | "dark";

export interface LumenCtaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LumenCtaVariant;
  mode?: LumenCtaMode;
  label?: string;
  ring?: boolean;
}

export function LumenCta({
  variant = "primary",
  mode = "dark",
  label = "Get your card",
  ring = true,
  className = "",
  style,
  ...props
}: LumenCtaProps) {
  return (
    <div className="relative inline-block group">
      {ring && (
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 opacity-70 blur-md group-hover:opacity-100 transition duration-500 animate-pulse" />
      )}
      <button
        className={`relative px-8 py-3.5 rounded-full font-medium text-sm tracking-wide transition-all duration-300 ${
          variant === "primary"
            ? "bg-white text-black hover:bg-neutral-100 shadow-xl"
            : "bg-black/80 text-white border border-white/20 hover:bg-black/90"
        } ${className}`}
        style={style}
        {...props}
      >
        {label}
      </button>
    </div>
  );
}
