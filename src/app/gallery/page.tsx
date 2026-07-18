"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, LayoutGroup } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/effects/PageShell";
import PageHeader from "@/components/effects/PageHeader";
import Lightbox from "@/components/Lightbox";
import {
  GALLERY_CATEGORIES,
  filesToItems,
  formatFrameId,
  type GalleryCategoryFilter,
  type GalleryItem,
} from "@/lib/gallery";

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [active, setActive] =
    useState<GalleryCategoryFilter>("所有表情包");
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchImages = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    fetch("/api/images", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("无法加载图片列表");
        return res.json() as Promise<string[]>;
      })
      .then((files) => setItems(filesToItems(files)))
      .catch(() => {
        setLoadError("加载图片失败，请稍后重试");
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const filtered = useMemo(() => {
    const byCat =
      active === "所有表情包"
        ? items
        : items.filter((i) => i.cat === active);
    const q = query.trim().toLowerCase();
    if (!q) return byCat;
    return byCat.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.cat.toLowerCase().includes(q) ||
        i.file.toLowerCase().includes(q)
    );
  }, [items, active, query]);

  const counts = useMemo(
    () => ({
      all: items.length,
      static: items.filter((i) => i.cat === "静态表情包").length,
      gif: items.filter((i) => i.cat === "动态表情包").length,
    }),
    [items]
  );

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
        return;
      }
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      if (!filtered.length) return;
      const idx = filtered.findIndex((i) => i.id === selected.id);
      if (idx < 0) return;
      const next =
        e.key === "ArrowRight"
          ? filtered[(idx + 1) % filtered.length]
          : filtered[(idx - 1 + filtered.length) % filtered.length];
      setSelected(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, filtered]);

  return (
    <PageShell intensity={0.38}>
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 md:pt-14">
        <PageHeader
          kicker="ARCHIVE · GALLERY"
          title="画廊"
          subtitle="真实馆藏一览。点选预览，或进入详情页下载与留言。"
          action={
            <div className="glass-panel flex gap-5 px-5 py-3.5 text-center">
              <Stat n={counts.all} label="全部" />
              <Stat n={counts.static} label="静态" />
              <Stat n={counts.gif} label="GIF" />
            </div>
          }
        />

        {/* Sticky filter bar */}
        <div className="sticky top-[3.25rem] z-20 -mx-4 mt-8 border-y border-border/40 bg-background/75 px-4 py-3 backdrop-blur-xl md:mx-0 md:rounded-2xl md:border md:border-border/50">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  className={
                    "rounded-full px-3.5 py-1.5 text-xs tracking-wide transition " +
                    (active === cat
                      ? "bg-gradient-to-r from-rose-300 to-fuchsia-300 font-medium text-[#4a2a36] shadow-md shadow-rose-200/30"
                      : "border border-border/70 bg-background/40 hover:border-accent/60")
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <p className="hidden text-[11px] text-muted-foreground sm:block">
                显示 {filtered.length} 帧
              </p>
              <label className="relative block w-full md:w-64">
                <span className="sr-only">搜索</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索标题 / 文件名…"
                  className="w-full rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm outline-none ring-accent/35 focus:ring-2"
                />
              </label>
            </div>
          </div>
        </div>

        {loadError ? (
          <div className="glass-panel mt-10 p-12 text-center text-sm text-muted-foreground">
            {loadError}
            <button
              type="button"
              onClick={fetchImages}
              className="btn-glass-solid mt-4"
            >
              重试
            </button>
          </div>
        ) : loading ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 9 }).map((_, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-[1.25rem] border border-border/50"
              >
                <div
                  className={`animate-pulse bg-muted/80 ${
                    idx % 5 === 0 ? "aspect-[3/4]" : "aspect-square"
                  }`}
                />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel mt-10 p-12 text-center text-sm text-muted-foreground">
            没有匹配结果。换个分类或关键词试试。
          </div>
        ) : (
          <LayoutGroup>
            <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {filtered.map((item, i) => {
                const featured = i % 7 === 0;
                return (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.015, 0.35) }}
                    className="group mb-4 break-inside-avoid overflow-hidden rounded-[1.25rem] border border-border/55 bg-card/60 shadow-sm backdrop-blur-sm transition hover:border-rose-300/45 hover:shadow-lg hover:shadow-rose-200/15"
                  >
                    <button
                      type="button"
                      onClick={() => setSelected(item)}
                      className="relative block w-full text-left"
                    >
                      <div
                        className={`relative w-full overflow-hidden bg-muted ${
                          featured ? "aspect-[3/4]" : "aspect-square"
                        }`}
                      >
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                          unoptimized
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />
                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5">
                          <div>
                            <p className="text-[10px] tracking-[0.2em] text-white/70">
                              {formatFrameId(item.id)}
                            </p>
                            <p className="font-display text-base text-white md:text-lg">
                              {item.title}
                            </p>
                          </div>
                          <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur">
                            {item.cat === "动态表情包" ? "GIF" : "静"}
                          </span>
                        </div>
                      </div>
                    </button>
                    <div className="flex items-center justify-between px-3.5 py-2.5">
                      <button
                        type="button"
                        onClick={() => setSelected(item)}
                        className="text-[11px] tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
                      >
                        预览
                      </button>
                      <Link
                        href={`/gallery/${item.id}`}
                        className="text-[11px] tracking-[0.18em] text-accent transition hover:brightness-110"
                      >
                        详情 →
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </LayoutGroup>
        )}

        {selected && (
          <Lightbox
            item={selected}
            items={filtered}
            onClose={() => setSelected(null)}
            onChange={setSelected}
          />
        )}
      </div>
    </PageShell>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <p className="font-display text-xl tabular-nums md:text-2xl">{n}</p>
      <p className="text-[10px] tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
