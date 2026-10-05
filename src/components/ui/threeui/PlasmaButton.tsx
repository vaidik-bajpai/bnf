import React, { useEffect, useRef } from "react";

export interface PlasmaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  speed?: number;
}

export function PlasmaButton({
  children = "AETHER DRIVE",
  speed = 1,
  className = "",
  style,
  ...props
}: PlasmaButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vs = "attribute vec2 p; void main(){ gl_Position=vec4(p,0.,1.); }";
    const fs = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_time;
      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        float t = u_time * 1.5;
        float v = sin(uv.x * 10.0 + t) + sin(uv.y * 10.0 + t * 0.8) + sin((uv.x + uv.y) * 8.0 - t * 1.2);
        vec3 col = vec3(0.03, 0.08, 0.2) + vec3(0.1, 0.4, 0.9) * (0.5 + 0.5 * sin(v + vec3(0.0, 1.0, 2.0)));
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function createShader(type: number, src: string) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const locP = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(locP);
    gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");

    let animId: number;
    let start = performance.now();

    const render = (now: number) => {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, ((now - start) * 0.001) * speed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      gl.deleteProgram(prog);
    };
  }, [speed]);

  return (
    <button
      type="button"
      className={`group relative inline-flex items-center justify-center w-[230px] h-[64px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
      style={{
        boxShadow: "0 18px 40px rgba(10, 80, 200, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
        fontFamily: "inherit",
        ...style,
      }}
      {...props}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      <span className="relative z-10 font-semibold text-sm tracking-[0.22em] text-[#e2f1ff] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
        {children}
      </span>
    </button>
  );
}
