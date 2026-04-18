"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useChapterComments } from "@/hooks/use-chapter-comments";

export function ChapterComments({ chapterId }: { chapterId: string }) {
  const { user } = useAuth();
  const { comments, addComment, loading, toggleCommentLike } = useChapterComments(chapterId);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const actorId = user?.uid ?? "guest-reader";
  const actorName = user?.displayName ?? user?.email?.split("@")[0] ?? "Guest Reader";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      await addComment({
        userId: actorId,
        userName: actorName,
        chapterId,
        text: text.trim(),
      });
      setText("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-6 rounded-[30px] border border-white/8 bg-white/[0.03] p-5 sm:p-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.36em] text-rose-400">Realtime Discussion</p>
        <h2 className="section-title text-3xl text-white">Chapter Comments</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={4}
          placeholder="Share theories, cinematography notes, or crossover clues..."
          className="w-full rounded-[24px] border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-rose-500/60"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-zinc-400">
            Posting as <span className="text-zinc-200">{actorName}</span>
          </p>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5 text-zinc-300">Loading comments...</div>
        ) : null}

        {comments.map((comment) => (
          <article key={comment.id} className="rounded-[24px] border border-white/8 bg-black/30 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">{comment.userName}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => void toggleCommentLike(comment, actorId)}
                className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-zinc-300 transition hover:bg-white/5"
              >
                Like {comment.likes}
              </button>
            </div>
            <p className="mt-4 text-sm leading-7 text-zinc-200">{comment.text}</p>
          </article>
        ))}

        {!loading && !comments.length ? (
          <div className="rounded-[24px] border border-dashed border-white/10 p-5 text-zinc-300">
            No comments yet. Start the first theory thread for this chapter.
          </div>
        ) : null}
      </div>
    </section>
  );
}
