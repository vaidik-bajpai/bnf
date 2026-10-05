import React, { useEffect, useRef } from "react";

export interface BellFieldBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function BellFieldBackground({
  speed = 1,
  className = "",
  style,
  ...props
}: BellFieldBackgroundProps) {
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
      ctx.fillStyle = "#08100f";
      ctx.fillRect(0, 0, width, height);

      t += 0.02 * speed;
      ctx.strokeStyle = "rgba(143, 203, 185, 0.35)";
      ctx.lineWidth = 1.2;

      for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        const baseOffset = (i / 15) * height;
        for (let x = 0; x < width; x += 10) {
          // Bell curve formula
          const normalizedX = (x - width / 2) / (width * 0.2);
          const bell = Math.exp(-0.5 * normalizedX * normalizedX);
          const y = baseOffset - bell * 80 * Math.sin(t + i * 0.4);
          if (x === 0) ctx.moveTo(x, y);
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
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#08100f] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
