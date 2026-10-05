import React, { useEffect, useRef } from "react";

export interface DefenseLinesProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function DefenseLines({
  speed = 1,
  className = "",
  style,
  ...props
}: DefenseLinesProps) {
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
    let angle = 0;

    const render = () => {
      ctx.fillStyle = "rgba(8, 12, 10, 0.15)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(width, height) * 0.45;

      // Concentric circles
      ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
      ctx.lineWidth = 1;
      for (let r = 40; r <= maxR; r += 45) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Radar sweep
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const sweep = ctx.createLinearGradient(0, 0, maxR, 0);
      sweep.addColorStop(0, "rgba(16, 185, 129, 0)");
      sweep.addColorStop(1, "rgba(16, 185, 129, 0.6)");
      ctx.strokeStyle = sweep;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(maxR, 0);
      ctx.stroke();
      ctx.restore();

      angle += 0.02 * speed;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#050906] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
