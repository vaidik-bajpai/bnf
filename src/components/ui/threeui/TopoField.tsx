import React, { useEffect, useRef } from "react";

export interface TopoFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  lines?: number;
}

export function TopoField({
  speed = 1,
  lines = 24,
  className = "",
  style,
  ...props
}: TopoFieldProps) {
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
      ctx.fillStyle = "rgba(10, 10, 15, 0.15)";
      ctx.fillRect(0, 0, width, height);

      t += 0.01 * speed;
      ctx.strokeStyle = "rgba(147, 197, 253, 0.25)";
      ctx.lineWidth = 1.2;

      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        const baseOffset = (i / lines) * height;
        for (let x = 0; x < width; x += 10) {
          const y = baseOffset + Math.sin(x * 0.008 + t + i * 0.2) * 25 + Math.cos(x * 0.003 - t) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed, lines]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#08080c] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
