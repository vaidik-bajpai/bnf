import React, { useEffect, useRef } from "react";

export interface TempleNightSceneProps extends React.HTMLAttributes<HTMLDivElement> {
  fireflyCount?: number;
}

export function TempleNightScene({
  fireflyCount = 40,
  className = "",
  style,
  ...props
}: TempleNightSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const fireflies = Array.from({ length: fireflyCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.fillStyle = "#080b12";
      ctx.fillRect(0, 0, width, height);

      // Temple silhouette
      const cx = width / 2;
      const baseY = height * 0.9;
      ctx.fillStyle = "#030408";

      // Steps
      ctx.fillRect(cx - 160, baseY, 320, 20);
      ctx.fillRect(cx - 130, baseY - 15, 260, 15);

      // Torii / Temple Gate pillars
      ctx.fillRect(cx - 90, baseY - 140, 16, 125);
      ctx.fillRect(cx + 74, baseY - 140, 16, 125);

      // Crossbeams
      ctx.fillRect(cx - 130, baseY - 145, 260, 14);
      ctx.fillRect(cx - 110, baseY - 120, 220, 10);

      // Glowing Lanterns
      ctx.fillStyle = "#f59e0b";
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 18;
      ctx.fillRect(cx - 92, baseY - 100, 20, 24);
      ctx.fillRect(cx + 72, baseY - 100, 20, 24);
      ctx.shadowBlur = 0;

      // Fireflies
      for (const f of fireflies) {
        f.x += f.vx;
        f.y += f.vy;
        f.phase += 0.05;

        if (f.x < 0) f.x = width;
        if (f.x > width) f.x = 0;
        if (f.y < 0) f.y = height;
        if (f.y > height) f.y = 0;

        const glow = (Math.sin(f.phase) + 1) / 2;
        ctx.fillStyle = `rgba(250, 204, 21, ${glow})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 2 + glow * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [fireflyCount]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[380px] bg-[#080b12] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
