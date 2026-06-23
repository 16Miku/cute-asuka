"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

type Feature = { title: string; desc: string; href: string; cover: string };

const stats = [
  { label: "GIF 动态表情", value: "111+" },
  { label: "高清静态图", value: "71+" },
  { label: "总计表情包", value: "205+" },
];

const features: Feature[] = [
  {
    title: "Gallery",
    desc: "浏览所有表情包，支持按静态 / 动态分类，一键预览与下载。",
    href: "/gallery",
    cover: "/images/1EE7B161F569BD20637D529E37840F1D.jpg",
  },
  {
    title: "Daily",
    desc: "每天随机推出一张治愈系表情，给你的日常加点糖。",
    href: "/daily",
    cover: "/images/0D4291F4BA750219AD4B85B438B8966E.jpg",
  },
  {
    title: "About",
    desc: "了解站点的设计理念：乃木坂风格，干净、克制、温柔。",
    href: "/about",
    cover: "/images/0D80C53FF8683DFAA86487E7E93CC263.jpg",
  },
];

export default function Home() {
  const [ready, setReady] = useState(false);
  const [highlight, setHighlight] = useState<string | null>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="relative min-h-screen">
      <section className="relative overflow-hidden rounded-b-[2.5rem]">
        <div className="absolute inset-0">
          {highlight && (
            <Image
              src={highlight}
              alt="hero"
              fill
              priority
              className="object-cover object-center"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-28 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 15 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold tracking-widest text-white md:text-6xl"
          >
            CUTE ASUKA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 15 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base"
          >
            乃木坂风格的可爱表情包小站。收集那些让心跳漏了一拍的瞬间，
            化作可保存、可分享的表情包。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 15 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            {features.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm tracking-widest text-white backdrop-blur transition hover:bg-white/20"
              >
                {item.title}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                <Image
                  src={item.cover}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-[10px] tracking-widest text-white backdrop-blur">
                  0{idx + 1}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold tracking-wide">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm transition hover:shadow-md"
            >
              <p className="text-4xl font-bold tracking-wide">{item.value}</p>
              <p className="mt-2 text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-rose-50 to-pink-50 px-6 py-10 text-center dark:from-zinc-900 dark:to-zinc-800">
          <p className="text-sm text-muted-foreground">
            想查看更多表情包与每日更新？直接进入 Gallery 或 Daily。
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/gallery"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-akane-foreground transition hover:brightness-110"
            >
              前往 Gallery
            </Link>
            <Link
              href="/daily"
              className="rounded-full border border-border px-5 py-2.5 text-sm transition hover:border-accent"
            >
              前往 Daily
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
