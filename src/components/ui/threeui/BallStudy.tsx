import React, { useEffect, useRef } from "react";

export interface BallStudyProps extends React.HTMLAttributes<HTMLDivElement> {
  pointCount?: number;
  speed?: number;
}

export function BallStudy({
  pointCount = 180,
  speed = 1,
  className = "",
  style,
  ...props
}: BallStudyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const chars = "XYZ0123456789αβγδε";
    const points = Array.from({ length: pointCount }, (_, i) => {
      const phi = Math.acos(-1 + (2 * i) / pointCount);
      const theta = Math.sqrt(pointCount * Math.PI) * phi;
      return {
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
        char: chars[i % chars.length],
      };
    });

    let angleY = 0;
    let angleX = 0.3;

    const render = () => {
      ctx.fillStyle = "#08090a";
      ctx.fillRect(0, 0, width, height);

      angleY += 0.015 * speed;
      const R = Math.min(width, height) * 0.35;
      const cx = width / 2;
      const cy = height / 2;

      const projected = points.map((p) => {
        // Rotate around Y
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;

        // Rotate around X
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        return {
          px: cx + x1 * R,
          py: cy + y2 * R,
          depth: z2,
          char: p.char,
        };
      });

      projected.sort((a, b) => a.depth - b.depth);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const p of projected) {
        const norm = (p.depth + 1) / 2;
        const scale = 0.5 + norm * 0.9;
        const fs = Math.round(14 * scale);
        const alpha = 0.2 + norm * 0.8;

        ctx.font = `bold ${fs}px monospace`;
        ctx.fillStyle = `rgba(240, 245, 250, ${alpha})`;
        ctx.fillText(p.char, p.px, p.py);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [pointCount, speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[350px] bg-[#08090a] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
