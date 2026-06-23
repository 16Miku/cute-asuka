"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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
  if (!files.length) {
    return null;
  }
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

export default function Daily() {
  const [item, setItem] = useState<DailyItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/api/images", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("无法加载今日表情包");
        return res.json() as Promise<string[]>;
      })
      .then((files) => {
        if (cancelled) return;
        const picked = pickDaily(files);
        setItem(picked);
      })
      .catch((err) => {
        if (cancelled) return;
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
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-wider">DAILY CUTE</h1>
        <p className="text-sm text-muted-foreground">
          每天一张随机表情包，治愈你的心情
        </p>
      </div>

      {loading ? (
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border border-border bg-card">
          <div className="flex aspect-square w-full items-center justify-center bg-muted text-sm text-muted-foreground">
            正在准备今日惊喜...
          </div>
        </div>
      ) : error ? (
        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          {error}
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError(null);
              fetch("/api/images", { cache: "no-store" })
                .then((res) => res.json() as Promise<string[]>)
                .then((files) => setItem(pickDaily(files)!))
                .catch((err) =>
                  setError(err instanceof Error ? err.message : "加载失败")
                )
                .finally(() => setLoading(false));
            }}
            className="mt-4 rounded-full border border-border px-4 py-2 text-xs hover:border-accent"
          >
            重试
          </button>
        </div>
      ) : item ? (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border border-border bg-card"
        >
          <div className="relative aspect-square w-full bg-muted">
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                每天更新 · 基于当天日期自动挑选
              </p>
            </div>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              💖 DAILY
            </span>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
