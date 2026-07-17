"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Image from "next/image";
import PageShell from "@/components/effects/PageShell";
import PageHeader from "@/components/effects/PageHeader";

type Item = { id: number; title: string; cat: string; src: string };

const categories = ["所有表情包", "静态表情包", "动态表情包"] as const;

export default function Gallery() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<(typeof categories)[number]>("所有表情包");
  const [selected, setSelected] = useState<Item | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchImages = useCallback(() => {
    const base = "/images/";
    setLoading(true);
    setLoadError(null);
    fetch("/api/images", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("无法加载图片列表");
        return res.json() as Promise<string[]>;
      })
      .then((files) => {
        if (files.length === 0) {
          setItems([]);
          return;
        }
        setItems(
          files.map((file, index) => {
            const ext = file.split(".").pop()?.toLowerCase() || "";
            const isStatic = ["jpg", "jpeg", "png", "webp"].includes(ext);
            const isDynamic = ["gif"].includes(ext);
            const cat = isStatic
              ? "静态表情包"
              : isDynamic
                ? "动态表情包"
                : "静态表情包";
            return {
              id: index + 1,
              title: getTitle(file),
              cat,
              src: base + file,
            };
          })
        );
      })
      .catch(() => {
        setLoadError("加载图片失败，请稍后重试");
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  function getTitle(file: string): string {
    const name = file.replace(/\.[^/.]+$/, "");
    if (name.startsWith("QQ") || name.startsWith("QQ截图")) return "收藏截图";
    if (name.startsWith("Snipaste")) return "精选截图";
    if (name.startsWith("{") && name.endsWith("}")) return "动态特写";
    if (/^\d+$/.test(name.substring(0, 8))) return name.substring(0, 8) + "…";
    if (name.length > 12) return name.substring(0, 12) + "…";
    return name || "表情包";
  }

  const filtered = useMemo(() => {
    const byCat =
      active === "所有表情包" ? items : items.filter((i) => i.cat === active);
    const q = query.trim().toLowerCase();
    if (!q) return byCat;
    return byCat.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.cat.toLowerCase().includes(q) ||
        i.src.toLowerCase().includes(q)
    );
  }, [items, active, query]);

  const counts = useMemo(() => {
    return {
      all: items.length,
      static: items.filter((i) => i.cat === "静态表情包").length,
      gif: items.filter((i) => i.cat === "动态表情包").length,
    };
  }, [items]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
        return;
      }
      if (!selected) return;
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
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, filtered]);

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <PageHeader
          kicker="ARCHIVE · GALLERY"
          title="画廊"
          subtitle="分类、搜索、Lightbox 预览与下载。键盘 ← → 切换，ESC 关闭。"
          action={
            <div className="glass-panel flex gap-4 px-4 py-3 text-center text-xs">
              <div>
                <p className="font-display text-lg">{counts.all}</p>
                <p className="text-muted-foreground">全部</p>
              </div>
              <div>
                <p className="font-display text-lg">{counts.static}</p>
                <p className="text-muted-foreground">静态</p>
              </div>
              <div>
                <p className="font-display text-lg">{counts.gif}</p>
                <p className="text-muted-foreground">GIF</p>
              </div>
            </div>
          }
        />

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={
                  "rounded-full border px-3.5 py-1.5 text-xs tracking-wide transition " +
                  (active === cat
                    ? "border-transparent bg-gradient-to-r from-rose-300 to-fuchsia-300 text-[#4a2a36] shadow-md shadow-rose-200/40"
                    : "border-border/80 bg-background/50 backdrop-blur hover:border-accent")
                }
              >
                {cat}
              </button>
            ))}
          </div>
          <label className="relative block w-full md:w-72">
            <span className="sr-only">搜索</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索标题 / 分类…"
              className="w-full rounded-full border border-border/80 bg-background/60 px-4 py-2 text-sm backdrop-blur outline-none ring-accent/40 focus:ring-2"
            />
          </label>
        </div>

        {loadError ? (
          <div className="glass-panel mt-10 p-10 text-center text-sm text-muted-foreground">
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
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="glass-panel overflow-hidden">
                <div className="aspect-square w-full animate-pulse bg-muted/80" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="h-3 w-1/3 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel mt-10 p-10 text-center text-sm text-muted-foreground">
            没有匹配结果，试试别的分类或关键词。
          </div>
        ) : (
          <LayoutGroup>
            <div className="mt-10 columns-1 gap-4 sm:columns-2 md:columns-3">
              {filtered.map((item, i) => (
                <motion.button
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.4) }}
                  onClick={() => setSelected(item)}
                  className="group mb-4 w-full break-inside-avoid overflow-hidden rounded-2xl border border-border/70 bg-card/70 text-left shadow-sm backdrop-blur-sm transition hover:border-rose-300/50 hover:shadow-lg hover:shadow-rose-200/20"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-muted">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                    <span className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-white/15 px-2 py-0.5 text-[10px] tracking-wider text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                      OPEN
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-[10px] tracking-wide text-muted-foreground">
                      {item.cat.replace("表情包", "")}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </LayoutGroup>
        )}

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
              onClick={() => setSelected(null)}
              role="dialog"
              aria-modal
              aria-label={selected.title}
            >
              <motion.div
                initial={{ scale: 0.94, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[88vh] max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-card/95 shadow-2xl"
              >
                <Image
                  src={selected.src}
                  alt={selected.title}
                  width={1400}
                  height={1400}
                  className="max-h-[72vh] w-auto object-contain"
                  priority
                />
                <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-background/80 px-5 py-4 backdrop-blur">
                  <div>
                    <p className="font-display text-lg">{selected.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {selected.cat} · ← → 切换 · ESC 关闭
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-full border border-border px-3 py-1.5 text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}${selected.src}`
                        );
                      }}
                    >
                      复制链接
                    </button>
                    <button
                      className="rounded-full bg-gradient-to-r from-rose-300 to-fuchsia-300 px-4 py-1.5 text-xs font-medium text-[#4a2a36]"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = selected.src;
                        a.download = `cute-asuka-${selected.id}`;
                        a.click();
                      }}
                    >
                      下载
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
