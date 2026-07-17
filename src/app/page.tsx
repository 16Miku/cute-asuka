"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import AuroraField from "@/components/effects/AuroraField";
import ScrollProgress from "@/components/effects/ScrollProgress";
import FilmStrip from "@/components/effects/FilmStrip";
import CountUp from "@/components/effects/CountUp";

type Feature = {
  title: string;
  jp: string;
  desc: string;
  href: string;
  cover: string;
  meta: string;
};

const features: Feature[] = [
  {
    title: "Gallery",
    jp: "画廊",
    desc: "静态与动态分类浏览，Lightbox 预览、一键下载与分享。把心跳瞬间收进口袋。",
    href: "/gallery",
    cover: "/images/1EE7B161F569BD20637D529E37840F1D.jpg",
    meta: "Archive",
  },
  {
    title: "Daily",
    jp: "每日一图",
    desc: "以日期为种子的随机治愈。今天的飞鸟，只为你停留二十四小时。",
    href: "/daily",
    cover: "/images/0D4291F4BA750219AD4B85B438B8966E.jpg",
    meta: "Ritual",
  },
  {
    title: "About",
    jp: "关于",
    desc: "乃木坂式的克制与温柔：粉白、干净、留白。设计即态度。",
    href: "/about",
    cover: "/images/0D80C53FF8683DFAA86487E7E93CC263.jpg",
    meta: "Manifesto",
  },
];

const mobileHeroImages = [
  "/sp-banner/007db78fly1habodixk36j30u00u00x1.jpg",
  "/sp-banner/35D4810AA84C785CEC9845663F8FF042.jpg",
  "/sp-banner/3f99-hrpcmqv4220798.jpg",
  "/sp-banner/6de29fd509fd96609bf8f221e8c32.jpg",
  "/sp-banner/Asuka_Yoda.jpg",
  "/sp-banner/C26EF8FC1ECDD3E91FC1B7FE5475FF04.jpg",
  "/sp-banner/R-C.jpg",
  "/sp-banner/asuka-wife.png",
];

const desktopHeroImages = [
  "/web-banner/17112eadc50604486b3820457cecc.jpg",
  "/web-banner/627FF46985455460C877ECF82452CEB7.jpg",
  "/web-banner/bc2d0c405d17e3855fbc79ce58571.jpg",
  "/web-banner/cc1133995ab8c56ba2a2bab389780.jpg",
  "/web-banner/d979c5942b49a9e960ce675526c89.jpg",
  "/web-banner/db9be99fc30b2aa0aa7fae7207a0b.jpg",
  "/web-banner/官网图1.jpg",
  "/web-banner/官网图2.jpg",
  "/web-banner/官网图3.jpg",
  "/web-banner/官网图4.jpg",
  "/web-banner/官网图5.jpg",
];

const stripImages = [
  ...desktopHeroImages.slice(0, 6),
  features[0].cover,
  features[1].cover,
  features[2].cover,
];

