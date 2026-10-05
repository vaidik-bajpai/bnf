import React, { useEffect, useRef } from "react";

export interface PredictiveArcCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function PredictiveArcCanvas({
  speed = 1,
  className = "",
  style,
  ...props
}: PredictiveArcCanvasProps) {
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
      ctx.fillStyle = "#060810";
      ctx.fillRect(0, 0, width, height);

      t += 0.02 * speed;
      ctx.lineWidth = 2;

      for (let i = 0; i < 5; i++) {
        const startX = width * 0.15;
        const startY = height * 0.8;
        const endX = width * 0.85;
        const endY = height * 0.3 + i * 40;
        const ctrlX = width * 0.5 + Math.sin(t + i) * 60;
        const ctrlY = height * 0.1 + Math.cos(t + i) * 40;

        ctx.strokeStyle = i % 2 === 0 ? "rgba(56, 189, 248, 0.6)" : "rgba(168, 85, 247, 0.5)";
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#060810] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
