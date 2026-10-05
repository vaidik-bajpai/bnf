import React, { useEffect, useRef } from "react";

export interface EmeraldHorizonBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function EmeraldHorizonBackground({
  speed = 1,
  className = "",
  style,
  ...props
}: EmeraldHorizonBackgroundProps) {
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
      ctx.fillStyle = "#020a06";
      ctx.fillRect(0, 0, width, height);

      t += 0.02 * speed;
      const horizon = height * 0.55;

      // Glow horizon
      const grad = ctx.createLinearGradient(0, horizon - 60, 0, horizon + 60);
      grad.addColorStop(0, "rgba(16, 185, 129, 0)");
      grad.addColorStop(0.5, "rgba(16, 185, 129, 0.45)");
      grad.addColorStop(1, "rgba(16, 185, 129, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, horizon - 60, width, 120);

      // Perspective grid lines
      ctx.strokeStyle = "rgba(52, 211, 153, 0.35)";
      ctx.lineWidth = 1;
      const cx = width / 2;
      for (let x = -width; x < width * 2; x += 45) {
        ctx.beginPath();
        ctx.moveTo(cx, horizon);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#020a06] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
