import React, { useEffect, useState } from "react";
import CommentAPI from "../api/comment_api";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

export default function CommentList({ productId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await CommentAPI.fetchComments(productId);
        setComments(data);
      } catch (e) { /* handle */ }
      setLoading(false);
    })();
  }, [productId]);

  const add = (c) => setComments(prev => [...prev, c]);
  const update = (c) => setComments(prev => prev.map(x => x.id === c.id ? c : x));
  const remove = (id) => setComments(prev => prev.filter(c => c.id !== id));

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3">Comments</h3>
      <CommentForm productId={productId} onPosted={add} />
      {loading ? <div>Loading comments...</div> :
        comments.length === 0 ? <div className="text-gray-500 mt-2">No comments yet.</div> :
        <div className="space-y-3 mt-3">
          {comments.map(c => (
            <CommentItem key={c.id} comment={c} currentUser={currentUser} onUpdate={update} onDelete={() => remove(c.id)} />
          ))}
        </div>
      }
    </div>
  );
}