"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PageShell from "@/components/effects/PageShell";
import PageHeader from "@/components/effects/PageHeader";

const pillars = [
  {
    t: "乃木坂气质",
    d: "粉白、克制、留白。不堆砌特效，把重量留给表情本身。",
  },
  {
    t: "可保存瞬间",
    d: "画廊预览与下载、每日种子帧，把心跳漏拍变成可分享的文件。",
  },
  {
    t: "界面即展厅",
    d: "WebGL 光场、玻璃层、滚动叙事——技术为情绪服务，而不是喧宾夺主。",
  },
];

const stack = [
  "Next.js 16 static export",
  "React 19",
  "Tailwind CSS v4",
  "Framer Motion",
  "WebGL2 shaders",
  "color-mix / glass",
];

export default function About() {
  return (
    <PageShell intensity={0.45}>
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <PageHeader
          kicker="MANIFESTO · ABOUT"
          title="关于本站"
          subtitle="粉丝向表情包小站，献给斋藤飞鸟。内容仅供学习交流，与官方无关。"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-12">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel md:col-span-7 p-7 md:p-10"
          >
            <p className="font-display text-2xl leading-snug md:text-3xl">
              收集那些让心跳漏了一拍的瞬间，
              <span className="text-accent"> 化作可保存、可分享的表情包。</span>
            </p>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Cute Asuka 不是库存盘，而是一场轻量的数字展览：首页负责情绪开场，画廊负责检索与下载，每日一图负责仪式感。
              </p>
              <p>
                设计语言借自舞台侧光与樱色滤镜——柔和对比、透光层次、电影感遮罩。深色模式同样温柔，不为炫技而刺眼。
              </p>
              <p>
                站点功能会继续打磨；若有建议，欢迎通过留言或 Issue 交流。
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <Link href="/gallery" className="btn-glass-primary text-xs">
                进入画廊
              </Link>
              <Link href="/daily" className="btn-glass-solid text-xs">
                今日一图
              </Link>
              <Link href="/" className="btn-glass-solid text-xs">
                返回首页
              </Link>
            </div>
          </motion.article>

          <div className="flex flex-col gap-4 md:col-span-5">
            {pillars.map((p, i) => (
              <motion.div
                key={p.t}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * (i + 1) }}
                className="glass-panel p-5"
              >
                <p className="text-[10px] tracking-[0.28em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display mt-1 text-xl">{p.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel mt-8 p-6 md:p-8"
        >
          <p className="text-[11px] tracking-[0.32em] text-muted-foreground">
            CRAFT STACK
          </p>
          <p className="font-display mt-2 text-xl">如何搭成这座小馆</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {stack.map((s) => (
              <li
                key={s}
                className="rounded-full border border-border/80 bg-background/50 px-3 py-1.5 text-xs text-muted-foreground"
              >
                {s}
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </PageShell>
  );
}
