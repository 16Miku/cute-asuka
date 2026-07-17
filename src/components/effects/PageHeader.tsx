"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function PageHeader({
  kicker,
  title,
  subtitle,
  action,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] tracking-[0.32em] text-muted-foreground"
        >
          {kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display mt-2 text-3xl md:text-5xl"
        >
          {title}
        </motion.h1>
        {subtitle ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground"
          >
            {subtitle}
          </motion.p>
        ) : null}
      </div>
      {action ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {action}
        </motion.div>
      ) : null}
    </div>
  );
}
