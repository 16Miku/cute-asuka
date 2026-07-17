"use client";

import { useEffect, useRef } from "react";

/**
 * Full-viewport WebGL2 soft aurora field.
 * Pointer-reactive, scroll-tinted, DPR-capped, paused offscreen / reduced-motion.
 */
export default function AuroraField({
  className = "",
  intensity = 1,
}: {
  className?: string;
  intensity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vs = `#version 300 es
precision highp float;
const vec2 POS[3] = vec2[3](vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
void main(){ gl_Position = vec4(POS[gl_VertexID], 0.0, 1.0); }`;

    const fs = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uScroll;
uniform float uIntensity;
uniform float uDark;

// Hash / value noise (no textures — pure procedural)
float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for(int i = 0; i < 5; i++){
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  vec2 pointer = (uPointer - 0.5) * 2.0;
  p += pointer * 0.08;

  float t = uTime * 0.12;
  float scroll = uScroll * 0.35;

  // Layered soft plumes — sakura pink / sakura violet / soft gold
  float n1 = fbm(p * 1.4 + vec2(t * 0.4, t * 0.2 + scroll));
  float n2 = fbm(p * 2.1 - vec2(t * 0.25, -t * 0.35) + 3.1);
  float n3 = fbm(p * 0.8 + vec2(-t * 0.15, t * 0.5) + n1);

  float petal = smoothstep(0.35, 0.95, n1 * 0.65 + n2 * 0.45);
  float veil = smoothstep(0.2, 0.85, n3);
  float spark = pow(noise(p * 18.0 + t * 2.0), 12.0);

  vec3 rose = mix(vec3(1.0, 0.72, 0.82), vec3(0.95, 0.45, 0.62), n2);
  vec3 violet = mix(vec3(0.78, 0.62, 0.95), vec3(0.55, 0.35, 0.72), n1);
  vec3 gold = vec3(1.0, 0.88, 0.72);

  vec3 col = mix(rose, violet, veil);
  col = mix(col, gold, spark * 0.55);
  col *= 0.55 + 0.55 * petal;

  // Soft vignette & film falloff
  float r = length(p);
  float vig = smoothstep(1.35, 0.15, r);
  col *= vig;

  // Light mode vs dark: darker scenes need more emissive presence
  float baseAlpha = mix(0.22, 0.38, uDark);
  float alpha = (baseAlpha + petal * 0.28 + spark * 0.15) * uIntensity;
  alpha *= mix(0.85, 1.1, vig);

  // Subtle chromatic fringe along edges
  float edge = smoothstep(0.55, 1.1, r);
  col.r += edge * 0.04;
  col.b += edge * 0.03;

  fragColor = vec4(col, clamp(alpha, 0.0, 0.72));
}`;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vsh = compile(gl.VERTEX_SHADER, vs);
    const fsh = compile(gl.FRAGMENT_SHADER, fs);
    if (!vsh || !fsh) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uPointer = gl.getUniformLocation(prog, "uPointer");
    const uScroll = gl.getUniformLocation(prog, "uScroll");
    const uIntensity = gl.getUniformLocation(prog, "uIntensity");
    const uDark = gl.getUniformLocation(prog, "uDark");

    const pointer = { x: 0.5, y: 0.5 };
    let scrollN = 0;
    let visible = true;
    let raf = 0;
    let start = performance.now();

    const isDark = () =>
      document.documentElement.classList.contains("dark") ? 1 : 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const tw = Math.max(1, Math.floor(w * dpr));
      const th = Math.max(1, Math.floor(h * dpr));
      if (canvas.width !== tw || canvas.height !== th) {
        canvas.width = tw;
        canvas.height = th;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      pointer.y = 1 - (e.clientY - rect.top) / Math.max(rect.height, 1);
    };

    const onScroll = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      scrollN = window.scrollY / max;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible && !reduceMotion) return;
      resize();
      const t = reduceMotion ? 0 : (now - start) * 0.001;
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uScroll, scrollN);
      gl.uniform1f(uIntensity, intensityRef.current);
      gl.uniform1f(uDark, isDark());
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    onScroll();
    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      io.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vsh);
      gl.deleteShader(fsh);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    />
  );
}
