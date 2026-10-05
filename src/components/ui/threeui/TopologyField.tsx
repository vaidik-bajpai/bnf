import React, { useEffect, useRef } from "react";

export interface TopologyFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function TopologyField({
  speed = 1,
  className = "",
  style,
  ...props
}: TopologyFieldProps) {
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
      ctx.fillStyle = "#050608";
      ctx.fillRect(0, 0, width, height);

      t += 0.01 * speed;
      ctx.strokeStyle = "rgba(45, 212, 191, 0.3)";
      ctx.lineWidth = 1;

      const rows = 18;
      const cols = 28;
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const x = (c / (cols - 1)) * width;
          const baseY = (r / (rows - 1)) * height;
          const y = baseY + Math.sin(c * 0.4 + t + r * 0.3) * 16;
          if (c === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#050608] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
