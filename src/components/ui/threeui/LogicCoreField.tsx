import React, { useEffect, useRef } from "react";

export interface LogicCoreFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function LogicCoreField({
  speed = 1,
  className = "",
  style,
  ...props
}: LogicCoreFieldProps) {
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

    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.floor(Math.random() * (width / 40)) * 40,
      y: Math.floor(Math.random() * (height / 40)) * 40,
      active: Math.random() > 0.5,
    }));

    let t = 0;
    const render = () => {
      ctx.fillStyle = "rgba(4, 6, 12, 0.2)";
      ctx.fillRect(0, 0, width, height);

      t += 0.03 * speed;
      ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
      ctx.lineWidth = 1.5;

      nodes.forEach((n, idx) => {
        if (idx > 0) {
          const prev = nodes[idx - 1];
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(n.x, prev.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }

        ctx.fillStyle = (Math.sin(t + idx) > 0.5) ? "#22d3ee" : "#0e7490";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#020408] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
