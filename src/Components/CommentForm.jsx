import React, { useState } from "react";
import CommentAPI from "../api/comment_api";
import useAuth from "../hooks/useAuth";

export default function CommentForm({ productId, onPosted }) {
  const [text, setText] = useState("");
  const { isAuthenticated } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const c = await CommentAPI.postComment(productId, text);
      onPosted(c);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return <div className="text-sm text-gray-600">Log in to post a comment.</div>;
  }

  return (
    <form onSubmit={submit} className="mb-3">
      <textarea value={text} onChange={(e)=>setText(e.target.value)} className="input-field w-full" placeholder="Write a comment..." />
      <div className="text-right mt-2">
        <button type="submit" className="btn-primary">Post</button>
      </div>
    </form>
  );
}