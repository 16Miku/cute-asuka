"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/effects/PageShell";
import PageHeader from "@/components/effects/PageHeader";
import {
  formatFrameId,
  pickDailyItem,
  todayLabel,
  type GalleryItem,
} from "@/lib/gallery";

export default function Daily() {
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    setRevealed(false);
    fetch("/api/images", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("无法加载今日表情包");
        return res.json() as Promise<string[]>;
      })
      .then((files) => {
        setTotal(files.length);
        setItem(pickDailyItem(files));
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "加载失败")
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!item || loading) return;
    const t = window.setTimeout(() => setRevealed(true), 80);
    return () => window.clearTimeout(t);
  }, [item, loading]);

  const seed =
    new Date().getFullYear() * 10000 +
    (new Date().getMonth() + 1) * 100 +
    new Date().getDate();

  return (
    <PageShell intensity={0.42}>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 md:pt-14">
        <PageHeader
          kicker="RITUAL · DAILY"
          title="每日一图"
          subtitle={`${todayLabel()} · 日期种子对齐馆藏，今日只展出这一帧。`}
        />

        {loading ? (
          <div className="mx-auto mt-12 max-w-5xl">
            <div className="glass-panel overflow-hidden">
              <div className="flex aspect-[4/5] items-center justify-center md:aspect-[16/10]">
                <p className="type-kicker animate-pulse text-muted-foreground">
                  DEVELOPING FRAME…
                </p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="glass-panel mx-auto mt-12 max-w-xl p-12 text-center text-sm text-muted-foreground">
            {error}
            <button type="button" onClick={load} className="btn-glass-solid mt-4">
              重试
            </button>
          </div>
        ) : item ? (
          <div className="mx-auto mt-12 max-w-5xl">
            {/* Film sprocket strip */}
            <div className="film-edge mb-3 hidden items-center justify-between px-1 md:flex">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="film-hole" />
              ))}
            </div>

            <div className="grid items-stretch gap-5 md:grid-cols-[1.15fr_0.85fr] md:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: revealed ? 1 : 0.4, y: revealed ? 0 : 12 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card shadow-2xl shadow-rose-300/20 dark:shadow-none"
              >
                <div className="relative aspect-[4/5] w-full md:aspect-auto md:min-h-[min(72vh,640px)]">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.025]"
                    priority
                    sizes="(max-width: 768px) 100vw, 55vw"
                    unoptimized
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                  <div className="absolute left-4 top-4 flex flex-col gap-2">
                    <span className="w-fit rounded-full border border-white/35 bg-black/30 px-3 py-1 text-[10px] tracking-[0.32em] text-white backdrop-blur-md">
                      TODAY
                    </span>
                    <span className="w-fit rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[10px] text-white/90 backdrop-blur">
                      {formatFrameId(item.id)}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <p className="font-display text-2xl text-white md:text-3xl">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-white/75">
                      {item.cat} · 自 {total} 帧馆藏中选出
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.aside
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.55 }}
                className="glass-panel flex flex-col justify-between p-6 md:p-8"
              >
                <div>
                  <p className="type-kicker text-accent">FRAME OF THE DAY</p>
                  <h2 className="font-display mt-3 text-3xl leading-tight md:text-4xl">
                    {item.title}
                  </h2>
                  <p className="type-body mt-4 leading-relaxed text-muted-foreground">
                    不是噪音随机，而是日历与档案的温柔对齐。明天会换一帧；今天，请收下这一张。
                  </p>

                  <dl className="mt-8 space-y-3 text-sm">
                    <Meta label="日期" value={todayLabel()} />
                    <Meta label="种子" value={String(seed)} mono />
                    <Meta label="算法" value="YYYYMMDD % N" mono />
                    <Meta label="文件" value={item.file} mono />
                    <Meta label="馆藏编号" value={formatFrameId(item.id)} />
                  </dl>
                </div>

                <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <a
                    href={item.src}
                    download
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-300 to-fuchsia-300 px-5 py-2.5 text-xs font-medium tracking-wide text-[#4a2a36]"
                  >
                    下载今日帧
                  </a>
                  <Link
                    href={`/gallery/${item.id}`}
                    className="btn-glass-solid inline-flex justify-center text-xs"
                  >
                    打开详情
                  </Link>
                  <Link
                    href="/gallery"
                    className="btn-glass-solid inline-flex justify-center text-xs"
                  >
                    浏览全部
                  </Link>
                </div>
              </motion.aside>
            </div>

            <div className="film-edge mt-3 hidden items-center justify-between px-1 md:flex">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="film-hole" />
              ))}
            </div>

            <p className="mt-8 text-center text-[11px] tracking-[0.2em] text-muted-foreground">
              明日 00:00 换帧 · 同一天刷新仍是这一张
            </p>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}

function Meta({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-2">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd
        className={`text-right ${mono ? "max-w-[62%] truncate font-mono text-[11px]" : "text-sm"}`}
      >
        {value}
      </dd>
    </div>
  );
}
