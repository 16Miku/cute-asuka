"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import AuroraField from "@/components/effects/AuroraField";
import PrismField from "@/components/effects/PrismField";
import ScrollProgress from "@/components/effects/ScrollProgress";
import FilmStrip from "@/components/effects/FilmStrip";
import CountUp from "@/components/effects/CountUp";
import SectionNav from "@/components/effects/SectionNav";
import Lightbox from "@/components/Lightbox";
import {
  filesToItems,
  formatFrameId,
  pickDailyItem,
  todayLabel,
  type GalleryItem,
} from "@/lib/gallery";

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

const chapters = [
  {
    n: "01",
    title: "封存微表情",
    body: "眨眼、歪头、嘴角上扬——不是素材库编号，是心跳漏拍的标本。每一帧都可预览、下载、带走。",
  },
  {
    n: "02",
    title: "光场即展厅",
    body: "双层 WebGL（极光 FBM + 棱镜域扭曲）与滚动进度、视差共同构成环境光。技术退居幕后，情绪在前。",
  },
  {
    n: "03",
    title: "日期即仪式",
    body: "Daily 用 YYYYMMDD 种子对齐馆藏：同一天永远是同一张，明天才会换帧。",
  },
  {
    n: "04",
    title: "开源与边界",
    body: "粉丝向学习交流小站，与官方无关。源码在 GitHub；玻璃与 shader 只服务可爱，不服务炫技清单。",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.35]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 56]);

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState({ gif: 0, static: 0, total: 0 });
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [webglOn, setWebglOn] = useState(true);

  const staticStrip = useMemo(
    () => items.filter((i) => i.cat === "静态表情包").map((i) => i.src),
    [items]
  );
  const previewGrid = useMemo(() => items.slice(0, 12), [items]);
  const daily = useMemo(
    () => (items.length ? pickDailyItem(items.map((i) => i.file)) : null),
    [items]
  );

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      "connection" in navigator &&
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData;
    if (reduce || saveData) setWebglOn(false);
  }, []);

  useEffect(() => {
    fetch("/api/images", { cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<string[]>) : []))
      .then((files) => {
        const list = filesToItems(files);
        setItems(list);
        const gif = list.filter((i) => i.cat === "动态表情包").length;
        setStats({
          gif,
          static: list.length - gif,
          total: list.length,
        });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const list = previewGrid.length ? previewGrid : items;
      const idx = list.findIndex((i) => i.id === selected.id);
      if (idx < 0 || !list.length) return;
      const next =
        e.key === "ArrowRight"
          ? list[(idx + 1) % list.length]
          : list[(idx - 1 + list.length) % list.length];
      setSelected(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, previewGrid, items]);

  return (
    <div className="spa-root relative">
      <ScrollProgress />
      <SectionNav />

      {/* Dual WebGL atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {webglOn ? (
          <>
            <AuroraField intensity={1} />
            <PrismField intensity={0.7} className="mix-blend-screen opacity-90" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(253,164,175,0.25),transparent_55%),radial-gradient(ellipse_at_70%_80%,rgba(196,181,253,0.2),transparent_50%)]" />
        )}
        <div className="noise-overlay absolute inset-0 opacity-[0.04] mix-blend-overlay dark:opacity-[0.07]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_0%,_var(--background)_75%)]" />
      </div>

      {/* ── 01 HERO ── */}
      <section
        id="hero"
        ref={heroRef}
        className="relative z-10 flex min-h-[100svh] items-center justify-center overflow-hidden"
      >
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 flex items-center justify-center p-0 md:p-4"
        >
          <div className="relative h-full w-full overflow-hidden border border-white/10 shadow-2xl shadow-rose-500/15 md:h-auto md:max-h-[min(90svh,880px)] md:max-w-[min(100%,1400px)] md:rounded-[2rem] md:aspect-[16/9]">
            <HeroCarousel
              mobileImages={mobileHeroImages}
              desktopImages={desktopHeroImages}
              interval={6500}
            />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/55 via-black/10 to-transparent to-55%" />
          </div>
        </motion.div>

        <div className="pointer-events-none relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col items-end justify-end px-4 pb-5 pt-24 md:pb-7 md:pt-16">
          <motion.div
            style={{ y: titleY }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md text-right"
          >
            <h1 className="hero-caption-title font-display text-[clamp(2.1rem,5.5vw,3.5rem)] font-medium leading-[1.05] text-white">
              Cute{" "}
              <span className="bg-gradient-to-r from-rose-100 via-white to-fuchsia-200 bg-clip-text text-transparent">
                Asuka
              </span>
            </h1>
            <p className="hero-caption-title mt-2 font-display text-base text-white/90 md:text-lg">
              齋藤飛鳥 · 表情包光年
            </p>
            <div className="pointer-events-auto mt-6 flex flex-wrap items-center justify-end gap-3">
              <a href="#archive" className="btn-glass-primary">
                浏览馆藏
              </a>
              <a href="#manifesto" className="btn-glass">
                阅读叙事
              </a>
              <a href="#daily" className="btn-glass">
                今日一图
              </a>
            </div>
            <div className="pointer-events-auto mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setWebglOn((v) => !v)}
                className="text-[10px] tracking-[0.2em] text-white/50 underline-offset-4 hover:text-white/80 hover:underline"
              >
                {webglOn ? "关闭 WebGL 光场" : "开启 WebGL 光场"}
              </button>
            </div>
          </motion.div>
          <p className="mt-4 hidden w-full text-center text-[10px] tracking-[0.35em] text-white/45 md:block">
            SCROLL
          </p>
        </div>
      </section>

      {/* ── 02 MANIFESTO ── */}
      <section
        id="manifesto"
        className="spa-section relative z-10 mx-auto max-w-6xl px-4 py-20 md:py-28"
      >
        <div className="mb-12 md:mb-16 md:flex md:items-end md:justify-between">
          <div>
            <p className="type-kicker text-muted-foreground">02 — MANIFESTO</p>
            <h2 className="font-display mt-2 text-3xl md:text-5xl">信息即情绪</h2>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground md:mt-0 md:text-right">
            不是堆砌特效的清单页，而是一条可读的展览动线——从光到帧到日。
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {chapters.map((c, i) => (
            <motion.article
              key={c.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="glass-panel group relative overflow-hidden p-6 md:p-8"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-rose-300/15 blur-2xl transition group-hover:bg-rose-300/30" />
              <p className="text-[10px] tracking-[0.3em] text-accent">{c.n}</p>
              <h3 className="font-display mt-3 text-xl md:text-2xl">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {c.body}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── 03 ARCHIVE STATS + PREVIEW ── */}
      <section
        id="archive"
        className="spa-section relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24"
      >
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="type-kicker text-muted-foreground">03 — ARCHIVE</p>
            <h2 className="font-display mt-2 text-3xl md:text-5xl">馆藏切片</h2>
          </div>
          <Link
            href="/gallery"
            className="text-xs tracking-[0.2em] text-accent hover:brightness-110"
          >
            完整画廊 →
          </Link>
        </div>

        <div className="glass-panel mb-10 overflow-hidden">
          <div className="grid divide-y divide-border/50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { label: "GIF 动态", value: stats.gif, hint: "动起来的飞鸟" },
              { label: "高清静态", value: stats.static, hint: "定格侧脸" },
              { label: "馆藏总计", value: stats.total, hint: "持续收集" },
            ].map((s) => (
              <div key={s.label} className="px-6 py-10 text-center">
                <p className="font-display text-5xl md:text-6xl">
                  {ready ? (
                    <CountUp value={s.value} suffix="+" />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </p>
                <p className="mt-2 text-xs tracking-[0.2em]">{s.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {previewGrid.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              onClick={() => setSelected(item)}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-card text-left"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width:768px) 50vw, 25vw"
                loading="lazy"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-2 left-2 text-[10px] tracking-wider text-white/90">
                {formatFrameId(item.id)}
              </span>
            </motion.button>
          ))}
        </div>
        {!ready && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            加载馆藏…
          </p>
        )}
      </section>

      {/* ── 04 FILM ── */}
      <section id="film" className="spa-section relative z-10 py-16 md:py-20">
        <div className="mx-auto mb-6 max-w-6xl px-4">
          <p className="type-kicker text-muted-foreground">04 — FILM ROLL</p>
          <h2 className="font-display mt-2 text-2xl md:text-4xl">胶片在滑动</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {ready
              ? `全部 ${staticStrip.length} 张静态馆藏 · 无限双轨`
              : "加载中…"}
          </p>
        </div>
        {staticStrip.length > 0 ? (
          <>
            <FilmStrip images={staticStrip} speed="med" />
            <FilmStrip
              images={[...staticStrip].reverse()}
              speed="slow"
              reverse
            />
          </>
        ) : null}
      </section>

      {/* ── 05 DAILY ── */}
      <section
        id="daily"
        className="spa-section relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24"
      >
        <p className="type-kicker text-muted-foreground">05 — DAILY RITUAL</p>
        <h2 className="font-display mt-2 text-3xl md:text-5xl">今日一帧</h2>
        <p className="mt-2 text-sm text-muted-foreground">{todayLabel()}</p>

        {daily ? (
          <div className="mt-10 grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-stretch">
            <div className="relative min-h-[320px] overflow-hidden rounded-[1.75rem] border border-border/60 shadow-xl md:min-h-[480px]">
              <Image
                src={daily.src}
                alt={daily.title}
                fill
                className="object-cover object-top"
                sizes="(max-width:768px) 100vw, 55vw"
                unoptimized
              />
              <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/30 px-3 py-1 text-[10px] tracking-[0.28em] text-white backdrop-blur">
                TODAY · {formatFrameId(daily.id)}
              </div>
            </div>
            <div className="glass-panel flex flex-col justify-between p-6 md:p-8">
              <div>
                <h3 className="font-display text-3xl">{daily.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  日期种子对齐馆藏文件排序。同一天刷新仍是这一张；完整画廊可继续下钻。
                </p>
                <p className="mt-4 font-mono text-[11px] text-muted-foreground">
                  {daily.file}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                <a href={daily.src} download className="btn-glass-primary text-xs">
                  下载今日帧
                </a>
                <Link
                  href={`/gallery/${daily.id}`}
                  className="btn-glass-solid text-xs"
                >
                  打开详情
                </Link>
                <Link href="/daily" className="btn-glass-solid text-xs">
                  Daily 页
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-10 text-sm text-muted-foreground">准备今日帧…</p>
        )}
      </section>

      {/* ── 06 EXPLORE ── */}
      <section
        id="explore"
        className="spa-section relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24"
      >
        <p className="type-kicker text-muted-foreground">06 — PORTALS</p>
        <h2 className="font-display mt-2 text-3xl md:text-5xl">深链入口</h2>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          单页讲完故事；完整交互仍在独立路由（画廊筛选、详情留言等）。
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              href: "/gallery",
              t: "Gallery",
              d: "分类、搜索、Lightbox、全部详情",
            },
            {
              href: "/daily",
              t: "Daily",
              d: "独立页的今日仪式与档案字段",
            },
            {
              href: "/about",
              t: "About",
              d: "设计宣言与开源说明",
            },
          ].map((p, i) => (
            <Link
              key={p.href}
              href={p.href}
              className="glass-panel block p-6 transition hover:border-rose-300/40"
            >
              <p className="text-[10px] tracking-[0.28em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display mt-2 text-2xl">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
              <span className="mt-4 inline-block text-xs tracking-[0.2em] text-foreground/70">
                OPEN →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 07 CLOSE ── */}
      <section
        id="close"
        className="spa-section relative z-10 mx-auto max-w-6xl px-4 pb-28 pt-10"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-rose-200/40 bg-gradient-to-br from-rose-100/80 via-fuchsia-50/40 to-amber-50/50 px-6 py-16 text-center dark:border-rose-900/40 dark:from-rose-950/50 dark:via-fuchsia-950/30 dark:to-amber-950/20 md:px-12 md:py-20">
          {webglOn && (
            <div className="pointer-events-none absolute inset-0 opacity-50">
              <AuroraField intensity={0.75} />
              <PrismField intensity={0.5} />
            </div>
          )}
          <div className="relative">
            <p className="type-kicker text-muted-foreground">07 — NEXT FRAME</p>
            <h2 className="font-display mt-3 text-3xl md:text-5xl">
              准备好下一张表情了吗？
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
              双层 WebGL 光场 · 滚动叙事 · 真实馆藏 · 静态导出可部署
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/gallery" className="btn-glass-primary">
                前往 Gallery
              </Link>
              <a href="#hero" className="btn-glass-solid">
                回到顶部
              </a>
              <a
                href="https://github.com/16Miku/cute-asuka"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass-solid"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {selected && (
        <Lightbox
          item={selected}
          items={previewGrid.length ? previewGrid : items}
          onClose={() => setSelected(null)}
          onChange={setSelected}
        />
      )}
    </div>
  );
}
