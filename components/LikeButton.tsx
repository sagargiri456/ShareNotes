'use client';

import { useEffect, useState } from "react";

interface Props {
  noteId: string;
  initialLiked?: boolean;
  initialLikesCount?: number;
}

export default function LikeButton({
  noteId,
  initialLiked = false,
  initialLikesCount = 0,
}: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${noteId}/like`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setLiked(!liked);
        setLikesCount((prev) => prev + (liked ? -1 : 1));
      }
    } catch (error) {
      console.error("Like failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'} transition`}
    >
      {liked ? '❤️' : '🤍'} {likesCount}
    </button>
  );
}
