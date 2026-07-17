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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    },
    []
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <AnimatePresence>
        {items.map((item, i) => (
          <motion.button
            layout
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.35) }}
            onClick={() => setSelected(item)}
            className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 text-left backdrop-blur-sm"
          >
            <div className="relative aspect-square w-full bg-muted">
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium">{item.title}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted/80 px-2 py-0.5 text-[10px] text-muted-foreground"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-card"
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
                  <p className="font-display text-lg">{selected.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {selected.date}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-full border border-border px-3 py-1.5 text-xs"
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
                    className="rounded-full bg-gradient-to-r from-rose-300 to-fuchsia-300 px-3 py-1.5 text-xs text-[#4a2a36]"
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