const moments = [
  {
    kicker: "Capture",
    title: "不是库存，是瞬间",
    body: "每一张表情包都是一次微表情的封存——眨眼、歪头、嘴角上扬。站点只做一件事：把这些瞬间变得可保存、可分享。",
  },
  {
    kicker: "Craft",
    title: "粉白克制，玻璃留白",
    body: "视觉语言借自乃木坂舞台灯光与樱色滤镜：柔和对比、透光层次、电影感遮罩。技术服务于情绪，而不是反过来。",
  },
  {
    kicker: "Share",
    title: "从屏幕到聊天框",
    body: "Gallery 支持预览与下载；Daily 用日期种子保证「今日之选」的仪式感。粉丝向小站，也是一场温柔的信息设计实验。",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const [stats, setStats] = useState({ gif: 0, static: 0, total: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/images", { cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<string[]>) : []))
      .then((files) => {
        if (!files.length) return;
        const gif = files.filter((f) => f.toLowerCase().endsWith(".gif")).length;
        setStats({ gif, static: files.length - gif, total: files.length });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  return (
    <div className="home-sp relative">
      <ScrollProgress />

      {/* Ambient WebGL field (fixed under content) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <AuroraField intensity={1} />
        <div className="noise-overlay absolute inset-0 opacity-[0.035] mix-blend-overlay dark:opacity-[0.06]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_0%,_var(--background)_72%)]" />
      </div>

      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="relative z-10 min-h-[100svh] overflow-hidden"
      >
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 md:inset-4 md:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-rose-500/10">
            <HeroCarousel
              mobileImages={mobileHeroImages}
              desktopImages={desktopHeroImages}
              interval={6500}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-[var(--background)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.25),transparent_50%)]" />
          </div>
        </motion.div>

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 md:justify-center md:pb-24 md:pt-20">
          <motion.div style={{ y: titleY }} className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] tracking-[0.28em] text-white/90 backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-300" />
              NOGIZAKA · FAN ARCHIVE · v1.4
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[clamp(2.75rem,8vw,5.75rem)] font-medium leading-[0.95] tracking-tight text-white drop-shadow-lg"
            >
              <span className="block">Cute</span>
              <span className="block bg-gradient-to-r from-white via-rose-100 to-fuchsia-200 bg-clip-text text-transparent">
                Asuka
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="mt-2 font-display text-2xl text-white/80 md:text-3xl"
            >
              齋藤飛鳥 · 表情包光年
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.7 }}
              className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 md:text-base"
            >
              把舞台侧光、镜头余温与心跳漏拍，做成可滑动、可下载的数字标本。
              下方是一场为她编排的单页巡礼——滚动即叙事。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link href="/gallery" className="btn-glass-primary">
                进入画廊
              </Link>
              <a href="#story" className="btn-glass">
                阅读叙事
              </a>
              <Link href="/daily" className="btn-glass">
                今日一图
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.35em] text-white/60 md:flex"
          >
            SCROLL
            <span className="scroll-chevron h-8 w-px bg-gradient-to-b from-white/70 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ─── STORY ─── */}
      <section
        id="story"
        className="relative z-10 mx-auto max-w-6xl px-4 py-20 md:py-28"
      >
        <div className="mb-12 flex flex-col gap-3 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.32em] text-muted-foreground">
              01 — NARRATIVE
            </p>
            <h2 className="font-display mt-2 text-3xl md:text-5xl">
              信息即情绪
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            不是又一个素材仓库。用滚动、光场与玻璃层，把「可爱」翻译成可感知的界面节奏。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {moments.map((m, i) => (
            <motion.article
              key={m.kicker}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              className="glass-panel group relative overflow-hidden p-6 md:p-7"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-300/20 blur-2xl transition group-hover:bg-rose-300/35" />
              <p className="text-[10px] tracking-[0.28em] text-accent">
                {String(i + 1).padStart(2, "0")} · {m.kicker}
              </p>
              <h3 className="font-display mt-3 text-xl md:text-2xl">{m.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {m.body}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 md:pb-24">
        <div className="glass-panel overflow-hidden p-1">
          <div className="grid divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { label: "GIF 动态", value: stats.gif, hint: "动起来的飞鸟" },
              { label: "高清静态", value: stats.static, hint: "定格的侧脸" },
              { label: "馆藏总计", value: stats.total, hint: "持续收集中" },
            ].map((s) => (
              <div
                key={s.label}
                className="relative px-6 py-10 text-center sm:py-12"
              >
                <p className="font-display text-5xl font-medium tracking-tight md:text-6xl">
                  {ready ? (
                    <CountUp value={s.value} suffix="+" />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </p>
                <p className="mt-3 text-xs tracking-[0.22em] text-foreground">
                  {s.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FILM STRIP ─── */}
      <section className="relative z-10 pb-8 md:pb-12">
        <div className="mx-auto mb-4 max-w-6xl px-4">
          <p className="text-[11px] tracking-[0.32em] text-muted-foreground">
            02 — FILM ROLL
          </p>
          <h2 className="font-display mt-2 text-2xl md:text-4xl">胶片在滑动</h2>
        </div>
        <FilmStrip images={stripImages} speed="med" />
        <FilmStrip images={[...stripImages].reverse()} speed="slow" reverse />
      </section>

      {/* ─── BENTO FEATURES ─── */}
      <section
        id="explore"
        className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24"
      >
        <div className="mb-10 md:mb-14">
          <p className="text-[11px] tracking-[0.32em] text-muted-foreground">
            03 — PORTALS
          </p>
          <h2 className="font-display mt-2 text-3xl md:text-5xl">三扇门</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-12 md:grid-rows-2 md:gap-5">
          {features.map((item, idx) => {
            const large = idx === 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group glass-panel relative overflow-hidden ${
                  large
                    ? "md:col-span-7 md:row-span-2 min-h-[320px] md:min-h-[520px]"
                    : "md:col-span-5 min-h-[220px]"
                }`}
              >
                <div className="absolute inset-0">
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-700 ease-out group-hover:scale-105"
                    sizes={large ? "60vw" : "40vw"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                </div>
                <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
                  <span className="w-fit rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[10px] tracking-[0.24em] text-white/90 backdrop-blur">
                    {item.meta}
                  </span>
                  <h3 className="font-display mt-3 text-3xl text-white md:text-4xl">
                    {item.title}
                    <span className="ml-2 text-lg text-white/60 md:text-xl">
                      {item.jp}
                    </span>
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
                    {item.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs tracking-[0.2em] text-rose-100 transition group-hover:gap-3">
                    OPEN <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── TECH STRIP ─── */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16">
        <div className="glass-panel flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="text-[11px] tracking-[0.32em] text-muted-foreground">
              CRAFT STACK
            </p>
            <p className="font-display mt-2 text-xl md:text-2xl">
              CSS · WebGL2 · Scroll timelines · Glass
            </p>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              程序化极光着色器、滚动进度与视差、胶片无限轨、玻璃拟态信息层——在静态导出约束下仍保持剧院级首屏。
            </p>
          </div>
          <ul className="flex flex-wrap gap-2 text-[11px] tracking-wide">
            {[
              "WebGL2 FBM",
              "scroll-driven UI",
              "color-mix()",
              "svh / dvh",
              "backdrop-filter",
              "prefers-reduced-motion",
            ].map((t) => (
              <li
                key={t}
                className="rounded-full border border-border/80 bg-background/50 px-3 py-1.5 text-muted-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-24 md:pb-32">
        <div className="relative overflow-hidden rounded-[2rem] border border-rose-200/40 bg-gradient-to-br from-rose-100/80 via-fuchsia-50/50 to-amber-50/60 px-6 py-14 text-center shadow-xl shadow-rose-200/30 dark:border-rose-900/40 dark:from-rose-950/60 dark:via-fuchsia-950/40 dark:to-amber-950/30 dark:shadow-none md:px-12 md:py-20">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <AuroraField intensity={0.85} />
          </div>
          <div className="relative">
            <p className="text-[11px] tracking-[0.35em] text-muted-foreground">
              NEXT FRAME
            </p>
            <h2 className="font-display mt-3 text-3xl md:text-5xl">
              准备好下一张表情了吗？
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
              Gallery 收纳全部馆藏 · Daily 给出今日那一帧 · 深色模式同样温柔。
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/gallery" className="btn-glass-primary">
                前往 Gallery
              </Link>
              <Link href="/daily" className="btn-glass-solid">
                前往 Daily
              </Link>
              <Link href="/about" className="btn-glass-solid">
                关于本站
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
