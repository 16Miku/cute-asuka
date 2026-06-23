"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Comment = {
  user: string;
  body: string;
  createdAt: string;
};

export default function CommentBoard({ imageId }: { imageId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [user, setUser] = useState("");

  const refresh = async () => {
    const res = await fetch(
      `/api/comments?imageId=${encodeURIComponent(String(imageId))}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    setComments(data.comments || []);
  };

  useEffect(() => {
    refresh();
  }, [imageId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body) return;
    await fetch(`/api/comments?imageId=${imageId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, content: body }),
    });
    setBody("");
    refresh();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-base font-semibold tracking-wide">留言板</h3>

      <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-[1fr_2fr_auto]">
        <input
          className="rounded-full border border-border bg-background px-3 py-2 text-sm"
          placeholder="昵称（选填）"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          className="rounded-full border border-border bg-background px-3 py-2 text-sm"
          placeholder="留下喜欢"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-full bg-accent px-4 py-2 text-xs text-akane-foreground"
        >
          发送
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {comments.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border/60 bg-background p-3"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{item.user}</span>
              <span>{new Date(item.createdAt).toLocaleString("zh-CN")}</span>
            </div>
            <p className="mt-1 text-sm">{item.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
