(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,92795,28967,e=>{"use strict";var t=e.i(36071),i=e.i(85005);e.s(["default",0,function({className:e="",intensity:a=1}){let n=(0,i.useRef)(null),r=(0,i.useRef)(a);return r.current=a,(0,i.useEffect)(()=>{let e=n.current;if(!e)return;let t=window.matchMedia("(prefers-reduced-motion: reduce)").matches,i=e.getContext("webgl2",{alpha:!0,antialias:!1,premultipliedAlpha:!0,powerPreference:"high-performance"});if(!i)return;let a=`#version 300 es
precision highp float;
const vec2 POS[3] = vec2[3](vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
void main(){ gl_Position = vec4(POS[gl_VertexID], 0.0, 1.0); }`,l=`#version 300 es
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
}`,o=(e,t)=>{let a=i.createShader(e);return(i.shaderSource(a,t),i.compileShader(a),i.getShaderParameter(a,i.COMPILE_STATUS))?a:(console.warn(i.getShaderInfoLog(a)),i.deleteShader(a),null)},s=o(i.VERTEX_SHADER,a),c=o(i.FRAGMENT_SHADER,l);if(!s||!c)return;let d=i.createProgram();if(i.attachShader(d,s),i.attachShader(d,c),i.linkProgram(d),!i.getProgramParameter(d,i.LINK_STATUS))return void console.warn(i.getProgramInfoLog(d));i.useProgram(d);let m=i.getUniformLocation(d,"uRes"),f=i.getUniformLocation(d,"uTime"),u=i.getUniformLocation(d,"uPointer"),p=i.getUniformLocation(d,"uScroll"),h=i.getUniformLocation(d,"uIntensity"),x=i.getUniformLocation(d,"uDark"),v={x:.5,y:.5},g=0,y=!0,w=0,j=performance.now(),b=()=>{let t=Math.min(window.devicePixelRatio||1,1.5),a=e.clientWidth,n=e.clientHeight,r=Math.max(1,Math.floor(a*t)),l=Math.max(1,Math.floor(n*t));(e.width!==r||e.height!==l)&&(e.width=r,e.height=l),i.viewport(0,0,e.width,e.height)},N=t=>{let i=e.getBoundingClientRect();v.x=(t.clientX-i.left)/Math.max(i.width,1),v.y=1-(t.clientY-i.top)/Math.max(i.height,1)},S=()=>{let e=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);g=window.scrollY/e},L=new IntersectionObserver(([e])=>{y=e.isIntersecting},{threshold:.01});L.observe(e);let A=a=>{w=requestAnimationFrame(A),(y||t)&&(b(),i.enable(i.BLEND),i.blendFunc(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA),i.clearColor(0,0,0,0),i.clear(i.COLOR_BUFFER_BIT),i.uniform2f(m,e.width,e.height),i.uniform1f(f,t?0:(a-j)*.001),i.uniform2f(u,v.x,v.y),i.uniform1f(p,g),i.uniform1f(h,r.current),i.uniform1f(x,+!!document.documentElement.classList.contains("dark")),i.drawArrays(i.TRIANGLES,0,3))};return window.addEventListener("pointermove",N,{passive:!0}),window.addEventListener("scroll",S,{passive:!0}),window.addEventListener("resize",b),S(),b(),w=requestAnimationFrame(A),()=>{cancelAnimationFrame(w),window.removeEventListener("pointermove",N),window.removeEventListener("scroll",S),window.removeEventListener("resize",b),L.disconnect(),i.deleteProgram(d),i.deleteShader(s),i.deleteShader(c)}},[]),(0,t.jsx)("canvas",{ref:n,className:`pointer-events-none absolute inset-0 h-full w-full ${e}`,"aria-hidden":!0})}],92795),e.s(["default",0,function(){let[e,a]=(0,i.useState)(0);return(0,i.useEffect)(()=>{let e=0,t=()=>{let e=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);a(Math.min(1,window.scrollY/e))},i=()=>{cancelAnimationFrame(e),e=requestAnimationFrame(t)};return t(),window.addEventListener("scroll",i,{passive:!0}),window.addEventListener("resize",i),()=>{cancelAnimationFrame(e),window.removeEventListener("scroll",i),window.removeEventListener("resize",i)}},[]),(0,t.jsx)("div",{className:"pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent","aria-hidden":!0,children:(0,t.jsx)("div",{className:"h-full origin-left bg-gradient-to-r from-rose-300 via-fuchsia-300 to-amber-200 shadow-[0_0_12px_rgba(244,114,182,0.55)] transition-[width] duration-75 ease-out",style:{width:`${100*e}%`}})})}],28967)},90147,e=>{"use strict";var t=e.i(36071),i=e.i(92795),a=e.i(28967);e.s(["default",0,function({children:e,intensity:n=.36,className:r=""}){return(0,t.jsxs)("div",{className:`relative min-h-[70vh] ${r}`,children:[(0,t.jsx)(a.default,{}),(0,t.jsxs)("div",{className:"pointer-events-none fixed inset-0 z-0 overflow-hidden",children:[(0,t.jsx)(i.default,{intensity:n}),(0,t.jsx)("div",{className:"noise-overlay absolute inset-0 opacity-[0.03] mix-blend-overlay dark:opacity-[0.05]"}),(0,t.jsx)("div",{className:"absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_10%,_var(--background)_78%)]"})]}),(0,t.jsx)("div",{className:"relative z-10",children:e})]})}])},4806,e=>{"use strict";var t=e.i(36071),i=e.i(55639);e.s(["default",0,function({kicker:e,title:a,subtitle:n,action:r}){return(0,t.jsxs)("div",{className:"flex flex-col gap-4 md:flex-row md:items-end md:justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)(i.motion.p,{initial:{opacity:0,y:8},animate:{opacity:1,y:0},className:"text-[11px] tracking-[0.32em] text-muted-foreground",children:e}),(0,t.jsx)(i.motion.h1,{initial:{opacity:0,y:14},animate:{opacity:1,y:0},transition:{delay:.05},className:"font-display mt-2 text-3xl md:text-5xl",children:a}),n?(0,t.jsx)(i.motion.p,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{delay:.12},className:"mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground",children:n}):null]}),r?(0,t.jsx)(i.motion.div,{initial:{opacity:0,y:8},animate:{opacity:1,y:0},transition:{delay:.15},children:r}):null]})}])},9561,e=>{"use strict";var t=e.i(36071),i=e.i(57512),a=e.i(55639),n=e.i(90147),r=e.i(4806);let l=[{t:"乃木坂气质",d:"粉白、克制、留白。不堆砌特效，把重量留给表情本身。"},{t:"可保存瞬间",d:"画廊预览与下载、每日种子帧，把心跳漏拍变成可分享的文件。"},{t:"界面即展厅",d:"WebGL 光场、玻璃层、滚动叙事——技术为情绪服务，而不是喧宾夺主。"}],o=["Next.js 16 static export","React 19","Tailwind CSS v4","Framer Motion","WebGL2 shaders","color-mix / glass"];e.s(["default",0,function(){return(0,t.jsx)(n.default,{intensity:.45,children:(0,t.jsxs)("div",{className:"mx-auto max-w-6xl px-4 py-12 md:py-16",children:[(0,t.jsx)(r.default,{kicker:"MANIFESTO · ABOUT",title:"关于本站",subtitle:"粉丝向表情包小站，献给斋藤飞鸟。内容仅供学习交流，与官方无关。"}),(0,t.jsxs)("div",{className:"mt-12 grid gap-6 md:grid-cols-12",children:[(0,t.jsxs)(a.motion.article,{initial:{opacity:0,y:18},animate:{opacity:1,y:0},className:"glass-panel md:col-span-7 p-7 md:p-10",children:[(0,t.jsxs)("p",{className:"font-display text-2xl leading-snug md:text-3xl",children:["收集那些让心跳漏了一拍的瞬间，",(0,t.jsx)("span",{className:"text-accent",children:" 化作可保存、可分享的表情包。"})]}),(0,t.jsxs)("div",{className:"mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground",children:[(0,t.jsx)("p",{children:"Cute Asuka 不是库存盘，而是一场轻量的数字展览：首页负责情绪开场，画廊负责检索与下载，每日一图负责仪式感。"}),(0,t.jsx)("p",{children:"设计语言借自舞台侧光与樱色滤镜——柔和对比、透光层次、电影感遮罩。深色模式同样温柔，不为炫技而刺眼。"}),(0,t.jsx)("p",{children:"站点功能会继续打磨；若有建议，欢迎通过留言或 Issue 交流。"})]}),(0,t.jsxs)("div",{className:"mt-8 flex flex-wrap gap-2",children:[(0,t.jsx)(i.default,{href:"/gallery",className:"btn-glass-primary text-xs",children:"进入画廊"}),(0,t.jsx)(i.default,{href:"/daily",className:"btn-glass-solid text-xs",children:"今日一图"}),(0,t.jsx)(i.default,{href:"/",className:"btn-glass-solid text-xs",children:"返回首页"})]})]}),(0,t.jsx)("div",{className:"flex flex-col gap-4 md:col-span-5",children:l.map((e,i)=>(0,t.jsxs)(a.motion.div,{initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{delay:.08*(i+1)},className:"glass-panel p-5",children:[(0,t.jsx)("p",{className:"text-[10px] tracking-[0.28em] text-accent",children:String(i+1).padStart(2,"0")}),(0,t.jsx)("h3",{className:"font-display mt-1 text-xl",children:e.t}),(0,t.jsx)("p",{className:"mt-2 text-sm text-muted-foreground",children:e.d})]},e.t))})]}),(0,t.jsxs)(a.motion.section,{initial:{opacity:0,y:14},whileInView:{opacity:1,y:0},viewport:{once:!0},className:"glass-panel mt-8 p-6 md:p-8",children:[(0,t.jsx)("p",{className:"text-[11px] tracking-[0.32em] text-muted-foreground",children:"CRAFT STACK"}),(0,t.jsx)("p",{className:"font-display mt-2 text-xl",children:"如何搭成这座小馆"}),(0,t.jsx)("ul",{className:"mt-5 flex flex-wrap gap-2",children:o.map(e=>(0,t.jsx)("li",{className:"rounded-full border border-border/80 bg-background/50 px-3 py-1.5 text-xs text-muted-foreground",children:e},e))})]})]})})}])}]);