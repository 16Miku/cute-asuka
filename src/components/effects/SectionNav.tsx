"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "01" },
  { id: "manifesto", label: "02" },
  { id: "archive", label: "03" },
  { id: "film", label: "04" },
  { id: "daily", label: "05" },
  { id: "explore", label: "06" },
  { id: "close", label: "07" },
] as const;

/**
 * 章节导航：大屏（Hero）可见时整体隐藏，避免与轮播右箭头重叠误点。
 */
export default function SectionNav() {
  const [active, setActive] = useState("hero");
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const updatePastHero = () => {
      // 滚过约半屏后再显示，确保大屏箭头区域已离开
      setPastHero(window.scrollY > window.innerHeight * 0.55);
    };
    updatePastHero();
    window.addEventListener("scroll", updatePastHero, { passive: true });
    window.addEventListener("resize", updatePastHero);
    return () => {
      window.removeEventListener("scroll", updatePastHero);
      window.removeEventListener("resize", updatePastHero);
    };
  }, []);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -40% 0px", threshold: [0.1, 0.35, 0.6] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      className={`fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 transition-all duration-300 md:flex ${
        pastHero
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      aria-label="页面章节"
      aria-hidden={!pastHero}
    >
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          tabIndex={pastHero ? 0 : -1}
          className={`group flex items-center justify-end gap-2 transition ${
            active === s.id ? "opacity-100" : "opacity-40 hover:opacity-80"
          }`}
        >
          <span className="text-[9px] tracking-[0.2em] text-muted-foreground opacity-0 transition group-hover:opacity-100">
            {s.id}
          </span>
          <span
            className={`h-1.5 rounded-full transition-all ${
              active === s.id
                ? "w-6 bg-accent shadow-[0_0_12px_rgba(232,138,170,0.6)]"
                : "w-1.5 bg-foreground/30"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
