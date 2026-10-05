import React, { useEffect, useRef } from "react";

export interface CondensationBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  dropCount?: number;
}

export function CondensationBackground({
  speed = 1,
  dropCount = 80,
  className = "",
  style,
  ...props
}: CondensationBackgroundProps) {
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

    const drops = Array.from({ length: dropCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 2 + Math.random() * 4,
      vy: (0.2 + Math.random() * 0.8) * speed,
    }));

    const render = () => {
      ctx.fillStyle = "#050914";
      ctx.fillRect(0, 0, width, height);

      drops.forEach((d) => {
        d.y += d.vy;
        if (d.y > height) {
          d.y = 0;
          d.x = Math.random() * width;
        }

        const grad = ctx.createRadialGradient(d.x - 1, d.y - 1, 0.5, d.x, d.y, d.r);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        grad.addColorStop(0.6, "rgba(147, 197, 253, 0.4)");
        grad.addColorStop(1, "rgba(30, 58, 138, 0.1)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed, dropCount]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#050914] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
