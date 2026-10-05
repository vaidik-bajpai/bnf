import React, { useEffect, useRef } from "react";

export interface GenerativeTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  depth?: number;
  windSpeed?: number;
}

export function GenerativeTree({
  depth = 8,
  windSpeed = 1,
  className = "",
  style,
  ...props
}: GenerativeTreeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);
    let t = 0;

    const drawBranch = (
      x: number,
      y: number,
      len: number,
      angle: number,
      currentDepth: number
    ) => {
      if (currentDepth <= 0) return;

      const x2 = x + Math.cos(angle) * len;
      const y2 = y + Math.sin(angle) * len;

      ctx.strokeStyle = currentDepth < 3 ? "#4ade80" : "#78523c";
      ctx.lineWidth = Math.max(1, currentDepth * 1.5);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const wind = Math.sin(t + currentDepth * 0.4) * 0.08 * windSpeed;
      drawBranch(x2, y2, len * 0.74, angle - 0.42 + wind, currentDepth - 1);
      drawBranch(x2, y2, len * 0.74, angle + 0.38 + wind, currentDepth - 1);
    };

    const render = () => {
      ctx.fillStyle = "#06090a";
      ctx.fillRect(0, 0, width, height);

      t += 0.03;
      drawBranch(width / 2, height - 20, height * 0.24, -Math.PI / 2, depth);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [depth, windSpeed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[380px] bg-[#06090a] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
