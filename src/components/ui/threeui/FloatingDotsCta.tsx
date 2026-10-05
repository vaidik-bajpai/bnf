import React from "react";

export interface FloatingDotsCtaProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  buttonLabel?: string;
  onAction?: () => void;
}

export function FloatingDotsCta({
  title = "Ready to elevate your experience?",
  description = "Connect seamlessly to the next-generation spatial computing interface.",
  buttonLabel = "Get started today",
  onAction,
  className = "",
  style,
  ...props
}: FloatingDotsCtaProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-8 sm:p-12 text-center border border-white/10 ${className}`}
      style={{
        background: "linear-gradient(180deg, rgba(20,20,25,0.7) 0%, rgba(10,10,12,0.95) 100%)",
        boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
        fontFamily: "inherit",
        ...style,
      }}
      {...props}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-60" />
      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-3">
          {title}
        </h3>
        <p className="text-sm text-neutral-400 mb-8 max-w-md">
          {description}
        </p>
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition-all duration-200 hover:bg-neutral-200 active:scale-95"
        >
          <span>{buttonLabel}</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
