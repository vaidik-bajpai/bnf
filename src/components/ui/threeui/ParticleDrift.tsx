import React, { useEffect, useRef } from "react";

export interface ParticleDriftProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  count?: number;
  color?: string;
}

export function ParticleDrift({
  speed = 1,
  count = 150,
  color = "rgba(255, 255, 255, 0.4)",
  className = "",
  style,
  ...props
}: ParticleDriftProps) {
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

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4 * speed,
      vy: -(0.2 + Math.random() * 0.6) * speed,
      radius: 0.8 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.6,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed, count, color]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-neutral-950 ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
