import React from "react";

export interface EditorialIntroSectionProps extends React.HTMLAttributes<HTMLElement> {
  badge?: string;
  title?: string;
  description?: string;
}

export function EditorialIntroSection({
  badge = "Made for momentum",
  title = "Ideas, in motion.",
  description = "A focused interface keeps every action clear and every handoff moving.",
  className = "",
  style,
  ...props
}: EditorialIntroSectionProps) {
  return (
    <section
      className={`relative overflow-hidden w-full p-12 bg-neutral-950 text-white flex flex-col md:flex-row items-center justify-between gap-12 border border-white/10 rounded-2xl ${className}`}
      style={style}
      {...props}
    >
      <div className="flex-1 space-y-6 max-w-lg">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-cyan-300 border border-white/15">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          {badge}
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>

      <div className="relative w-72 h-72 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center p-6 shadow-2xl">
        <div className="w-full h-full rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-mono">
            ⌘
          </div>
          <span className="text-xs font-mono text-neutral-300 tracking-widest uppercase">
            ACTIVE RUNTIME
          </span>
        </div>
      </div>
    </section>
  );
}
