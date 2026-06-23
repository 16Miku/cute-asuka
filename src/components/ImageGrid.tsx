"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Item = {
  id: number;
  title: string;
  src: string;
  tags: string[];
  date: string;
};

interface ImageGridProps {
  items: Item[];
}

export default function ImageGrid({ items }: ImageGridProps) {
  const [selected, setSelected] = useState<Item | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = useCallback((id: number) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  }, []);

  // ESC 鍵关闭 Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <AnimatePresence>
        {items.map((item) => (
          <motion.button
            layout
            key={item.id}
            onClick={() => setSelected(item)}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square w-full bg-muted"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-110"
                onLoad={() => handleImageLoad(item.id)}
                onError={() => handleImageLoad(item.id)}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
              />
            </motion.div>
            <div className="p-3">
              <p className="text-sm font-medium">{item.title}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl bg-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full bg-muted">
                <Image
                  src={selected.src}
                  alt={selected.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{selected.title}</p>
                  <p className="text-xs text-muted-foreground">{selected.date}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-full border border-border px-3 py-1.5 text-xs transition hover:bg-muted"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/gallery/${selected.id}`
                      );
                    }}
                  >
                    分享链接
                  </button>
                  <a
                    href={selected.src}
                    download
                    className="rounded-full bg-accent px-3 py-1.5 text-xs text-akane-foreground transition hover:brightness-110"
                  >
                    下载原图
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
