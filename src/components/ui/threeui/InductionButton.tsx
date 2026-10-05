import React, { useEffect, useRef } from "react";

export interface InductionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  speed?: number;
}

export function InductionButton({
  children = "VALENCE CORE",
  speed = 1,
  className = "",
  style,
  onPointerEnter,
  onPointerLeave,
  ...props
}: InductionButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pulseRef = useRef(0);
  const targetPulseRef = useRef(0);

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
      uniform float u_pulse;
      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
        float r = length(uv);
        float a = atan(uv.y, uv.x);
        float waves = sin(r * 24.0 - u_time * 4.0) * cos(a * 6.0 + u_time);
        vec3 col = vec3(0.01, 0.04, 0.08);
        col += vec3(0.0, 0.8, 0.95) * smoothstep(0.45, 0.0, r) * (0.6 + 0.4 * waves);
        col += vec3(0.4, 0.95, 1.0) * smoothstep(0.15, 0.0, r) * (1.0 + u_pulse * 1.8);
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
    const uPulse = gl.getUniformLocation(prog, "u_pulse");

    let animId: number;
    let start = performance.now();

    const render = (now: number) => {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      pulseRef.current += (targetPulseRef.current - pulseRef.current) * 0.1;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, ((now - start) * 0.001) * speed);
      gl.uniform1f(uPulse, pulseRef.current);
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
      className={`group relative inline-flex items-center justify-center w-[240px] h-[66px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
      style={{
        boxShadow: "0 16px 36px rgba(0, 180, 220, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
        fontFamily: "inherit",
        ...style,
      }}
      onPointerEnter={(e) => {
        targetPulseRef.current = 1;
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        targetPulseRef.current = 0;
        onPointerLeave?.(e);
      }}
      {...props}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      <span className="relative z-10 font-semibold text-sm tracking-[0.25em] text-cyan-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        {children}
      </span>
    </button>
  );
}
