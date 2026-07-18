import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-muted-foreground">
        <p className="font-display text-sm text-foreground/80">Cute Asuka</p>
        <p className="mt-2">
          © {new Date().getFullYear()} · 粉丝向表情包小站，内容仅供学习交流
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 tracking-[0.18em]">
          <Link className="hover:text-foreground" href="/gallery">
            GALLERY
          </Link>
          <Link className="hover:text-foreground" href="/daily">
            DAILY
          </Link>
          <Link className="hover:text-foreground" href="/about">
            ABOUT
          </Link>
          <a
            className="hover:text-foreground"
            href="https://github.com/16Miku/cute-asuka"
            target="_blank"
            rel="noopener noreferrer"
          >
            GITHUB
          </a>
        </div>
      </div>
    </footer>
  );
}
