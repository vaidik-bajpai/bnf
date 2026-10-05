import React, { useEffect, useRef } from "react";

export interface SemanticBloomProps extends React.HTMLAttributes<HTMLDivElement> {
  rootWord?: string;
  speed?: number;
}

export function SemanticBloom({
  rootWord = "CODEX",
  speed = 1,
  className = "",
  style,
  ...props
}: SemanticBloomProps) {
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

    const branches = ["SYNTAX", "KINETICS", "VECTOR", "GRAPH", "LATTICE", "HARMONIC"];

    const render = () => {
      ctx.fillStyle = "#06070a";
      ctx.fillRect(0, 0, width, height);

      t += 0.02 * speed;
      const cx = width / 2;
      const cy = height / 2;

      // Draw central root
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = "#000000";
      ctx.fillText(rootWord, cx, cy);

      // Radiating branches
      for (let i = 0; i < branches.length; i++) {
        const angle = (i / branches.length) * Math.PI * 2 + t * 0.2;
        const dist = 110 + Math.sin(angle * 3 + t) * 20;
        const bx = cx + Math.cos(angle) * dist;
        const by = cy + Math.sin(angle) * dist;

        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(bx, by);
        ctx.stroke();

        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(bx, by, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#38bdf8";
        ctx.stroke();

        ctx.fillStyle = "#e2e8f0";
        ctx.font = "9px monospace";
        ctx.fillText(branches[i], bx, by);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [rootWord, speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[360px] bg-[#06070a] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
