"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryItem } from "@/lib/gallery";
import { formatFrameId } from "@/lib/gallery";

type Props = {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onChange: (item: GalleryItem) => void;
};

export default function Lightbox({ item, items, onClose, onChange }: Props) {
  if (!item) return null;

  const idx = items.findIndex((i) => i.id === item.id);
  const go = (dir: -1 | 1) => {
    if (!items.length || idx < 0) return;
    const next = items[(idx + dir + items.length) % items.length];
    onChange(next);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="lb-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_oklab,#0a0608_78%,transparent)] p-3 backdrop-blur-md md:p-6"
        onClick={onClose}
        role="dialog"
        aria-modal
        aria-label={item.title}
      >
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 340, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.75rem] border border-white/15 bg-[color-mix(in_oklab,var(--card)_92%,transparent)] shadow-2xl"
        >
          <div className="relative flex min-h-[40vh] flex-1 items-center justify-center bg-black/40">
            <Image
              src={item.src}
              alt={item.title}
              width={1400}
              height={1400}
              className="max-h-[68vh] w-auto object-contain"
              priority
              unoptimized
            />
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-black/35 p-2.5 text-white backdrop-blur hover:bg-black/50"
                  aria-label="上一张"
                >
                  <Chevron dir="left" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-black/35 p-2.5 text-white backdrop-blur hover:bg-black/50"
                  aria-label="下一张"
                >
                  <Chevron dir="right" />
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-border/60 bg-background/85 px-5 py-4 backdrop-blur-md md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] tracking-[0.28em] text-muted-foreground">
                {formatFrameId(item.id)} · {item.cat.replace("表情包", "")} ·{" "}
                {idx + 1}/{items.length}
              </p>
              <p className="font-display mt-1 text-xl">{item.title}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                ← → 切换 · ESC 关闭
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/gallery/${item.id}`}
                className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-accent"
              >
                详情页
              </Link>
              <button
                type="button"
                className="rounded-full border border-border px-3 py-1.5 text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/gallery/${item.id}`
                  );
                }}
              >
                复制链接
              </button>
              <a
                href={item.src}
                download
                className="rounded-full bg-gradient-to-r from-rose-300 to-fuchsia-300 px-4 py-1.5 text-xs font-medium text-[#4a2a36]"
              >
                下载
              </a>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border px-3 py-1.5 text-xs"
              >
                关闭
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={dir === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  );
}
