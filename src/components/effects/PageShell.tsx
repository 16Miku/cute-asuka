"use client";

import type { ReactNode } from "react";
import AuroraField from "./AuroraField";
import ScrollProgress from "./ScrollProgress";

/** Shared ambient layer for subpages (lighter aurora than home). */
export default function PageShell({
  children,
  intensity = 0.36,
  className = "",
}: {
  children: ReactNode;
  intensity?: number;
  className?: string;
}) {
  return (
    <div className={`relative min-h-[70vh] ${className}`}>
      <ScrollProgress />
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <AuroraField intensity={intensity} />
        <div className="noise-overlay absolute inset-0 opacity-[0.03] mix-blend-overlay dark:opacity-[0.05]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_10%,_var(--background)_78%)]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
