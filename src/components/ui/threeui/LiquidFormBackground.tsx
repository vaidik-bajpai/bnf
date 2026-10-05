import React, { useEffect, useRef } from "react";

export interface LiquidFormBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  color?: string;
}

export function LiquidFormBackground({
  speed = 1,
  color = "rgba(56, 189, 248, 0.25)",
  className = "",
  style,
  ...props
}: LiquidFormBackgroundProps) {
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
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, width, height);

      t += 0.02 * speed;
      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < 3; i++) {
        const x = cx + Math.sin(t + i * 2) * 80;
        const y = cy + Math.cos(t * 0.8 + i) * 60;
        const r = 120 + Math.sin(t * 1.2 + i) * 20;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, color);
        grad.addColorStop(1, "rgba(3, 7, 18, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed, color]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#030712] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
