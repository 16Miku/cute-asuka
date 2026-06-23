"use client";

import { use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import CommentBoard from "@/components/CommentBoard";
import Link from "next/link";

const items = [
  {
    id: 1,
    title: "元气微笑",
    src: "/images/gallery-1.jpg",
    tags: ["经典", "静态"],
    date: "2026-01-01",
    description:
      "最经典的元气微笑，永远是心里的白月光。",
  },
  {
    id: 2,
    title: "cuteness overload",
    src: "/images/gallery-2.jpg",
    tags: ["经典", "静态"],
    date: "2026-02-15",
    description:
      "可爱到溢出来，让人想立刻保存。",
  },
  {
    id: 3,
    title: "害羞 wink",
    src: "/images/gallery-3.jpg",
    tags: ["动态", "公会"],
    date: "2026-03-10",
    description:
      "一个 wink 把周围空气变成粉红色。",
  },
  {
    id: 4,
    title: "舞台定格",
    src: "/images/gallery-4.jpg",
    tags: ["舞台", "演唱会"],
    date: "2026-04-05",
    description:
      "聚光灯下的定格，温柔而坚定。",
  },
  {
    id: 5,
    title: "后台絮语",
    src: "/images/gallery-5.jpg",
    tags: ["后台", "生活"],
    date: "2026-05-20",
    description:
      "卸下妆容后的放松表情，最真实的可爱。",
  },
  {
    id: 6,
    title: "综艺梗图",
    src: "/images/gallery-6.jpg",
    tags: ["综艺", "搞笑"],
    date: "2026-06-01",
    description:
      "综艺里自然冒出的梗，成了粉丝们的圣经。",
  },
];

export default function GalleryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const item = items.find((it) => it.id === Number(id));

  if (!item) return notFound();

  const hasPrev = Number(id) > 1;
  const hasNext = Number(id) < items.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            #{item.id.toString().padStart(3, "0")} · {item.date} ·{" "}
            {item.tags.join(" / ")}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-wider">
            {item.title}
          </h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card"
        >
          <Image
            src={item.src}
            alt={item.title}
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <a
              href={item.src}
              download
              className="rounded-full bg-accent px-3 py-1.5 text-xs text-akane-foreground"
            >
              下载原图
            </a>
            <button
              className="rounded-full border border-border px-3 py-1.5 text-xs"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/gallery/${item.id}`
                );
              }}
            >
              复制分享链接
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
            <Link
              href={`/gallery/${item.id - 1}`}
              className={!hasPrev ? "invisible" : ""}
            >
              ← 上一张
            </Link>
            <Link href="/gallery">返回画廊</Link>
            <Link
              href={`/gallery/${item.id + 1}`}
              className={!hasNext ? "invisible" : ""}
            >
              下一张 →
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12"
      >
        <CommentBoard imageId={item.id} />
      </motion.div>
    </div>
  );
}
