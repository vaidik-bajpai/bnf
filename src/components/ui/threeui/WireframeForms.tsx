import React, { useEffect, useRef } from "react";

export interface WireframeFormsProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function WireframeForms({
  speed = 1,
  className = "",
  style,
  ...props
}: WireframeFormsProps) {
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
    let angleX = 0;
    let angleY = 0;

    // Cube vertices
    const size = 90;
    const vertices = [
      [-size, -size, -size], [size, -size, -size], [size, size, -size], [-size, size, -size],
      [-size, -size, size], [size, -size, size], [size, size, size], [-size, size, size],
    ];

    const edges = [
      [0,1],[1,2],[2,3],[3,0],
      [4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7],
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      angleX += 0.01 * speed;
      angleY += 0.015 * speed;

      const cx = width / 2;
      const cy = height / 2;

      // Rotate and project
      const projected = vertices.map(([x, y, z]) => {
        // Rotate Y
        let x1 = x * Math.cos(angleY) + z * Math.sin(angleY);
        let z1 = -x * Math.sin(angleY) + z * Math.cos(angleY);
        // Rotate X
        let y2 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = y * Math.sin(angleX) + z1 * Math.cos(angleX);

        const fov = 350;
        const scale = fov / (fov + z2);
        return [cx + x1 * scale, cy + y2 * scale];
      });

      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;

      edges.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(projected[i][0], projected[i][1]);
        ctx.lineTo(projected[j][0], projected[j][1]);
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-neutral-950 flex items-center justify-center ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
