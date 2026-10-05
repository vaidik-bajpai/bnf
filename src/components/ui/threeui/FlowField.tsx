import React, { useEffect, useRef } from "react";

export interface FlowFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  particleCount?: number;
  color?: string;
  opacity?: number;
}

export function FlowField({
  speed = 1,
  particleCount = 600,
  color = "rgba(220, 160, 110, 0.6)",
  opacity = 1,
  className = "",
  style,
  ...props
}: FlowFieldProps) {
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

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      life: Math.random() * 100,
    }));

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    let time = 0;
    const render = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.08)";
      ctx.fillRect(0, 0, width, height);

      time += 0.005 * speed;
      ctx.fillStyle = color;

      particles.forEach((p) => {
        const angle = Math.sin(p.x * 0.005 + time) * Math.cos(p.y * 0.005 + time) * Math.PI * 2;
        p.vx = Math.cos(angle) * 1.5 * speed;
        p.vy = Math.sin(angle) * 1.5 * speed;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillRect(p.x, p.y, 1.5, 1.5);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [speed, particleCount, color]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#0a0a0a] ${className}`}
      style={{ opacity, ...style }}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
