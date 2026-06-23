import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { LRUCache } from "lru-cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 缓存图片列表，避免每次请求都读取磁盘
const cache = new LRUCache<string, string[]>({
  max: 1, // 只需要一个 key
  ttl: 1000 * 60 * 5, // 5分钟过期
});

const CACHE_KEY = "images";

export async function GET() {
  // 检查缓存
  const cached = cache.get(CACHE_KEY);
  if (cached) {
    return NextResponse.json(cached);
  }

  const dir = path.resolve(process.cwd(), "public/images");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
    // 按文件名排序，使结果更稳定
    files.sort((a, b) => a.localeCompare(b));
  } catch {
    files = [];
  }

  // 存入缓存
  cache.set(CACHE_KEY, files);
  return NextResponse.json(files);
}
