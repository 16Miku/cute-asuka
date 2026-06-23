"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const pool = [
  { id: 1, title: "元气表情", src: "/images/gallery-1.jpg" },
  { id: 2, title: "wink", src: "/images/gallery-2.jpg" },
  { id: 3, title: "舞台感", src: "/images/gallery-3.jpg" },
  { id: 4, title: "闭眼笑", src: "/images/gallery-4.jpg" },
  { id: 5, title: "歪头", src: "/images/gallery-5.jpg" },
  { id: 6, title: "搞怪", src: "/images/gallery-6.jpg" },
];

function pickDaily() {
  const today = new Date();
  const index =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  return pool[index % pool.length];
}

export default function Daily() {
  const [pick, setPick] = useState(pool[0]);

  useEffect(() => {
    setPick(pickDaily());
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-wider">DAILY CUTE</h1>
        <p className="text-sm text-muted-foreground">
          每天一张随机表情包，治愈你的心情
        </p>
      </div>

      <motion.div
        key={pick.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border border-border bg-card"
      >
        <div className="relative aspect-square w-full bg-muted">
          <Image
            src={pick.src}
            alt={pick.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-sm font-medium">{pick.title}</p>
            <p className="text-xs text-muted-foreground">
              每天更新 · 善用缓存可获得不同结果
            </p>
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            {pick.id.toString().padStart(3, "0")}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
