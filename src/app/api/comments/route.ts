import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

type Comment = {
  user: string;
  body: string;
  createdAt: string;
};

const commentStore = new Map<string, Comment[]>();

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get("imageId") || "";
  const comments = commentStore.get(imageId) || [];
  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageId, user, content } = body || {};
    if (!imageId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const saved = commentStore.get(imageId) || [];
    const newEntry = {
      user: typeof user === "string" && user.trim() ? user.trim() : "匿名",
      body: String(content),
      createdAt: new Date().toISOString(),
    };
    saved.push(newEntry);
    commentStore.set(imageId, saved);

    return NextResponse.json({ comments: saved });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 400 }
    );
  }
}
