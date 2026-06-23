"use client";

import useTheme from "./useTheme";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition hover:shadow-md"
      whileTap={{ scale: 0.92 }}
      whileHover={{ rotate: 15 }}
    >
      <span className="sr-only">Toggle theme</span>
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="text-sm"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </motion.span>
    </motion.button>
  );
}
