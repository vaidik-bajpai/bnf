import React, { useEffect, useRef } from "react";

export interface SparkBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  speed?: number;
}

export function SparkBadge({
  label = "PRO VERIFIED",
  speed = 1,
  className = "",
  style,
  ...props
}: SparkBadgeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * 160,
      y: Math.random() * 40,
      vy: 0.5 + Math.random() * 1.5,
      size: 0.5 + Math.random() * 1.5,
      alpha: Math.random(),
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 215, 0, 0.7)";

      particles.forEach((p) => {
        p.y += p.vy * speed;
        if (p.y > canvas.height) {
          p.y = 0;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 border border-amber-500/30 overflow-hidden ${className}`}
      style={{
        background: "rgba(20, 16, 5, 0.8)",
        boxShadow: "0 0 15px rgba(245, 158, 11, 0.2)",
        fontFamily: "inherit",
        ...style,
      }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        width={160}
        height={36}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <span className="relative z-10 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      <span className="relative z-10 text-xs font-semibold tracking-wider text-amber-200">
        {label}
      </span>
    </div>
  );
}
