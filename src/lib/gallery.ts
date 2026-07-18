/** Shared gallery helpers — single source of truth for /api/images files */

export type GalleryCat = "静态表情包" | "动态表情包";

export type GalleryItem = {
  id: number;
  file: string;
  title: string;
  cat: GalleryCat;
  src: string;
  ext: string;
};

export const GALLERY_CATEGORIES = [
  "所有表情包",
  "静态表情包",
  "动态表情包",
] as const;

export type GalleryCategoryFilter = (typeof GALLERY_CATEGORIES)[number];

const TITLE_POOL = [
  "元气微笑",
  "cuteness overload",
  "害羞 wink",
  "舞台定格",
  "后台絮语",
  "综艺梗图",
  "闭眼笑",
  "歪头杀",
  "搞怪接力",
  "侧光剪影",
  "粉白瞬间",
  "镜头余温",
];

export function getTitle(file: string): string {
  const name = file.replace(/\.[^/.]+$/, "");
  if (name.startsWith("QQ") || name.startsWith("QQ截图")) return "收藏截图";
  if (name.startsWith("Snipaste")) return "精选截图";
  if (name.startsWith("{") && name.endsWith("}")) return "动态特写";
  if (/^\d+$/.test(name.substring(0, 8))) return `${name.substring(0, 8)}…`;
  if (name.length > 14) return `${name.substring(0, 14)}…`;
  return name || "表情包";
}

export function poeticTitle(file: string, index: number): string {
  const base = getTitle(file);
  // Prefer human title pool when filename is hash-like
  if (/^[0-9A-Fa-f]{8,}$/.test(base.replace("…", "")) || base.includes("…")) {
    return TITLE_POOL[index % TITLE_POOL.length];
  }
  return base;
}

export function fileToItem(file: string, index: number): GalleryItem {
  const ext = file.split(".").pop()?.toLowerCase() || "";
  const isDynamic = ext === "gif";
  const cat: GalleryCat = isDynamic ? "动态表情包" : "静态表情包";
  return {
    id: index + 1,
    file,
    title: poeticTitle(file, index),
    cat,
    src: `/images/${file}`,
    ext,
  };
}

export function filesToItems(files: string[]): GalleryItem[] {
  return files.map((f, i) => fileToItem(f, i));
}

/** YYYYMMDD seed → stable daily pick */
export function pickDailyIndex(length: number, date = new Date()): number {
  if (length <= 0) return 0;
  const seed =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  return seed % length;
}

export function pickDailyItem(
  files: string[],
  date = new Date()
): GalleryItem | null {
  if (!files.length) return null;
  const index = pickDailyIndex(files.length, date);
  return fileToItem(files[index], index);
}

export function todayLabel(date = new Date()): string {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export function formatFrameId(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}
