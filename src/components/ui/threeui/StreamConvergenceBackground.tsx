import React, { useEffect, useRef } from "react";

export interface StreamConvergenceBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function StreamConvergenceBackground({
  speed = 1,
  className = "",
  style,
  ...props
}: StreamConvergenceBackgroundProps) {
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
      ctx.fillStyle = "#07030d";
      ctx.fillRect(0, 0, width, height);

      t += 0.02 * speed;
      const cx = width * 0.7;
      const cy = height * 0.5;

      for (let i = 0; i < 18; i++) {
        ctx.beginPath();
        const startY = (i / 18) * height;
        ctx.moveTo(0, startY);
        ctx.bezierCurveTo(width * 0.35, startY, cx, cy + Math.sin(t + i) * 30, width, cy);

        ctx.strokeStyle = i % 2 === 0 ? "rgba(168, 85, 247, 0.45)" : "rgba(236, 72, 153, 0.4)";
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#07030d] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
