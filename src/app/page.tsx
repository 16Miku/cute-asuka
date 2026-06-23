"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const heroImages = [
  "/images/hero-1.jpg",
  "/images/hero-2.jpg",
  "/images/hero-3.jpg",
];

const highlights = [
  { label: "表情包画廊", href: "/gallery", desc: "可爱静态 / 动态一网打尽" },
  { label: "每日表情", href: "/daily", desc: "每天一张随机惊喜" },
  { label: "关于项目", href: "/about", desc: "喜欢的力量与分享的快乐" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-cover.jpg"
            alt="cover"
            fill
            priority
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold tracking-widest text-white md:text-6xl"
          >
            CUTE ASUKA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base"
          >
            乃木坂风格的可爱表情包小站。收集那些让心跳漏了一拍的瞬间，
            化作可保存、可分享的表情包。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            {highlights.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm tracking-widest text-white backdrop-blur transition hover:bg-white/20"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="aspect-[4/3] w-full bg-muted" />
              <div className="p-5">
                <h3 className="text-base font-semibold tracking-wide">
                  {item.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
