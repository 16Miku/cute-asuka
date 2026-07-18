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

export default function SectionNav() {
  const [active, setActive] = useState("hero");

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
      className="pointer-events-none fixed right-3 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2 md:flex"
      aria-label="页面章节"
    >
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`pointer-events-auto group flex items-center justify-end gap-2 transition ${
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
