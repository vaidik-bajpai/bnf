import React, { useEffect, useRef } from "react";

export interface WarpFieldBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  starCount?: number;
}

export function WarpFieldBackground({
  speed = 1,
  starCount = 400,
  className = "",
  style,
  ...props
}: WarpFieldBackgroundProps) {
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

    const stars = Array.from({ length: starCount }, () => ({
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      z: Math.random() * width,
    }));

    const render = () => {
      ctx.fillStyle = "rgba(4, 7, 10, 0.25)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = "#34d399";
      ctx.strokeStyle = "rgba(52, 211, 153, 0.4)";

      stars.forEach((s) => {
        s.z -= 4 * speed;
        if (s.z <= 0) {
          s.z = width;
          s.x = (Math.random() - 0.5) * width;
          s.y = (Math.random() - 0.5) * height;
        }

        const k = 250 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = Math.max(0.8, (1 - s.z / width) * 3);
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed, starCount]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#020508] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
