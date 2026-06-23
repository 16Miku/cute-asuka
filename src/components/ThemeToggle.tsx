"use client";

import useTheme from "./useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition hover:shadow-md"
    >
      <span className="sr-only">Toggle theme</span>
      {theme === "dark" ? (
        <span className="text-sm">☀️</span>
      ) : (
        <span className="text-sm">🌙</span>
      )}
    </button>
  );
}
