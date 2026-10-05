import React from "react";

export type CircleButtonVariant = "play" | "plus" | "mail";
export type CircleButtonMode = "light" | "dark";

export interface CircleButtonsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CircleButtonVariant;
  mode?: CircleButtonMode;
  hue?: number;
  saturation?: number;
  brightness?: number;
}

export function CircleButtons({
  variant = "play",
  mode = "dark",
  hue = 0,
  saturation = 1,
  brightness = 1,
  className = "",
  style,
  ...props
}: CircleButtonsProps) {
  const isDark = mode === "dark";
  const bg = isDark ? "#12141a" : "#ffffff";
  const fg = isDark ? "rgba(255,255,255,0.85)" : "#181a20";
  const border = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
  const shadow = isDark
    ? "0 12px 28px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
    : "0 10px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)";

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
      style={{
        width: 64,
        height: 64,
        background: bg,
        color: fg,
        border: `1px solid ${border}`,
        boxShadow: shadow,
        filter: `hue-rotate(${hue}deg) saturate(${saturation}) brightness(${brightness})`,
        fontFamily: "inherit",
        ...style,
      }}
      aria-label={variant}
      {...props}
    >
      {variant === "play" && (
        <svg viewBox="0 0 32 32" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M11.75 8.7c0-1.28 1.4-2.08 2.5-1.43l12 7.3a1.66 1.66 0 0 1 0 2.86l-12 7.3a1.66 1.66 0 0 1-2.5-1.43V8.7Z" />
        </svg>
      )}
      {variant === "plus" && (
        <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M16 7v18M7 16h18" />
        </svg>
      )}
      {variant === "mail" && (
        <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="5.25" y="7.5" width="21.5" height="17" rx="3.25" />
          <path d="m7.25 10 7.35 5.72a2.26 2.26 0 0 0 2.8 0L24.75 10" />
        </svg>
      )}
    </button>
  );
}
