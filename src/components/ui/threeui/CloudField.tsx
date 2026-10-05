import React, { useEffect, useRef } from "react";

export interface CloudFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  density?: number;
}

export function CloudField({
  speed = 1,
  density = 1,
  className = "",
  style,
  ...props
}: CloudFieldProps) {
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

    const clouds = Array.from({ length: Math.round(20 * density) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 60 + Math.random() * 120,
      vx: (0.1 + Math.random() * 0.3) * speed,
    }));

    const render = () => {
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, width, height);

      clouds.forEach((c) => {
        c.x += c.vx;
        if (c.x - c.r > width) c.x = -c.r;

        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
        grad.addColorStop(0, "rgba(59, 130, 246, 0.12)");
        grad.addColorStop(0.5, "rgba(30, 58, 138, 0.06)");
        grad.addColorStop(1, "rgba(3, 7, 18, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed, density]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#030712] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
