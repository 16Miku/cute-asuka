"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import CommentBoard from "@/components/CommentBoard";
import Link from "next/link";
import PageShell from "@/components/effects/PageShell";

const items = [
  {
    id: 1,
    title: "元气微笑",
    src: "/images/gallery-1.jpg",
    tags: ["经典", "静态"],
    date: "2026-01-01",
    description: "最经典的元气微笑，永远是心里的白月光。",
  },
  {
    id: 2,
    title: "cuteness overload",
    src: "/images/gallery-2.jpg",
    tags: ["经典", "静态"],
    date: "2026-02-15",
    description: "可爱到溢出来，让人想立刻保存。",
  },
  {
    id: 3,
    title: "害羞 wink",
    src: "/images/gallery-3.jpg",
    tags: ["动态", "公会"],
    date: "2026-03-10",
    description: "一个 wink 把周围空气变成粉红色。",
  },
  {
    id: 4,
    title: "舞台定格",
    src: "/images/gallery-4.jpg",
    tags: ["舞台", "演唱会"],
    date: "2026-04-05",
    description: "聚光灯下的定格，温柔而坚定。",
  },
  {
    id: 5,
    title: "后台絮语",
    src: "/images/gallery-5.jpg",
    tags: ["后台", "生活"],
    date: "2026-05-20",
    description: "卸下妆容后的放松表情，最真实的可爱。",
  },
  {
    id: 6,
    title: "综艺梗图",
    src: "/images/gallery-6.jpg",
    tags: ["综艺", "搞笑"],
    date: "2026-06-01",
    description: "综艺里自然冒出的梗，成了粉丝们的圣经。",
  },
];

export default function GalleryDetail() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const item = items.find((it) => it.id === Number(id));

  if (!item) return notFound();

  const hasPrev = Number(id) > 1;
  const hasNext = Number(id) < items.length;

  return (
    <PageShell intensity={0.5}>
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.28em] text-muted-foreground">
              FEATURED · #{item.id.toString().padStart(3, "0")} · {item.date}
            </p>
            <h1 className="font-display mt-2 text-3xl md:text-5xl">
              {item.title}
            </h1>
          </div>
          <Link
            href="/gallery"
            className="text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            ← 返回画廊
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-xl"
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="glass-panel flex flex-col justify-between p-6 md:p-8"
          >
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/80 bg-background/50 px-3 py-1 text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex flex-wrap gap-2">
                <a
                  href={item.src}
                  download
                  className="rounded-full bg-gradient-to-r from-rose-300 to-fuchsia-300 px-4 py-2 text-xs font-medium text-[#4a2a36]"
                >
                  下载原图
                </a>
                <button
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

              <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs tracking-wide text-muted-foreground">
                <Link
                  href={`/gallery/${item.id - 1}`}
                  className={!hasPrev ? "invisible" : "hover:text-foreground"}
                >
                  ← 上一张
                </Link>
                <span>
                  {item.id} / {items.length}
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="mt-12"
        >
          <CommentBoard imageId={item.id} />
        </motion.div>
      </div>
    </PageShell>
  );
}
