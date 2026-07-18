import fs from "fs";
import path from "path";

/** Build-time: one static path per real image in public/images */
export function generateStaticParams() {
  const dir = path.resolve(process.cwd(), "public/images");
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b));
  } catch {
    files = [];
  }
  return files.map((_, i) => ({ id: String(i + 1) }));
}

export default function GalleryIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
