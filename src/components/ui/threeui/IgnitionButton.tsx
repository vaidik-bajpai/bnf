import React, { useEffect, useRef } from "react";

export type IgnitionButtonSize = "sm" | "md" | "lg" | "showcase";

export interface IgnitionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  size?: IgnitionButtonSize;
}

const SIZE_CONFIGS: Record<
  IgnitionButtonSize,
  {
    outer: string;
    inner: string;
    text: string;
  }
> = {
  sm: {
    outer: "h-[44px] min-w-[170px] p-[4px] rounded-[14px]",
    inner: "rounded-[10px]",
    text: "text-xs tracking-[0.24em] indent-[0.24em]",
  },
  md: {
    outer: "h-[52px] min-w-[210px] p-[5px] rounded-[18px]",
    inner: "rounded-[13px]",
    text: "text-xs sm:text-sm tracking-[0.28em] indent-[0.28em]",
  },
  lg: {
    outer: "h-[64px] min-w-[240px] p-[6px] rounded-[22px]",
    inner: "rounded-[16px]",
    text: "text-sm tracking-[0.32em] indent-[0.32em]",
  },
  showcase: {
    outer: "w-[264px] h-[78px] p-[7px] rounded-[24px]",
    inner: "rounded-[17px]",
    text: "text-sm tracking-[0.34em] indent-[0.34em]",
  },
};

export function IgnitionButton({
  label = "LAUNCH",
  size = "md",
  className = "",
  style,
  onClick,
  ...props
}: IgnitionButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ warp: 0, warpTarget: 0, flash: 0, z: 0, last: 0 });
  const config = SIZE_CONFIGS[size] ?? SIZE_CONFIGS.md;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    const FS = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_time;
      uniform float u_warp;
      uniform float u_flash;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
      float noise(vec2 p){
        vec2 i=floor(p), f=fract(p);
        vec2 u=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),
                   mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
      }
      float fbm(vec2 p){
        float v=0.0; float a=0.5;
        for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.07+vec2(13.1,5.7); a*=0.5; }
        return v;
      }
      void main(){
        vec2 sc = gl_FragCoord.xy / u_res;
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
        float r = length(uv);
        float rr = max(r, 0.08);
        float a = atan(uv.y, uv.x);
        float t = u_time;
        vec3 col = vec3(0.012, 0.011, 0.014);
        float hz = fbm(uv * 2.6 + vec2(t * 0.35, 1.7));
        col += vec3(0.13, 0.06, 0.032) * hz * (0.7 + 0.6 * u_warp);
        for (int i = 0; i < 3; i++) {
          float fi = float(i);
          float ringN = 26.0 + fi * 9.0;
          vec2 sp = vec2((a / 6.28318 + 0.5) * ringN,
                         (0.3 + fi * 0.22) / rr + t * (2.0 + fi * 1.2));
          vec2 cell = floor(sp);
          vec2 f = fract(sp);
          float h = hash(cell + fi * 17.31);
          float on = step(0.68, h);
          vec2 c = vec2(0.2 + 0.6 * hash(cell + 4.7), 0.5);
          vec2 dlt = f - c;
          float sy = mix(130.0, 8.0, u_warp);
          float star = on * exp(-(dlt.x * dlt.x * 150.0 + dlt.y * dlt.y * sy));
          float tw = mix(0.7 + 0.3 * sin(h * 81.0 + t * 9.0), 1.0, u_warp);
          vec3 sCol = mix(vec3(1.0, 0.94, 0.85), vec3(1.0, 0.6, 0.33), step(0.9, h));
          float fade = smoothstep(0.02, 0.25, r);
          col += sCol * star * tw * fade * (1.1 + 0.7 * u_warp);
        }
        col += vec3(1.0, 0.8, 0.58) * u_warp * 0.32 * exp(-r * 4.0);
        vec2 e = sc * (1.0 - sc);
        col *= 0.3 + 0.7 * pow(e.x * e.y * 16.0, 0.3);
        col = mix(col, vec3(1.0, 0.97, 0.92), clamp(u_flash, 0.0, 1.0));
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const locP = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(locP);
    gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uWarp = gl.getUniformLocation(prog, "u_warp");
    const uFlash = gl.getUniformLocation(prog, "u_flash");

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl!.viewport(0, 0, w, h);
      }
    }
    resize();

    let animId: number;
    stateRef.current.last = performance.now();

    function render(now: number) {
      const state = stateRef.current;
      const dt = Math.min(0.05, (now - state.last) / 1000);
      state.last = now;
      state.warp += (state.warpTarget - state.warp) * Math.min(1, dt * 2.6);
      state.flash *= Math.exp(-4.5 * dt);
      state.z += dt * (0.05 + state.warp * 1.35);

      resize();
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, state.z);
      gl!.uniform1f(uWarp, state.warp);
      gl!.uniform1f(uFlash, state.flash);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <button
      type="button"
      onPointerEnter={() => {
        stateRef.current.warpTarget = 1;
      }}
      onPointerLeave={() => {
        stateRef.current.warpTarget = 0;
      }}
      onClick={(e) => {
        stateRef.current.flash = 1;
        stateRef.current.warp = 0;
        stateRef.current.z = 0;
        onClick?.(e);
      }}
      className={`group relative inline-flex items-center justify-center border-0 cursor-pointer outline-none transition-all duration-300 ease-[cubic-bezier(.34,1.4,.5,1)] hover:-translate-y-[2px] active:translate-y-[1px] active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-[#d43d17] focus-visible:outline-offset-[5px] bg-[linear-gradient(180deg,#3c3f46_0%,#15171b_55%,#2a2d33_100%)] shadow-[0_26px_52px_rgba(15,12,10,.35),0_3px_10px_rgba(0,0,0,.35),inset_0_1px_0_rgba(255,255,255,.14)] hover:shadow-[0_32px_64px_rgba(160,60,12,.3),0_4px_12px_rgba(0,0,0,.4),inset_0_1px_0_rgba(255,255,255,.16)] ${config.outer} ${className}`}
      style={style}
      {...props}
    >
      <span
        className={`relative block w-full h-full overflow-hidden bg-[#06050a] flex items-center justify-center shadow-[inset_0_2px_8px_rgba(0,0,0,.9)] ${config.inner}`}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" aria-hidden="true" />
        <span
          className={`relative z-10 pointer-events-none font-medium text-[#fdf6ee] ${config.text}`}
          style={{ textShadow: "0 0 14px rgba(255, 170, 100, .55), 0 1px 6px rgba(0, 0, 0, .9)" }}
        >
          {label}
        </span>
      </span>
    </button>
  );
}
