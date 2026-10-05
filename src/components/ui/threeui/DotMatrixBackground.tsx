import React, { useEffect, useRef } from "react";

export interface DotMatrixBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  gridScale?: number;
  color?: string;
}

export function DotMatrixBackground({
  speed = 1,
  gridScale = 24,
  color = "#22d3ee",
  className = "",
  style,
  ...props
}: DotMatrixBackgroundProps) {
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
      ctx.fillStyle = "#05080c";
      ctx.fillRect(0, 0, width, height);

      t += 0.02 * speed;
      ctx.fillStyle = color;

      for (let x = gridScale; x < width; x += gridScale) {
        for (let y = gridScale; y < height; y += gridScale) {
          const pulse = Math.sin(t + x * 0.02 + y * 0.02) * 0.5 + 0.5;
          const r = 0.8 + pulse * 1.8;

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed, gridScale, color]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#05080c] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
