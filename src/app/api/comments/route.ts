import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get("imageId") || "";
  const comments = (globalThis as any).__comments?.get(imageId) || [];
  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageId, user, content } = body || {};
    if (!imageId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!(globalThis as any).__comments) {
      (globalThis as any).__comments = new Map();
    }

    const saved = (globalThis as any).__comments.get(imageId) || [];
    const newEntry = {
      user: typeof user === "string" && user.trim() ? user.trim() : "匿名",
      body: String(content),
      createdAt: new Date().toISOString(),
    };
    saved.push(newEntry);
    (globalThis as any).__comments.set(imageId, saved);

    return NextResponse.json({ comments: saved });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 400 }
    );
  }
}
