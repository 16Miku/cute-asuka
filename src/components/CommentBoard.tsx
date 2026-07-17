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
    <div className="glass-panel p-5 md:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.28em] text-muted-foreground">
            NOTES
          </p>
          <h3 className="font-display mt-1 text-xl">留言板</h3>
        </div>
        <p className="text-[10px] text-muted-foreground">会话级暂存</p>
      </div>

      <form
        onSubmit={submit}
        className="mt-5 grid gap-3 md:grid-cols-[1fr_2fr_auto]"
      >
        <input
          className="rounded-full border border-border/80 bg-background/60 px-3 py-2 text-sm outline-none ring-accent/30 focus:ring-2"
          placeholder="昵称（选填）"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          maxLength={20}
        />
        <input
          className="rounded-full border border-border/80 bg-background/60 px-3 py-2 text-sm outline-none ring-accent/30 focus:ring-2"
          placeholder="留下一句喜欢"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={200}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-gradient-to-r from-rose-300 to-fuchsia-300 px-4 py-2 text-xs font-medium text-[#4a2a36] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "发送中…" : "发送"}
        </button>
      </form>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <div className="mt-5 space-y-3">
        {comments.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            暂无评论，来抢沙发吧 ~
          </p>
        )}
        {comments.map((item, idx) => (
          <motion.div
            key={`${item.createdAt}-${idx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border/60 bg-background/50 p-3.5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">{item.user}</span>
              <span>{new Date(item.createdAt).toLocaleString("zh-CN")}</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed">{item.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
