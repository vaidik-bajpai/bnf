import React, { useEffect, useRef } from "react";

export interface FluidFieldBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function FluidFieldBackground({
  speed = 1,
  className = "",
  style,
  ...props
}: FluidFieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);
    let t = 0;

    const render = () => {
      ctx.fillStyle = "#07080d";
      ctx.fillRect(0, 0, width, height);

      t += 0.015 * speed;

      for (let i = 0; i < 4; i++) {
        const cx = width * (0.3 + i * 0.15) + Math.sin(t + i) * 60;
        const cy = height * 0.5 + Math.cos(t * 0.8 + i) * 70;
        const r = 120 + Math.sin(t + i) * 30;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const col = i % 2 === 0 ? "rgba(14, 165, 233, 0.22)" : "rgba(99, 102, 241, 0.2)";
        grad.addColorStop(0, col);
        grad.addColorStop(1, "rgba(7, 8, 13, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#07080d] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
