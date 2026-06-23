import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-muted-foreground">
        <p className="mb-2">© {new Date().getFullYear()} Cute Asuka.</p>
        <p className="mb-3">
          一个粉丝向表情包小站，内容仅供学习交流使用。
        </p>
        <div className="flex items-center justify-center gap-6">
          <Link href="/gallery">GALLERY</Link>
          <Link href="/daily">DAILY</Link>
          <Link href="/about">ABOUT</Link>
        </div>
      </div>
    </footer>
  );
}
