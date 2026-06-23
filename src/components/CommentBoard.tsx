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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const res = await fetch(
        `/api/comments?imageId=${encodeURIComponent(String(imageId))}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("加载评论失败");
      const data = await res.json();
      setComments(data.comments || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载评论失败");
    }
  };

  useEffect(() => {
    refresh();
  }, [imageId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/comments?imageId=${imageId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageId,
          user: user.trim() || "匿名",
          content: body.trim(),
        }),
      });
      if (!res.ok) throw new Error("提交失败");
      setBody("");
      setUser("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败");
    } finally {
      setIsSubmitting(false);
    }
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
          maxLength={20}
        />
        <input
          className="rounded-full border border-border bg-background px-3 py-2 text-sm"
          placeholder="留下喜欢"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={200}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-accent px-4 py-2 text-xs text-akane-foreground transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "发送中..." : "发送"}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}

      <div className="mt-4 space-y-3">
        {comments.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            暂无评论，来抢沙发吧~ ✨
          </p>
        )}
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
