'use client';

import { useEffect, useRef, useState } from "react";

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
  const buttonRef = useRef<HTMLButtonElement>(null)


  const fetchLikeData = async () => {
    try {
      const res = await fetch(`/api/notes/${noteId}/like`);
      if (res.ok) {
        const data = await res.json();
        setLikesCount(data.count);
        setLiked(data.liked);
      }
    } catch (error) {
      console.error("Failed to fetch like data:", error);
    }
  };

  // 2. Pehli render pe ek baar fetch
  useEffect(() => {
    fetchLikeData();
    // eslint-disable-next-line
  }, []);

  // 3. Button pe click hone par bhi fetch
  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const handleClick = async () => {
      setLoading(true);
      try {
        await fetch(`/api/notes/${noteId}/like`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
        });
        await fetchLikeData(); // Like ke baad dobara fetch
      } catch (error) {
        console.error("Like failed:", error);
      } finally {
        setLoading(false);
      }
    };

    btn.addEventListener("click", handleClick);

    // Cleanup
    return () => {
      btn.removeEventListener("click", handleClick);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <button
      ref={buttonRef}
      disabled={loading}
      className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'} transition`}
    >
      {liked ? '❤️' : '🤍'} {likesCount}
    </button>
  );
}
