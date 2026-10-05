import React, { useEffect, useRef } from "react";

export interface EmberStormProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  count?: number;
}

export function EmberStorm({
  speed = 1,
  count = 200,
  className = "",
  style,
  ...props
}: EmberStormProps) {
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

    const embers = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vy: -(1 + Math.random() * 2.5) * speed,
      vx: (Math.random() - 0.5) * 0.8 * speed,
      size: 1 + Math.random() * 2.5,
      alpha: 0.3 + Math.random() * 0.7,
      color: Math.random() > 0.4 ? "#f97316" : "#eab308",
    }));

    const render = () => {
      ctx.fillStyle = "rgba(10, 6, 4, 0.2)";
      ctx.fillRect(0, 0, width, height);

      embers.forEach((e) => {
        e.y += e.vy;
        e.x += e.vx + Math.sin(e.y * 0.02) * 0.5;

        if (e.y < -10) {
          e.y = height + 10;
          e.x = Math.random() * width;
        }

        ctx.fillStyle = e.color;
        ctx.globalAlpha = e.alpha;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed, count]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#070302] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
