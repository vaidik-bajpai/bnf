import React, { useEffect, useRef } from "react";

export interface RibbonFieldBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function RibbonFieldBackground({
  speed = 1,
  className = "",
  style,
  ...props
}: RibbonFieldBackgroundProps) {
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
      ctx.fillStyle = "#03060a";
      ctx.fillRect(0, 0, width, height);

      t += 0.02 * speed;

      for (let r = 0; r < 4; r++) {
        ctx.beginPath();
        const baseOffset = height * (0.35 + r * 0.1);
        ctx.strokeStyle = r % 2 === 0 ? "rgba(56, 189, 248, 0.4)" : "rgba(168, 85, 247, 0.35)";
        ctx.lineWidth = 2.5;

        for (let x = 0; x < width; x += 10) {
          const y = baseOffset + Math.sin(x * 0.006 + t + r) * 45 + Math.cos(x * 0.002 - t) * 20;
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
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#03060a] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
