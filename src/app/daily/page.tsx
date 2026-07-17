"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/effects/PageShell";
import PageHeader from "@/components/effects/PageHeader";

type DailyItem = {
  name: string;
  src: string;
  title: string;
};

const titlePool = [
  "元气微笑",
  "cuteness overload",
  "害羞 wink",
  "舞台定格",
  "后台絮语",
  "综艺梗图",
  "闭眼笑",
  "歪头杀",
  "搞怪接力",
];

function pickDaily(files: string[]) {
  if (!files.length) return null;
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  const index = seed % files.length;
  const file = files[index];
  return {
    name: file,
    src: `/images/${file}`,
    title: titlePool[index % titlePool.length],
  };
}

function todayLabel() {
  return new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export default function Daily() {
  const [item, setItem] = useState<DailyItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetch("/api/images", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("无法加载今日表情包");
        return res.json() as Promise<string[]>;
      })
      .then((files) => setItem(pickDaily(files)))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "加载失败")
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/images", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("无法加载今日表情包");
        return res.json() as Promise<string[]>;
      })
      .then((files) => {
        if (!cancelled) setItem(pickDaily(files));
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "加载失败");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageShell intensity={0.7}>
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <PageHeader
          kicker="RITUAL · DAILY"
          title="每日一图"
          subtitle={`${todayLabel()} · 以日期为种子的今日之选，只为你停留二十四小时。`}
        />

        {loading ? (
          <div className="glass-panel mx-auto mt-12 max-w-3xl overflow-hidden">
            <div className="flex aspect-[4/5] w-full items-center justify-center bg-muted/50 text-sm text-muted-foreground md:aspect-square">
              <span className="animate-pulse tracking-[0.3em]">DEVELOPING…</span>
            </div>
          </div>
        ) : error ? (
          <div className="glass-panel mx-auto mt-12 max-w-3xl p-10 text-center text-sm text-muted-foreground">
            {error}
            <button type="button" onClick={load} className="btn-glass-solid mt-4">
              重试
            </button>
          </div>
        ) : item ? (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-stretch"
          >
            <div className="group relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card shadow-2xl shadow-rose-200/20 dark:shadow-none">
              <div className="relative aspect-[4/5] w-full bg-muted md:aspect-auto md:min-h-[520px]">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-1000 group-hover:scale-[1.03]"
                  priority
                  sizes="(max-width: 768px) 100vw, 55vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] tracking-[0.28em] text-white backdrop-blur">
                  TODAY
                </div>
              </div>
            </div>

            <div className="glass-panel flex flex-col justify-between p-6 md:p-8">
              <div>
                <p className="text-[11px] tracking-[0.28em] text-accent">
                  FRAME OF THE DAY
                </p>
                <h2 className="font-display mt-3 text-3xl md:text-4xl">
                  {item.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  不是随机噪音，而是日历与馆藏的温柔对齐。明天会换一帧；今天，请收下这一张。
                </p>
                <dl className="mt-8 space-y-3 text-sm">
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">种子算法</dt>
                    <dd>YYYYMMDD % N</dd>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">文件</dt>
                    <dd className="max-w-[55%] truncate font-mono text-xs">
                      {item.name}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">更新节奏</dt>
                    <dd>每日 00:00</dd>
                  </div>
                </dl>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                <a
                  href={item.src}
                  download
                  className="rounded-full bg-gradient-to-r from-rose-300 to-fuchsia-300 px-5 py-2.5 text-xs font-medium tracking-wide text-[#4a2a36]"
                >
                  下载今日帧
                </a>
                <Link href="/gallery" className="btn-glass-solid text-xs">
                  浏览全部馆藏
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </PageShell>
  );
}
