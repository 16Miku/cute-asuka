"use client";

import { useState, useEffect, useCallback } from "react";
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

  // 根据设备类型选择图片组
  const images = isDesktop ? desktopImages : mobileImages;

  // 预加载相邻图片，减少切换空白
  useEffect(() => {
    if (images.length <= 1) return;
    const nextIdx = (currentIndex + 1) % images.length;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    setPreloadWindow([prevIdx, currentIndex, nextIdx]);
  }, [currentIndex, images.length]);

  // 当设备切换时，重置到第一张
  useEffect(() => {
    setCurrentIndex(0);
  }, [isDesktop]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  const navigate = useCallback(
    (step: number) => {
      setCurrentIndex((prev) => {
        const next = prev + step;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images.length]
  );

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const currentImage = images[currentIndex] || "/images/placeholder.jpg";

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* 预加载相邻图片（通过 link 标签） */}
      {preloadWindow.map((idx) => (
        <link
          key={`preload-${idx}`}
          rel="preload"
          as="image"
          href={images[idx]}
        />
      ))}

      {/* 轮播图片 - 交叉淡入淡出，无空白间隙 */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`${isDesktop ? "desktop" : "mobile"}-${currentIndex}`}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.3 }}
          transition={{
            opacity: { duration: 0.5, ease: "easeInOut" },
          }}
          className="pointer-events-none absolute inset-0 z-0"
        >
          <Image
            src={currentImage}
            alt={`轮播图 ${currentIndex + 1}`}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* 渐变遮罩 - 不拦截点击 */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/5 via-transparent to-black/15" />

      {/* 控件层：高于图片与遮罩，保证可点 */}
      {showArrows && images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
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

      {/* 底部指示点 */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goTo(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-7 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`切换到第 ${index + 1} 张`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
