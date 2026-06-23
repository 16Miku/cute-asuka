"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CarouselProps {
  images: string[];
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export default function HeroCarousel({
  images,
  interval = 5000,
  showDots = true,
  showArrows = true,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* 轮播图片 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            opacity: { duration: 0.8, ease: "easeInOut" },
            scale: { duration: 0.8, ease: "easeInOut" },
          }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt={`轮播图 ${currentIndex + 1}`}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      {/* 左右箭头 */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20 hidden md:block"
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
            onClick={() => navigate(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20 hidden md:block"
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
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`切换到第 ${index + 1} 张`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
