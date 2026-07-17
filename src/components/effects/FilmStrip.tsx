"use client";

import Image from "next/image";
import { useMemo } from "react";

type Props = {
  images: string[];
  speed?: "slow" | "med" | "fast";
  reverse?: boolean;
};

export default function FilmStrip({
  images,
  speed = "med",
  reverse = false,
}: Props) {
  const loop = useMemo(() => [...images, ...images], [images]);
  const dur =
    speed === "slow" ? "70s" : speed === "fast" ? "32s" : "48s";

  if (!images.length) return null;

  return (
    <div className="film-strip relative overflow-hidden py-3">
      <div
        className={`film-track flex w-max gap-3 ${reverse ? "film-track-reverse" : ""}`}
        style={{ ["--film-duration" as string]: dur }}
      >
        {loop.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-black/20 shadow-lg md:h-36 md:w-56"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="224px"
              unoptimized
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
