import React, { useEffect, useRef } from "react";

export interface HalftoneFlowProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  dotSize?: number;
}

export function HalftoneFlow({
  speed = 1,
  dotSize = 12,
  className = "",
  style,
  ...props
}: HalftoneFlowProps) {
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
      ctx.fillStyle = "#0c0a09";
      ctx.fillRect(0, 0, width, height);

      t += 0.02 * speed;
      ctx.fillStyle = "#f59e0b";

      for (let x = dotSize; x < width; x += dotSize * 2) {
        for (let y = dotSize; y < height; y += dotSize * 2) {
          const dist = Math.sin(x * 0.01 + t) + Math.cos(y * 0.01 + t);
          const r = Math.max(0.5, (dist + 2) * 1.6);

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed, dotSize]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#0c0a09] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
