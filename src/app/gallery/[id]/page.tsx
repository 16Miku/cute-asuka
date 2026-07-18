"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import CommentBoard from "@/components/CommentBoard";
import PageShell from "@/components/effects/PageShell";
import {
  filesToItems,
  formatFrameId,
  type GalleryItem,
} from "@/lib/gallery";

export default function GalleryDetail() {
  const params = useParams();
  const id = Number(params?.id);
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/images", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("fail");
        return res.json() as Promise<string[]>;
      })
      .then((files) => setItems(filesToItems(files)))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <PageShell intensity={0.35}>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <p className="text-muted-foreground">无法加载馆藏</p>
          <Link href="/gallery" className="btn-glass-solid mt-4 inline-flex text-xs">
            返回画廊
          </Link>
        </div>
      </PageShell>
    );
  }

  if (!items) {
    return (
      <PageShell intensity={0.35}>
        <div className="mx-auto max-w-6xl px-4 py-24">
          <div className="glass-panel h-[50vh] animate-pulse" />
        </div>
      </PageShell>
    );
  }

  if (!Number.isFinite(id) || id < 1 || id > items.length) {
    return notFound();
  }

  const item = items[id - 1];
  const hasPrev = id > 1;
  const hasNext = id < items.length;

  return (
    <PageShell intensity={0.32}>
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="type-kicker text-muted-foreground">
              EXHIBIT · {formatFrameId(item.id)} · {item.ext.toUpperCase()}
            </p>
            <h1 className="font-display type-display mt-2 text-3xl md:text-5xl">
              {item.title}
            </h1>
            <p className="type-body mt-2 text-muted-foreground">
              {item.cat} · 馆藏 {id} / {items.length}
            </p>
          </div>
          <Link
            href="/gallery"
            className="type-kicker text-muted-foreground transition hover:text-foreground"
          >
            ← 返回画廊
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-border/60 bg-muted shadow-2xl shadow-rose-200/15 dark:shadow-none lg:col-span-7 lg:aspect-auto lg:min-h-[560px]"
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              unoptimized
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/25 px-3 py-1 text-[10px] tracking-[0.28em] text-white backdrop-blur">
              {item.cat === "动态表情包" ? "GIF" : "STILL"}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="glass-panel flex flex-col justify-between p-6 md:p-8 lg:col-span-5"
          >
            <div>
              <p className="type-kicker text-accent">FRAME NOTES</p>
              <p className="type-body mt-4 leading-relaxed text-muted-foreground">
                来自馆藏档案的真实文件。可预览、下载，或留下一句喜欢。
                上一张 / 下一张按文件名排序浏览。
              </p>
              <dl className="mt-8 space-y-3 text-sm">
                <Row label="编号" value={formatFrameId(item.id)} />
                <Row label="分类" value={item.cat} />
                <Row
                  label="文件"
                  value={item.file}
                  mono
                />
              </dl>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex flex-wrap gap-2">
                <a
                  href={item.src}
                  download
                  className="rounded-full bg-gradient-to-r from-rose-300 to-fuchsia-300 px-5 py-2.5 text-xs font-medium tracking-wide text-[#4a2a36]"
                >
                  下载原图
                </a>
                <button
                  type="button"
                  className="btn-glass-solid text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/gallery/${item.id}`
                    );
                  }}
                >
                  复制分享链接
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-4 text-xs tracking-wide text-muted-foreground">
                <Link
                  href={`/gallery/${item.id - 1}`}
                  className={!hasPrev ? "invisible" : "hover:text-foreground"}
                >
                  ← 上一张
                </Link>
                <span className="tabular-nums">
                  {id} / {items.length}
                </span>
                <Link
                  href={`/gallery/${item.id + 1}`}
                  className={!hasNext ? "invisible" : "hover:text-foreground"}
                >
                  下一张 →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-12"
        >
          <CommentBoard imageId={item.id} />
        </motion.div>
      </div>
    </PageShell>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-2">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd
        className={`text-right ${mono ? "max-w-[65%] truncate font-mono text-[11px]" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
