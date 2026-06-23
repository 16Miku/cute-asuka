import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const dir = path.resolve(process.cwd(), "public/images");
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
  } catch {
    files = [];
  }
  return NextResponse.json(files);
}
