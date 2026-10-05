import React, { useEffect, useRef } from "react";

export interface DimensionalFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function DimensionalField({
  speed = 1,
  className = "",
  style,
  ...props
}: DimensionalFieldProps) {
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
    let offset = 0;

    const render = () => {
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, width, height);

      offset = (offset + 1 * speed) % 40;
      ctx.strokeStyle = "rgba(99, 102, 241, 0.18)";
      ctx.lineWidth = 1;

      // Vertical perspective lines
      const cx = width / 2;
      const cy = height * 0.4;
      for (let x = -width; x < width * 2; x += 50) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = cy; y < height; y += 15 + ((y - cy) * 0.08)) {
        const lineY = y + (offset * ((y - cy) / height));
        if (lineY < height) {
          ctx.beginPath();
          ctx.moveTo(0, lineY);
          ctx.lineTo(width, lineY);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#050508] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
