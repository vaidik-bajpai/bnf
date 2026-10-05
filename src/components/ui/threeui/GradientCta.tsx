import React from "react";

export interface GradientCtaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function GradientCta({
  children = "Get Unlimited Access",
  className = "",
  style,
  ...props
}: GradientCtaProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-95 ${className}`}
      style={{
        background: "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)",
        boxShadow: "0 10px 25px rgba(244, 63, 94, 0.4)",
        fontFamily: "inherit",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
