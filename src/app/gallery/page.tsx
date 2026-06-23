"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Item = { id: number; title: string; cat: string; src: string };

const categories = ["所有表情包", "静态表情包", "动态表情包"];

export default function Gallery() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState("所有表情包");
  const [selected, setSelected] = useState<Item | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ESC鍵關閉 Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const filtered =
    active === "所有表情包" ? items : items.filter((i) => i.cat === active);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-wider">GALLERY</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            按照分类浏览可爱表情包
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={
                "rounded-full border px-3 py-1.5 text-xs transition " +
                (active === cat
                  ? "border-accent bg-accent text-akane-foreground"
                  : "border-border hover:border-accent")
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loadError ? (
        <div className="mt-10 rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          {loadError}
          <button
            type="button"
            onClick={fetchImages}
            className="mt-4 rounded-full border border-border px-4 py-2 text-xs hover:border-accent"
          >
            重试
          </button>
        </div>
      ) : loading ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="aspect-square w-full animate-pulse bg-muted" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-3 w-1/3 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          暂无图片，请先放入 public/images
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((item) => (
            <motion.button
              key={item.id}
              layout
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelected(item)}
              className="group overflow-hidden rounded-2xl border border-border bg-card text-left"
            >
              <div className="relative aspect-square w-full bg-muted">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs text-muted-foreground">
                  {item.cat}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] max-w-3xl overflow-hidden rounded-2xl bg-card"
            >
              <Image
                src={selected.src}
                alt={selected.title}
                width={1200}
                height={1200}
                className="max-h-[85vh] w-auto object-contain"
                priority
              />
              <div className="absolute bottom-0 inset-x-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-5 py-4 text-white">
                <div>
                  <p className="text-sm font-medium">{selected.title}</p>
                  <p className="text-xs opacity-80">{selected.cat}</p>
                </div>
                <button
                  className="rounded-full border border-white/60 bg-white/10 px-4 py-1.5 text-xs backdrop-blur transition hover:bg-white/20"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = selected.src;
                    a.download = `cute-asuka-${selected.id}.jpg`;
                    a.click();
                  }}
                >
                  DOWNLOAD
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
