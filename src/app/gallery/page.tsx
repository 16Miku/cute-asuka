"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const categories = ["ALL", "经典", "动态", "舞台", "综艺", "后台"];

const items = [
  { id: 1, title: "元气微笑", cat: "经典", src: "/images/gallery-1.jpg" },
  { id: 2, title: "cuteness overload", cat: "经典", src: "/images/gallery-2.jpg" },
  { id: 3, title: "害羞 wink", cat: "动态", src: "/images/gallery-3.jpg" },
  { id: 4, title: "舞台定格", cat: "舞台", src: "/images/gallery-4.jpg" },
  { id: 5, title: "后台絮语", cat: "后台", src: "/images/gallery-5.jpg" },
  { id: 6, title: "综艺梗图", cat: "综艺", src: "/images/gallery-6.jpg" },
];

export default function Gallery() {
  const [active, setActive] = useState("ALL");
  const [selected, setSelected] = useState<(typeof items)[number] | null>(null);

  const filtered =
    active === "ALL" ? items : items.filter((i) => i.cat === active);

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
              />
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.cat}</span>
            </div>
          </motion.button>
        ))}
      </div>

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
              />
              <div className="absolute bottom-0 inset-x-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-5 py-4 text-white">
                <div>
                  <p className="text-sm font-medium">{selected.title}</p>
                  <p className="text-xs opacity-80">{selected.cat}</p>
                </div>
                <button
                  className="rounded-full border border-white/60 bg-white/10 px-4 py-1.5 text-xs backdrop-blur"
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
