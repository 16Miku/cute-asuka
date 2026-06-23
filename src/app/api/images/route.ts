import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-static";

// 静态构建时读取图片列表
export async function GET() {
  const dir = path.resolve(process.cwd(), "public/images");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
    files.sort((a, b) => a.localeCompare(b));
  } catch {
    files = [];
  }
  return NextResponse.json(files);
}
