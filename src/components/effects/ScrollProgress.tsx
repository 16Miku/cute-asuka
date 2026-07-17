"use client";

import { useEffect, useState } from "react";

/** Thin top progress bar driven by scroll position (CSS + rAF). */
export default function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      setP(Math.min(1, window.scrollY / max));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent"
      aria-hidden
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-rose-300 via-fuchsia-300 to-amber-200 shadow-[0_0_12px_rgba(244,114,182,0.55)] transition-[width] duration-75 ease-out"
        style={{ width: `${p * 100}%` }}
      />
    </div>
  );
}
