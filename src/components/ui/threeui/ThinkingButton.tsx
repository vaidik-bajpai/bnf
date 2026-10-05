import React, { useEffect, useRef } from "react";

export interface ThinkingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  speed?: number;
}

export function ThinkingButton({
  children = "Thinking",
  speed = 1,
  className = "",
  style,
  ...props
}: ThinkingButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Track border
      ctx.beginPath();
      ctx.roundRect(4, 4, w - 8, h - 8, 16);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rotating glow comet
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(angle);
      const grad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
      grad.addColorStop(0, "rgba(59, 130, 246, 0)");
      grad.addColorStop(1, "rgba(96, 165, 250, 0.8)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(w, h) * 0.45, 0, Math.PI * 0.5);
      ctx.stroke();
      ctx.restore();

      angle += 0.04 * speed;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <button
      type="button"
      className={`relative inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-neutral-900 text-neutral-100 font-medium text-sm transition-all duration-200 hover:text-white active:scale-95 ${className}`}
      style={{
        boxShadow: "0 10px 25px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        fontFamily: "inherit",
        ...style,
      }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        width={180}
        height={56}
        className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl"
      />
      <span className="relative z-10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
        {children}...
      </span>
    </button>
  );
}
