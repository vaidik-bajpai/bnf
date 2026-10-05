import React, { useEffect, useRef } from "react";

export type LiquidMetalButtonVariant = "pill" | "circle" | "play";

export interface LiquidMetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LiquidMetalButtonVariant;
  text?: string;
}

export function LiquidMetalButton({
  variant = "pill",
  text = "START ENGINE",
  className = "",
  style,
  ...props
}: LiquidMetalButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 220);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 64);
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.04;

      // Draw metallic dispersion flow
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, `hsl(${(t * 30) % 360}, 80%, 65%)`);
      grad.addColorStop(0.5, `hsl(${(t * 30 + 120) % 360}, 90%, 75%)`);
      grad.addColorStop(1, `hsl(${(t * 30 + 240) % 360}, 85%, 60%)`);

      ctx.save();
      const r = variant === "circle" ? height / 2 : 16;
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, r);
      ctx.clip();

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Inner metallic ripples
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.beginPath();
      ctx.ellipse(width / 2 + Math.sin(t) * 20, height / 2, width * 0.4, height * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [variant]);

  return (
    <button
      className={`relative overflow-hidden inline-flex items-center justify-center font-bold tracking-wider text-black select-none shadow-xl hover:scale-105 active:scale-95 transition-transform ${
        variant === "circle" ? "w-16 h-16 rounded-full" : "px-8 py-4 rounded-2xl"
      } ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />
      <span className="relative z-10 drop-shadow-sm text-sm font-mono">{text}</span>
    </button>
  );
}
