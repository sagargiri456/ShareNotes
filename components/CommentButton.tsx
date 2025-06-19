// components/CommentButton.tsx
'use client';

import { useState } from 'react';
import Modal from 'react-modal';

export default function CommentButton({ noteId }: { noteId: string }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");

  const submitComment = async () => {
    if (!newComment.trim()) return;
  
    try {
      const res = await fetch(`/api/notes/${noteId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ content: newComment }),
      });
  
      const data = await res.json();
      console.log(data)
      if (res.ok && data.content) {
        // Add new comment to local list
        setComments((prev) => [...prev, data.content]);
        setNewComment("");
      } else {
        console.error("❌ Failed to add comment:", data.error);
        alert("Failed to add comment: " + data.error);
      }
    } catch (err) {
      console.error("❌ Error submitting comment:", err);
      alert("Something went wrong");
    }
  };
  

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-blue-500">💬 Comment</button>
      <Modal isOpen={open} onRequestClose={() => setOpen(false)} ariaHideApp={false}>
        <h2 className="text-lg font-bold">Comments</h2>
        <div className="mt-2">
          {comments.map((cmt, i) => (
            <p key={i} className="border-b py-1">{cmt}</p>
          ))}
        </div>
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full border p-2 mt-2"
          placeholder="Write a comment..."
        />
        <button onClick={submitComment} className="bg-blue-500 text-white px-3 py-1 mt-2 rounded">Submit</button>
      </Modal>
    </>
  );
}
