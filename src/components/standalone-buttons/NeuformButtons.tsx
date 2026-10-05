import React, { useState, type ButtonHTMLAttributes, type ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/* 1. LaunchButton                                                            */
/* -------------------------------------------------------------------------- */

export interface LaunchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const LaunchButton: React.FC<LaunchButtonProps> = ({
  label = "Initialize Launch",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`group/btn relative inline-flex items-center justify-center cursor-pointer border-0 bg-transparent p-0 ${className}`}
      type="button"
      {...props}
    >
      <div className="-inset-1 group-hover/btn:opacity-75 transition duration-500 bg-amber-500/40 opacity-40 rounded-xl absolute blur pointer-events-none" />
      <div className="relative bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 text-amber-950 rounded-xl px-8 py-4 flex items-center gap-3 shadow-[0_0_0_1px_rgba(251,191,36,0.5),0_4px_0_#b45309,0_10px_15px_-3px_rgba(0,0,0,0.5)] active:translate-y-[2px] active:shadow-[0_0_0_1px_rgba(251,191,36,0.5),0_2px_0_#b45309] transition-all duration-150 font-sans">
        <span className="text-lg font-medium tracking-tight">{children || label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 fill-amber-950/20 stroke-[1.5]"
        >
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
        </svg>
      </div>
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. DotBorderButton                                                         */
/* -------------------------------------------------------------------------- */

const DOT_BORDER_STYLES = `
.dot-border-btn-wrapper {
  --dot-size: 8px;
  --line-weight: 1px;
  --line-distance: 0.8rem 1rem;
  --animation-speed: 0.35s;
  --dot-color: #fffa;
  --line-color: #fffa;
  --grid-color: #fff3;
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.dot-border-btn-wrapper::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  pointer-events: none;
  background-color: transparent;
  background-image: repeating-linear-gradient(45deg, var(--grid-color) 0 1px, transparent 2px 5px);
  opacity: 0;
  z-index: -1;
}

.dot-border-btn-wrapper:hover::after,
.dot-border-btn-wrapper:has(.dot-border-btn:hover)::after {
  animation: dot-border-opacity-anim calc(var(--animation-speed) * 4) ease-in-out forwards;
}

@keyframes dot-border-opacity-anim {
  80% { opacity: 0; }
  100% { opacity: 1; }
}

.dot-border-btn-wrapper .dot-border-btn {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.8rem 1.25rem;
  background-color: transparent;
  border: 1px solid var(--grid-color);
  color: #fffd;
  font-family: "Inter", sans-serif;
  letter-spacing: -0.01em;
  font-size: 1rem;
  font-weight: 600;
  text-transform: capitalize;
  border-radius: 6px;
  cursor: pointer;
  transition: transform .2s ease-in-out, letter-spacing .2s ease-in-out, background-color .2s ease-in-out;
}

.dot-border-btn-wrapper:hover .dot-border-btn,
.dot-border-btn-wrapper .dot-border-btn:hover {
  background-color: #25358b;
  color: #fff;
  transform: scale(1.05);
  letter-spacing: .06em;
}

.dot-border-btn-wrapper .dot-border-btn:active {
  background-color: #25358b;
  transform: scale(.98);
  letter-spacing: .02em;
}

.dot-border-btn-wrapper .btn-svg {
  margin-left: .5rem;
  height: 24px;
  stroke-width: 1;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: #fff4;
  fill: #fff2;
  transition: all .2s ease-in-out;
}

.dot-border-btn-wrapper:hover .btn-svg,
.dot-border-btn-wrapper .dot-border-btn:hover .btn-svg {
  stroke: #fffa;
  fill: #fff3;
}

.dot-border-btn-wrapper .dot {
  position: absolute;
  width: var(--dot-size);
  aspect-ratio: 1;
  border-radius: 2px;
  background-color: var(--dot-color);
  transition: all .3s ease-in-out;
  opacity: 0;
  pointer-events: none;
}

.dot-border-btn-wrapper:hover .dot.top.left {
  top: 50%;
  left: 20%;
  animation: dot-border-move-tl var(--animation-speed) ease-in-out forwards;
}

@keyframes dot-border-move-tl {
  90% { opacity: .6; }
  100% { top: calc(var(--dot-size) * -0.5); left: calc(var(--dot-size) * -0.5); opacity: 1; }
}

.dot-border-btn-wrapper:hover .dot.top.right {
  top: 50%;
  right: 20%;
  animation: dot-border-move-tr var(--animation-speed) ease-in-out forwards;
  animation-delay: calc(var(--animation-speed) * .6);
}

@keyframes dot-border-move-tr {
  80% { opacity: .6; }
  100% { top: calc(var(--dot-size) * -0.5); right: calc(var(--dot-size) * -0.5); opacity: 1; }
}

.dot-border-btn-wrapper:hover .dot.bottom.right {
  bottom: 50%;
  right: 20%;
  animation: dot-border-move-br var(--animation-speed) ease-in-out forwards;
  animation-delay: calc(var(--animation-speed) * 1.2);
}

@keyframes dot-border-move-br {
  80% { opacity: .6; }
  100% { bottom: calc(var(--dot-size) * -0.5); right: calc(var(--dot-size) * -0.5); opacity: 1; }
}

.dot-border-btn-wrapper:hover .dot.bottom.left {
  bottom: 50%;
  left: 20%;
  animation: dot-border-move-bl var(--animation-speed) ease-in-out forwards;
  animation-delay: calc(var(--animation-speed) * 1.8);
}

@keyframes dot-border-move-bl {
  80% { opacity: .6; }
  100% { bottom: calc(var(--dot-size) * -0.5); left: calc(var(--dot-size) * -0.5); opacity: 1; }
}

.dot-border-btn-wrapper .line {
  position: absolute;
  transition: all .3s ease-in-out;
  pointer-events: none;
}

.dot-border-btn-wrapper .line.horizontal {
  height: var(--line-weight);
  width: 100%;
  background-image: repeating-linear-gradient(90deg, #0000 0 calc(var(--line-weight)*2), var(--line-color) calc(var(--line-weight)*2) calc(var(--line-weight)*4));
}

.dot-border-btn-wrapper .line.top {
  top: calc(var(--line-weight) * -0.5);
  transform-origin: top left;
  transform: rotate(5deg) scaleX(0);
}

.dot-border-btn-wrapper:hover .line.top {
  animation: dot-border-draw-top var(--animation-speed) ease-in-out forwards;
  animation-delay: calc(var(--animation-speed) * .8);
}

@keyframes dot-border-draw-top {
  100% { transform: rotate(0deg) scaleX(1); }
}

.dot-border-btn-wrapper .line.bottom {
  bottom: calc(var(--line-weight) * -0.5);
  transform-origin: bottom right;
  transform: rotate(5deg) scaleX(0);
}

.dot-border-btn-wrapper:hover .line.bottom {
  animation: dot-border-draw-bottom var(--animation-speed) ease-in-out forwards;
  animation-delay: calc(var(--animation-speed) * 2);
}

@keyframes dot-border-draw-bottom {
  100% { transform: rotate(0deg) scaleX(1); }
}

.dot-border-btn-wrapper .line.vertical {
  width: var(--line-weight);
  height: 100%;
  background-image: repeating-linear-gradient(0deg, #0000 0 calc(var(--line-weight)*2), var(--line-color) calc(var(--line-weight)*2) calc(var(--line-weight)*4));
}

.dot-border-btn-wrapper .line.left {
  left: calc(var(--line-weight) * -0.5);
  transform-origin: bottom left;
  transform: rotate(0deg) scaleY(0);
}

.dot-border-btn-wrapper:hover .line.left {
  animation: dot-border-draw-left var(--animation-speed) ease-in-out forwards;
  animation-delay: calc(var(--animation-speed) * 2.4);
}

@keyframes dot-border-draw-left {
  100% { transform: rotate(0deg) scaleY(1); }
}

.dot-border-btn-wrapper .line.right {
  right: calc(var(--line-weight) * -0.5);
  transform-origin: top right;
  transform: rotate(5deg) scaleY(0);
}

.dot-border-btn-wrapper:hover .line.right {
  animation: dot-border-draw-right var(--animation-speed) ease-in-out forwards;
  animation-delay: calc(var(--animation-speed) * 1.4);
}

@keyframes dot-border-draw-right {
  100% { transform: rotate(0deg) scaleY(1); }
}
`;

export interface DotBorderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  dotColor?: string;
  lineColor?: string;
}

export const DotBorderButton: React.FC<DotBorderButtonProps> = ({
  label = "Start Creating",
  dotColor,
  lineColor,
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      className={`dot-border-btn-wrapper ${className}`}
      style={
        {
          ...(dotColor ? { "--dot-color": dotColor } : {}),
          ...(lineColor ? { "--line-color": lineColor } : {}),
        } as React.CSSProperties
      }
    >
      <style>{DOT_BORDER_STYLES}</style>
      <div className="line horizontal top" />
      <div className="line vertical right" />
      <div className="line horizontal bottom" />
      <div className="line vertical left" />

      <div className="dot top left" />
      <div className="dot top right" />
      <div className="dot bottom right" />
      <div className="dot bottom left" />

      <button className="dot-border-btn" type="button" {...props}>
        <span>{children || label}</span>
        <svg className="btn-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.6744 11.4075L15.7691 17.1233C15.7072 17.309 15.5586 17.4529 15.3709 17.5087L3.69348 20.9803C3.22819 21.1186 2.79978 20.676 2.95328 20.2155L6.74467 8.84131C6.79981 8.67588 6.92419 8.54263 7.08543 8.47624L12.472 6.25822C12.696 6.166 12.9535 6.21749 13.1248 6.38876L17.5294 10.7935C17.6901 10.9542 17.7463 11.1919 17.6744 11.4075Z" />
          <path d="M3.2959 20.6016L9.65986 14.2376" />
          <path d="M17.7917 11.0557L20.6202 8.22724C21.4012 7.44619 21.4012 6.17986 20.6202 5.39881L18.4989 3.27749C17.7178 2.49645 16.4515 2.49645 15.6704 3.27749L12.842 6.10592" />
          <path d="M11.7814 12.1163C11.1956 11.5305 10.2458 11.5305 9.66004 12.1163C9.07426 12.7021 9.07426 13.6519 9.66004 14.2376C10.2458 14.8234 11.1956 14.8234 11.7814 14.2376C12.3671 13.6519 12.3671 12.7021 11.7814 12.1163Z" />
        </svg>
      </button>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. FloatingDotsCta                                                         */
/* -------------------------------------------------------------------------- */

const FLOATING_DOTS_STYLES = `
.floating-dots-btn {
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.25s ease;
  background: radial-gradient(65.28% 65.28% at 50% 100%,
      rgba(34, 211, 238, 0.8) 0%,
      rgba(34, 211, 238, 0) 100%),
    linear-gradient(0deg, #2563eb, #2563eb);
  border-radius: 0.75rem;
  border: none;
  outline: none;
  padding: 12px 18px;
  min-height: 48px;
  min-width: 102px;
}

.floating-dots-btn::before,
.floating-dots-btn::after {
  content: "";
  position: absolute;
  transition: all 0.5s ease-in-out;
  z-index: 0;
}

.floating-dots-btn::before {
  inset: 1px;
  background: linear-gradient(177.95deg, rgba(255, 255, 255, 0.19) 0%, rgba(255, 255, 255, 0) 100%);
  border-radius: calc(0.75rem - 1px);
}

.floating-dots-btn::after {
  inset: 2px;
  background: radial-gradient(65.28% 65.28% at 50% 100%, rgba(34, 211, 238, 0.8) 0%, rgba(34, 211, 238, 0) 100%),
    linear-gradient(0deg, #2563eb, #2563eb);
  border-radius: calc(0.75rem - 2px);
}

.floating-dots-btn:active {
  transform: scale(0.95);
}

.floating-dots-points {
  overflow: hidden;
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: absolute;
  z-index: 1;
}

.floating-dots-points .point {
  bottom: -10px;
  position: absolute;
  animation: floating-points infinite ease-in-out;
  pointer-events: none;
  width: 2px;
  height: 2px;
  background-color: #fff;
  border-radius: 9999px;
}

@keyframes floating-points {
  0% { transform: translateY(0); }
  85% { opacity: 0; }
  100% { transform: translateY(-55px); opacity: 0; }
}

.floating-dots-points .point:nth-child(1) { left: 10%; opacity: 1; animation-duration: 2.35s; animation-delay: 0.2s; }
.floating-dots-points .point:nth-child(2) { left: 30%; opacity: 0.7; animation-duration: 2.5s; animation-delay: 0.5s; }
.floating-dots-points .point:nth-child(3) { left: 25%; opacity: 0.8; animation-duration: 2.2s; animation-delay: 0.1s; }
.floating-dots-points .point:nth-child(4) { left: 44%; opacity: 0.6; animation-duration: 2.05s; }
.floating-dots-points .point:nth-child(5) { left: 50%; opacity: 1; animation-duration: 1.9s; }
.floating-dots-points .point:nth-child(6) { left: 75%; opacity: 0.5; animation-duration: 1.5s; animation-delay: 1.5s; }
.floating-dots-points .point:nth-child(7) { left: 88%; opacity: 0.9; animation-duration: 2.2s; animation-delay: 0.2s; }
.floating-dots-points .point:nth-child(8) { left: 58%; opacity: 0.8; animation-duration: 2.25s; animation-delay: 0.2s; }
.floating-dots-points .point:nth-child(9) { left: 98%; opacity: 0.6; animation-duration: 2.6s; animation-delay: 0.1s; }
.floating-dots-points .point:nth-child(10) { left: 65%; opacity: 1; animation-duration: 2.5s; animation-delay: 0.2s; }

.floating-dots-inner {
  z-index: 2;
  gap: 6px;
  position: relative;
  width: 100%;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  transition: color 0.2s ease-in-out;
}

.floating-dots-inner svg.icon {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
  stroke: white;
  fill: none;
}

.floating-dots-btn:hover svg.icon {
  transform: translateX(2px);
}

.floating-dots-btn:hover svg.icon path {
  animation: floating-dots-dash 0.8s linear forwards;
}

@keyframes floating-dots-dash {
  0% { stroke-dasharray: 0, 20; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 10, 10; stroke-dashoffset: -5; }
  100% { stroke-dasharray: 20, 0; stroke-dashoffset: -10; }
}
`;

export interface FloatingDotsCtaProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const FloatingDotsCta: React.FC<FloatingDotsCtaProps> = ({
  label = "Sign Up",
  className = "",
  children,
  ...props
}) => {
  return (
    <button type="button" className={`floating-dots-btn ${className}`} {...props}>
      <style>{FLOATING_DOTS_STYLES}</style>
      <div className="floating-dots-points">
        {[...Array(10)].map((_, i) => (
          <i key={i} className="point" />
        ))}
      </div>
      <span className="floating-dots-inner font-sans">
        {children || label}
        <svg
          className="icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. SlidingTextCta                                                          */
/* -------------------------------------------------------------------------- */

export interface SlidingTextCtaProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const SlidingTextCta: React.FC<SlidingTextCtaProps> = ({
  label = "Download Mac app",
  className = "",
  children,
  ...props
}) => {
  const text = children || label;
  return (
    <button
      className={`group relative inline-flex min-w-[120px] cursor-pointer transition-all duration-[1000ms] ease-[cubic-bezier(0.15,0.83,0.66,1)] hover:-translate-y-[3px] hover:text-white shadow-[0_2.8px_2.2px_rgba(0,0,0,0.3),_0_6.7px_5.3px_rgba(0,0,0,0.35),_0_12.5px_10px_rgba(0,0,0,0.4)] overflow-hidden font-semibold text-neutral-400 tracking-tight bg-neutral-800 border-neutral-600 border rounded-full pt-[12px] pr-[20px] pb-[12px] pl-[20px] items-center justify-center font-sans ${className}`}
      type="button"
      {...props}
    >
      <span className="relative z-10 font-medium rounded-full transition-all duration-500 ease-out group-hover:transform group-hover:translate-y-8 group-hover:opacity-0 group-hover:blur-md">
        {text}
      </span>
      <span className="absolute inset-0 z-10 flex items-center justify-center transition-all duration-300 ease-in-out transform -translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 group-hover:blur-none font-medium opacity-0 rounded-full blur-md">
        {text}
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-[1px] w-[70%] -translate-x-1/2 transition-all duration-[1000ms] ease-[cubic-bezier(0.15,0.83,0.66,1)] group-hover:opacity-80 bg-gradient-to-r from-transparent via-neutral-200 to-transparent rounded-full blur-[2px]"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[100%] group-hover:opacity-60 transition-all duration-[1000ms] ease-[cubic-bezier(0.15,0.83,0.66,1)] pointer-events-none bg-gradient-to-t from-white/20 via-white/10 to-transparent rounded-full"
      />
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. GradientBeamCta                                                         */
/* -------------------------------------------------------------------------- */

const GRADIENT_BEAM_STYLES = `
@keyframes gradient-beam-spin { to { transform: rotate(360deg); } }
@keyframes gradient-beam-dots { 0% { background-position: 0 0; } 100% { background-position: 24px 24px; } }
`;

export interface GradientBeamCtaProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const GradientBeamCta: React.FC<GradientBeamCtaProps> = ({
  label = "Start Building",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`group flex overflow-hidden uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(234,88,12,0.5)] focus:outline-none text-sm font-medium text-white tracking-widest rounded-full pt-5 pr-12 pb-5 pl-12 relative items-center justify-center font-sans ${className}`}
      type="button"
      {...props}
    >
      <style>{GRADIENT_BEAM_STYLES}</style>
      <div className="absolute inset-0 -z-20 rounded-full overflow-hidden p-[1px]">
        <div
          className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#ea580c_360deg)]"
          style={{ animation: "gradient-beam-spin 3s linear infinite" }}
        />
        <div className="absolute inset-[1px] rounded-full bg-black" />
      </div>

      <div className="-z-10 overflow-hidden bg-zinc-950 rounded-full absolute top-[2px] right-[2px] bottom-[2px] left-[2px]">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/60 to-transparent" />
        <div
          className="opacity-30 mix-blend-overlay absolute top-0 right-0 bottom-0 left-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
            animation: "gradient-beam-dots 8s linear infinite",
          }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-orange-500/10 blur-2xl rounded-full pointer-events-none transition-colors duration-500 group-hover:bg-orange-500/30" />
      </div>

      <span className="relative z-10 text-white/90 transition-colors group-hover:text-white">
        {children || label}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-arrow-right relative z-10 ml-2 transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/* 6. GradientPillButton                                                      */
/* -------------------------------------------------------------------------- */

const GRADIENT_PILL_STYLES = `
.gradient-pill-border-mask::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: 9999px;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgba(0, 0, 0, 0.4), rgba(255, 255, 255, 0.8));
  pointer-events: none;
}
`;

export interface GradientPillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const GradientPillButton: React.FC<GradientPillButtonProps> = ({
  label = "Demo Lesson",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`gradient-pill-border-mask hover:bg-slate-50 hover:text-slate-900 transition-all flex text-sm font-medium text-slate-200 bg-gradient-to-b from-black/10 via-black/20 to-black/10 rounded-full pt-3 pr-6 pb-3 pl-6 gap-x-2 gap-y-2 items-center relative font-sans ${className}`}
      style={{
        boxShadow: "0 18px 35px rgba(31, 41, 55, 0.25), 0 0 0 1px rgba(209, 213, 219, 0.3)",
      }}
      type="button"
      {...props}
    >
      <style>{GRADIENT_PILL_STYLES}</style>
      <span className="text-sm font-medium tracking-tight text-white/90">
        {children || label}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-white/80"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/* 7. GenerateButton                                                          */
/* -------------------------------------------------------------------------- */

const GENERATE_BUTTON_STYLES = `
.generate-btn-wrapper {
  position: relative;
  display: inline-block;
}

.generate-btn {
  --border-radius: 24px;
  --padding: 4px;
  --transition: 0.4s;
  --button-color: #101010;
  --highlight-color-hue: 210deg;

  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--button-color);

  box-shadow:
    inset 0px 1px 1px rgba(255, 255, 255, 0.2),
    inset 0px 2px 2px rgba(255, 255, 255, 0.15),
    inset 0px 4px 4px rgba(255, 255, 255, 0.1),
    inset 0px 8px 8px rgba(255, 255, 255, 0.05),
    inset 0px 16px 16px rgba(255, 255, 255, 0.05),
    0px -1px 1px rgba(0, 0, 0, 0.02),
    0px -2px 2px rgba(0, 0, 0, 0.03),
    0px -4px 4px rgba(0, 0, 0, 0.05),
    0px -8px 8px rgba(0, 0, 0, 0.06),
    0px -16px 16px rgba(0, 0, 0, 0.08);

  border: solid 1px #ffffff22;
  border-radius: var(--border-radius);
  cursor: pointer;
  padding: 10px 20px;

  transition:
    box-shadow var(--transition),
    border var(--transition),
    background-color var(--transition);
}

.generate-btn::before {
  content: "";
  position: absolute;
  top: calc(0px - var(--padding));
  left: calc(0px - var(--padding));
  width: calc(100% + var(--padding) * 2);
  height: calc(100% + var(--padding) * 2);
  border-radius: calc(var(--border-radius) + var(--padding));
  pointer-events: none;
  background-image: linear-gradient(0deg, #0004, #000a);
  z-index: -1;
  transition: box-shadow var(--transition), filter var(--transition);
  box-shadow:
    0 -8px 8px -6px #0000 inset,
    0 -16px 16px -8px #00000000 inset,
    1px 1px 1px #fff2,
    2px 2px 2px #fff1,
    -1px -1px 1px #0002,
    -2px -2px 2px #0001;
}

.generate-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background-image: linear-gradient(0deg, #fff, hsl(var(--highlight-color-hue), 100%, 70%), hsla(var(--highlight-color-hue), 100%, 70%, 50%), 8%, transparent);
  background-position: 0 0;
  opacity: 0;
  transition: opacity var(--transition), filter var(--transition);
}

.generate-btn-letter {
  position: relative;
  display: inline-block;
  color: #ffffff55;
  animation: generate-letter-anim 2s ease-in-out infinite;
  transition: color var(--transition), text-shadow var(--transition), opacity var(--transition);
}

@keyframes generate-letter-anim {
  50% {
    text-shadow: 0 0 3px #ffffff88;
    color: #fff;
  }
}

.generate-btn-svg {
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
  fill: #e8e8e8;
  animation: generate-flicker 2s linear infinite;
  animation-delay: 0.5s;
  filter: drop-shadow(0 0 2px #ffffff99);
  transition: fill var(--transition), filter var(--transition), opacity var(--transition);
}

@keyframes generate-flicker {
  50% { opacity: 0.3; }
}

.generate-txt-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 6.4em;
  font-family: Poppins, sans-serif;
}

.generate-btn:hover {
  border: solid 1px hsla(var(--highlight-color-hue), 100%, 80%, 0.4);
}

.generate-btn:hover::before {
  box-shadow:
    0 -8px 8px -6px #fffa inset,
    0 -16px 16px -8px hsla(var(--highlight-color-hue), 100%, 70%, 0.3) inset,
    1px 1px 1px #fff2,
    2px 2px 2px #fff1,
    -1px -1px 1px #0002,
    -2px -2px 2px #0001;
}

.generate-btn:hover::after {
  opacity: 1;
  -webkit-mask-image: linear-gradient(0deg, #fff, transparent);
  mask-image: linear-gradient(0deg, #fff, transparent);
}

.generate-btn:hover .generate-btn-svg {
  fill: #fff;
  filter: drop-shadow(0 0 3px hsl(var(--highlight-color-hue), 100%, 70%)) drop-shadow(0 -4px 6px #0009);
  animation: none;
}
`;

export interface GenerateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  activeLabel?: string;
  highlightHue?: number;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  label = "Generate",
  activeLabel = "Generating",
  highlightHue = 210,
  className = "",
  onClick,
  ...props
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsActive((prev) => !prev);
    if (onClick) onClick(e);
  };

  const currentText = isActive ? activeLabel : label;

  return (
    <div className={`generate-btn-wrapper ${className}`}>
      <style>{GENERATE_BUTTON_STYLES}</style>
      <button
        className="generate-btn"
        type="button"
        style={{ "--highlight-color-hue": `${highlightHue}deg` } as React.CSSProperties}
        onClick={handleClick}
        {...props}
      >
        <svg
          className="generate-btn-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>

        <div className="generate-txt-wrapper">
          {currentText.split("").map((letter, i) => (
            <span
              key={i}
              className="generate-btn-letter"
              style={{ animationDelay: `${(i * 0.08).toFixed(2)}s` }}
            >
              {letter}
            </span>
          ))}
        </div>
      </button>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 8. GlassmorphismCta                                                        */
/* -------------------------------------------------------------------------- */

const GLASSMORPHISM_STYLES = `
@keyframes glass-border-rotate {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
`;

export interface GlassmorphismCtaProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  avatarSrc?: string;
}

export const GlassmorphismCta: React.FC<GlassmorphismCtaProps> = ({
  label = "Generate My Site",
  avatarSrc = "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/3f6038cb-af1c-4483-97bc-dd58d89c36ef_320w.jpg",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`group isolate inline-flex cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(129,140,248,0.35)] rounded-full relative shadow-[0_8px_40px_rgba(129,140,248,0.25)] border-0 p-0 bg-transparent ${className}`}
      type="button"
      {...props}
    >
      <style>{GLASSMORPHISM_STYLES}</style>
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div
          className="absolute inset-[-100%] w-[300%] h-[300%]"
          style={{
            background: "conic-gradient(from 225deg, transparent 0, rgba(255,255,255,0.6) 90deg, transparent 90deg)",
            animation: "glass-border-rotate 4s linear infinite",
            top: "50%",
            left: "50%",
          }}
        />
      </div>
      <div className="absolute rounded-full inset-[1px] bg-white/[0.05] backdrop-blur" />

      <div className="z-10 flex gap-3 overflow-hidden text-base font-medium text-white pt-3 pr-4 pb-3 pl-4 relative items-center rounded-full font-sans">
        <div
          style={{
            position: "absolute",
            width: "200%",
            height: "200%",
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
            animation: "glass-border-rotate 4s infinite linear",
            top: "50%",
            left: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "1px",
            background: "rgba(10, 11, 20, 0.8)",
            borderRadius: "9999px",
            backdropFilter: "blur(8px)",
          }}
        />
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt="Avatar"
            className="ring-2 ring-white/10 z-10 w-8 h-8 object-cover rounded-full relative"
          />
        ) : null}
        <span className="whitespace-nowrap relative z-10">{children || label}</span>
        <span className="inline-flex items-center justify-center z-10 bg-white/10 w-7 h-7 rounded-full ml-1 relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
            <path d="m14 7 3 3" />
            <path d="M5 6v4" />
            <path d="M19 14v4" />
            <path d="M10 2v2" />
            <path d="M7 8H3" />
            <path d="M21 16h-4" />
            <path d="M11 3H9" />
          </svg>
        </span>
      </div>
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/* 9. SpinningBorderButton                                                    */
/* -------------------------------------------------------------------------- */

export interface SpinningBorderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const SpinningBorderButton: React.FC<SpinningBorderButtonProps> = ({
  label = "Request Demo",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`group inline-flex overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] rounded-full p-[1px] relative items-center justify-center border-0 bg-transparent cursor-pointer ${className}`}
      type="button"
      {...props}
    >
      <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#ffffff_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="absolute inset-0 rounded-full bg-zinc-800 transition-opacity duration-300 group-hover:opacity-0" />
      <span className="flex items-center justify-center gap-2 uppercase transition-colors duration-300 group-hover:text-white text-xs font-medium text-zinc-400 tracking-widest bg-gradient-to-b from-zinc-800 to-zinc-950 w-full h-full rounded-full pt-2.5 pr-6 pb-2.5 pl-6 relative shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] font-sans">
        <span className="relative z-10">{children || label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/* 10. GradientCta                                                            */
/* -------------------------------------------------------------------------- */

export interface GradientCtaProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const GradientCta: React.FC<GradientCtaProps> = ({
  label = "Start Free Pilot",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      className={`group shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 overflow-hidden font-medium text-orange-950 bg-gradient-to-r from-[#FFEBB1] to-[#FFC438] rounded-full pt-4 pr-8 pb-4 pl-8 relative shadow-lg cursor-pointer border-0 font-sans ${className}`}
      style={{
        boxShadow: "0 15px 33px -12px rgba(255,162,42,0.9), inset 0 4px 6.3px rgba(252,220,134,1), inset 0 -5px 6.3px rgba(255,162,38,1)",
      }}
      type="button"
      {...props}
    >
      <div className="group-hover:translate-y-0 transition-transform duration-300 bg-white/20 absolute top-0 right-0 bottom-0 left-0 translate-y-full" />
      <span className="relative flex items-center gap-2">
        {children || label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
          <path d="m21.854 2.147-10.94 10.939" />
        </svg>
      </span>
    </button>
  );
};
