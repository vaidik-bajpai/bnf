import React, { useEffect, useRef } from "react";

export interface OrbitalSphereBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function OrbitalSphereBackground({
  speed = 1,
  className = "",
  style,
  ...props
}: OrbitalSphereBackgroundProps) {
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
      ctx.fillStyle = "#05070e";
      ctx.fillRect(0, 0, width, height);

      angle += 0.02 * speed;
      const cx = width / 2;
      const cy = height / 2;

      // Central core
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
      coreGrad.addColorStop(0, "rgba(59, 130, 246, 0.9)");
      coreGrad.addColorStop(1, "rgba(30, 58, 138, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 50, 0, Math.PI * 2);
      ctx.fill();

      // Orbits
      [70, 110, 150].forEach((r, i) => {
        ctx.strokeStyle = "rgba(147, 197, 253, 0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.45, angle * (i % 2 === 0 ? 1 : -1), 0, Math.PI * 2);
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#05070e] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
