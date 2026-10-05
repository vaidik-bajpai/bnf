import React from "react";

export interface SlidingTextCtaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function SlidingTextCta({
  children = "Discover More",
  className = "",
  style,
  ...props
}: SlidingTextCtaProps) {
  return (
    <button
      type="button"
      className={`group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all duration-300 hover:bg-neutral-200 active:scale-95 ${className}`}
      style={{ fontFamily: "inherit", ...style }}
      {...props}
    >
      <span className="flex flex-col transition-transform duration-300 group-hover:-translate-y-full">
        <span className="flex h-12 items-center text-sm font-medium">{children}</span>
        <span className="flex h-12 items-center text-sm font-medium text-neutral-600">{children}</span>
      </span>
    </button>
  );
}
