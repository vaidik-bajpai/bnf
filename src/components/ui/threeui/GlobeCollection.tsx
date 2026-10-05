import React, { useEffect, useRef } from "react";

export interface GlobeCollectionProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function GlobeCollection({
  speed = 1,
  className = "",
  style,
  ...props
}: GlobeCollectionProps) {
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

    const render = () => {
      ctx.fillStyle = "#05030e";
      ctx.fillRect(0, 0, width, height);

      t += 0.015 * speed;
      const cx = width / 2;
      const cy = height / 2;
      const r = Math.min(width, height) * 0.35;

      // Latitude lines
      for (let lat = -60; lat <= 60; lat += 20) {
        const radLat = (lat * Math.PI) / 180;
        const latY = cy + Math.sin(radLat) * r;
        const latR = Math.cos(radLat) * r;

        ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, latY, latR, latR * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude lines
      for (let lon = 0; lon < 180; lon += 30) {
        const radLon = ((lon + t * 40) * Math.PI) / 180;
        const lonW = Math.cos(radLon) * r;

        ctx.strokeStyle = "rgba(147, 51, 234, 0.4)";
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(lonW), r, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Glowing core
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.2);
      grad.addColorStop(0, "rgba(216, 180, 254, 0.3)");
      grad.addColorStop(0.7, "rgba(147, 51, 234, 0.1)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.2, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[360px] bg-[#05030e] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
