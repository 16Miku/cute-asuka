"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTheme from "./useTheme";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/gallery", label: "GALLERY" },
  { href: "/daily", label: "DAILY" },
  { href: "/about", label: "ABOUT" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          Cute Asuka
        </Link>

        <nav className="hidden gap-8 text-sm md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="relative">
                <span
                  className={
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  {item.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 h-[2px] w-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-border"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span className="block h-4 w-4 relative">
              <span
                className={`absolute left-0 h-[1.5px] w-4 bg-foreground transition-all ${
                  open ? "top-[7px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-4 bg-foreground transition-all ${
                  open ? "top-[7px] -rotate-45" : "top-[7px]"
                }`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-4 bg-foreground transition-all ${
                  open ? "top-[7px] opacity-0" : "top-[14px]"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-border/60 bg-background"
          >
            <nav className="flex flex-col px-4 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
