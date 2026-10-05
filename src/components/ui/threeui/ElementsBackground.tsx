import React, { useEffect, useRef } from "react";

export type ElementVariant = "water" | "lightning" | "fire";

export interface ElementsBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ElementVariant;
  speed?: number;
}

export function ElementsBackground({
  variant = "fire",
  speed = 1,
  className = "",
  style,
  ...props
}: ElementsBackgroundProps) {
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

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vy: 1 + Math.random() * 3,
      size: 2 + Math.random() * 4,
    }));

    const render = () => {
      ctx.fillStyle = variant === "fire" ? "#100402" : variant === "water" ? "#020914" : "#0a0715";
      ctx.fillRect(0, 0, width, height);

      t += 0.03 * speed;

      for (const p of particles) {
        if (variant === "fire") {
          p.y -= p.vy * speed;
          p.x += Math.sin(p.y * 0.05 + t) * 1.5;
          if (p.y < 0) {
            p.y = height;
            p.x = Math.random() * width;
          }
          const alpha = p.y / height;
          ctx.fillStyle = `rgba(249, 115, 22, ${alpha})`;
        } else if (variant === "water") {
          p.y += p.vy * speed;
          if (p.y > height) {
            p.y = 0;
            p.x = Math.random() * width;
          }
          ctx.fillStyle = "rgba(56, 189, 248, 0.6)";
        } else {
          // Lightning
          p.x += (Math.random() - 0.5) * 6;
          p.y += (Math.random() - 0.5) * 6;
          ctx.fillStyle = "rgba(192, 132, 252, 0.8)";
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [variant, speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[350px] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
