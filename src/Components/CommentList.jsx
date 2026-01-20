import React, { useEffect, useState } from "react";
import CommentAPI from "../api/comment_api";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

export default function CommentList({ productId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);

  useEffect(() => {
    setComments([]);
    setPage(0);
    setLast(false);

    fetchFirstPage();
  }, [productId]);

  const fetchFirstPage = async () => {
    setLoading(true);
    try {
      const data = await CommentAPI.fetchComments(productId, 0, 2);
      setComments(data.content);
      setLast(data.last);
      setPage(1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loading || last) return;

    setLoading(true);
    try {
      const data = await CommentAPI.fetchComments(productId, page, 2);

      setComments(prev => {
        const existingIds = new Set(prev.map(c => c.id));
        const unique = data.content.filter(c => !existingIds.has(c.id));
        return [...prev, ...unique];
      });

      setLast(data.last);
      setPage(p => p + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const add = (c) => setComments(prev => [...prev, c]);
  const update = (c) => setComments(prev => prev.map(x => x.id === c.id ? c : x));
  const remove = (id) => setComments(prev => prev.filter(c => c.id !== id));

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3">Comments</h3>
      <CommentForm productId={productId} onPosted={add} />
      {comments.length === 0 && loading && (
        <div>Loading comments...</div>
      )}
      {comments.length === 0 && !loading && (
        <div className="text-gray-500 mt-2">No comments yet.</div>
      )}

      <div className="space-y-3 mt-3">
        {comments.map(c => (
          <CommentItem key={c.id} comment={c} currentUser={currentUser} onUpdate={update} onDelete={() => remove(c.id)} />
        ))}
      </div>    
      
      {!last && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="btn-secondary mt-3"
        >
          {loading ? "Loading..." : "Load more comments"}
        </button>
      )}
    </div>
  );
}