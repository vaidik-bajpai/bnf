import React, { useEffect, useRef } from "react";

export interface GatewayFlowProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function GatewayFlow({
  speed = 1,
  className = "",
  style,
  ...props
}: GatewayFlowProps) {
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

    const streaks = Array.from({ length: 80 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: Math.random() * 300,
      len: 20 + Math.random() * 60,
      speed: (2 + Math.random() * 4) * speed,
    }));

    const render = () => {
      ctx.fillStyle = "rgba(5, 5, 10, 0.2)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      ctx.strokeStyle = "rgba(147, 197, 253, 0.7)";
      ctx.lineWidth = 1.5;

      streaks.forEach((s) => {
        s.dist += s.speed;
        if (s.dist > Math.max(width, height)) {
          s.dist = 10;
          s.angle = Math.random() * Math.PI * 2;
        }

        const x1 = cx + Math.cos(s.angle) * s.dist;
        const y1 = cy + Math.sin(s.angle) * s.dist;
        const x2 = cx + Math.cos(s.angle) * (s.dist + s.len);
        const y2 = cy + Math.sin(s.angle) * (s.dist + s.len);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#020205] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
