import React, { useState, type FormEvent } from "react";

export interface NewsletterFooterSectionProps extends React.HTMLAttributes<HTMLElement> {
  headline?: string;
}

export function NewsletterFooterSection({
  headline = "A monthly edit of thoughtful interfaces, practical patterns, and new experiments.",
  className = "",
  style,
  ...props
}: NewsletterFooterSectionProps) {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <footer
      className={`w-full p-12 bg-neutral-950 text-white border-t border-white/10 flex flex-col gap-12 ${className}`}
      style={style}
      {...props}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="max-w-md space-y-3">
          <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-xs text-neutral-400">
            01 // DISPATCH
          </span>
          <p className="text-sm text-neutral-300 leading-relaxed font-sans">{headline}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
          <input
            type="email"
            placeholder="Email for monthly notes"
            required
            className="flex-1 px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 text-xs font-sans text-white focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
          >
            {subscribed ? "Subscribed" : "Join List"}
          </button>
        </form>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center text-xs font-mono text-neutral-500 pt-8 border-t border-white/5 gap-4">
        <span>STAY CURIOUS // THREEUI</span>
        <span>© 2026. BUILT FOR THOUGHTFUL WORK.</span>
      </div>
    </footer>
  );
}
