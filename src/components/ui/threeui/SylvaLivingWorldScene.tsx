import React, { useEffect, useRef } from "react";

export interface SylvaLivingWorldSceneProps extends React.HTMLAttributes<HTMLDivElement> {
  sporeCount?: number;
}

export function SylvaLivingWorldScene({
  sporeCount = 60,
  className = "",
  style,
  ...props
}: SylvaLivingWorldSceneProps) {
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

    const spores = Array.from({ length: sporeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vy: -(0.5 + Math.random() * 1.2),
      vx: (Math.random() - 0.5) * 0.8,
      size: 1.5 + Math.random() * 3,
    }));

    const render = () => {
      // Emerald twilight forest
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#03140d");
      grad.addColorStop(1, "#072418");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Floating bioluminescent spores
      for (const s of spores) {
        s.y += s.vy;
        s.x += s.vx;
        if (s.y < 0) s.y = height;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;

        ctx.fillStyle = "#34d399";
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [sporeCount]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[360px] bg-[#03140d] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
