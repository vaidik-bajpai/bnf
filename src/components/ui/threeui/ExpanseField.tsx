import React, { useEffect, useRef } from "react";

export interface ExpanseFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function ExpanseField({
  speed = 1,
  className = "",
  style,
  ...props
}: ExpanseFieldProps) {
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
      ctx.fillStyle = "#020308";
      ctx.fillRect(0, 0, width, height);

      t += 0.015 * speed;

      // Glowing horizon line
      const horizon = height * 0.55;
      const grad = ctx.createLinearGradient(0, horizon - 80, 0, horizon + 80);
      grad.addColorStop(0, "rgba(236, 72, 153, 0)");
      grad.addColorStop(0.5, "rgba(236, 72, 153, 0.45)");
      grad.addColorStop(1, "rgba(236, 72, 153, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, horizon - 80, width, 160);

      // Distant stars
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 137.5) % width);
        const sy = ((i * 93.1) % horizon);
        ctx.fillRect(sx, sy, 1.2, 1.2);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#020308] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
