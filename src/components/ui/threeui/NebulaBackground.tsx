import React, { useEffect, useRef } from "react";

export interface NebulaBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function NebulaBackground({
  speed = 1,
  className = "",
  style,
  ...props
}: NebulaBackgroundProps) {
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
      ctx.fillStyle = "#030206";
      ctx.fillRect(0, 0, width, height);

      t += 0.008 * speed;

      // Color clouds
      const cx1 = width * 0.35 + Math.sin(t) * 50;
      const cy1 = height * 0.45 + Math.cos(t) * 40;
      const g1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, width * 0.4);
      g1.addColorStop(0, "rgba(168, 85, 247, 0.25)");
      g1.addColorStop(1, "rgba(3, 2, 6, 0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const cx2 = width * 0.65 + Math.cos(t * 0.8) * 40;
      const cy2 = height * 0.55 + Math.sin(t * 0.8) * 50;
      const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, width * 0.45);
      g2.addColorStop(0, "rgba(236, 72, 153, 0.2)");
      g2.addColorStop(1, "rgba(3, 2, 6, 0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#030206] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
