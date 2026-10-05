import React, { useEffect, useRef } from "react";

export interface VoidFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function VoidField({
  speed = 1,
  className = "",
  style,
  ...props
}: VoidFieldProps) {
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
      ctx.fillStyle = "#010103";
      ctx.fillRect(0, 0, width, height);

      t += 0.02 * speed;
      const cx = width / 2;
      const cy = height / 2;

      for (let r = 20; r < Math.min(width, height) * 0.45; r += 18) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, t + r * 0.02, t + r * 0.02 + Math.PI * 1.4);
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 + (1 - r / (width * 0.5)) * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Center singularity
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(167, 139, 250, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#010103] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
