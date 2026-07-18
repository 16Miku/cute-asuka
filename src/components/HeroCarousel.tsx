"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CarouselProps {
  mobileImages: string[];
  desktopImages: string[];
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export default function HeroCarousel({
  mobileImages,
  desktopImages,
  interval = 5000,
  showDots = true,
  showArrows = true,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [preloadWindow, setPreloadWindow] = useState<number[]>([]);
  /** 手动切换后短暂忽略连点，防止动画期间连点叠跳 */
  const lockUntilRef = useRef(0);

  const images = isDesktop ? desktopImages : mobileImages;
  const len = images.length;

  useEffect(() => {
    setCurrentIndex(0);
  }, [isDesktop]);

  useEffect(() => {
    if (len <= 0) return;
    setCurrentIndex((i) => (i >= len ? 0 : i));
  }, [len]);

  useEffect(() => {
    if (len <= 1) return;
    const nextIdx = (currentIndex + 1) % len;
    const prevIdx = (currentIndex - 1 + len) % len;
    setPreloadWindow([prevIdx, currentIndex, nextIdx]);
  }, [currentIndex, len]);

  /**
   * 自动播放：每次 currentIndex 变化都重置计时。
   * - 手动切图 → 重新倒计时满 interval，不会马上再跳
   * - 不用 focus/hover 暂停，避免点击后焦点留在按钮上导致永停
   */
  useEffect(() => {
    if (len <= 1 || interval <= 0) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const timer = window.setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % len);
    }, interval);

    return () => window.clearTimeout(timer);
  }, [currentIndex, len, interval]);

  const canInteract = useCallback(() => {
    return performance.now() >= lockUntilRef.current;
  }, []);

  const armLock = useCallback(() => {
    lockUntilRef.current = performance.now() + 420;
  }, []);

  const navigate = useCallback(
    (step: number) => {
      if (len <= 1 || !canInteract()) return;
      armLock();
      setCurrentIndex((prev) => {
        const next = prev + step;
        if (next < 0) return len - 1;
        if (next >= len) return 0;
        return next;
      });
    },
    [len, canInteract, armLock]
  );

  const goTo = useCallback(
    (index: number) => {
      if (len <= 1 || !canInteract()) return;
      if (index === currentIndex) return;
      armLock();
      setCurrentIndex(((index % len) + len) % len);
    },
    [len, currentIndex, canInteract, armLock]
  );

  const currentImage = images[currentIndex] || "/images/placeholder.jpg";

  return (
    <div className="relative h-full w-full overflow-hidden">
      {preloadWindow.map((idx) => (
        <link
          key={`preload-${idx}`}
          rel="preload"
          as="image"
          href={images[idx]}
        />
      ))}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${isDesktop ? "desktop" : "mobile"}-${currentIndex}`}
          initial={{ opacity: 0.25 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.45, ease: "easeInOut" },
          }}
          className="pointer-events-none absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-[#1a1014]" />
          <Image
            src={currentImage}
            alt=""
            fill
            aria-hidden
            className="scale-110 object-cover object-top opacity-40 blur-xl"
            sizes="100vw"
            unoptimized
          />
          <Image
            src={currentImage}
            alt={`轮播图 ${currentIndex + 1}`}
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
            unoptimized
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-14 bg-gradient-to-t from-black/30 to-transparent" />

      {showArrows && len > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
              (e.currentTarget as HTMLButtonElement).blur();
            }}
            className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/40 bg-black/25 p-2.5 text-white shadow-lg backdrop-blur-md transition hover:bg-black/40 md:left-4 md:p-3"
            aria-label="上一张"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(1);
              (e.currentTarget as HTMLButtonElement).blur();
            }}
            className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/40 bg-black/25 p-2.5 text-white shadow-lg backdrop-blur-md transition hover:bg-black/40 md:right-4 md:p-3"
            aria-label="下一张"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {showDots && len > 1 && (
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2 md:bottom-5">
          {images.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goTo(index);
                (e.currentTarget as HTMLButtonElement).blur();
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-7 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`切换到第 ${index + 1} 张`}
              aria-current={index === currentIndex ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
