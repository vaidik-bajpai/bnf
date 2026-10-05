import React, { useEffect, useRef } from "react";

export interface StructureFlowCollectionProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function StructureFlowCollection({
  speed = 1,
  className = "",
  style,
  ...props
}: StructureFlowCollectionProps) {
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
      ctx.fillStyle = "#080b11";
      ctx.fillRect(0, 0, width, height);

      t += 0.02 * speed;
      ctx.strokeStyle = "rgba(147, 197, 253, 0.25)";
      ctx.lineWidth = 1;

      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        const y = (i / 20) * height;
        for (let x = 0; x < width; x += 15) {
          const dy = Math.sin(x * 0.005 + t + i * 0.15) * 35;
          if (x === 0) ctx.moveTo(x, y + dy);
          else ctx.lineTo(x, y + dy);
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
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#080b11] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
