import React, { useEffect, useRef } from "react";

export interface LaserCollectionProps extends React.HTMLAttributes<HTMLDivElement> {
  beamCount?: number;
  speed?: number;
}

export function LaserCollection({
  beamCount = 8,
  speed = 1,
  className = "",
  style,
  ...props
}: LaserCollectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);
    let t = 0;

    const render = () => {
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, width, height);

      t += 0.03 * speed;
      const originX = width / 2;
      const originY = height * 0.1;

      for (let i = 0; i < beamCount; i++) {
        const sweep = Math.sin(t + (i / beamCount) * Math.PI) * (width * 0.45);
        const targetX = originX + sweep;
        const targetY = height;

        ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 14;

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();

        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [beamCount, speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[360px] bg-[#050508] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
