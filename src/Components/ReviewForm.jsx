import React, { useState, useEffect } from 'react';
import ReviewAPI from '../api/review_api';
import useAuth from '../hooks/useAuth';

export default function ReviewForm({ targetUserId, onPosted, initial }) {
  const { currentUser, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [comment, setComment] = useState(initial?.comment ?? '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) {
      setRating(initial.rating || 5);
      setComment(initial.comment || '');
    }
  }, [initial]);

  if (!isAuthenticated) {
    return <div className="text-sm text-gray-600">Log in to leave a review.</div>;
  }

  if (currentUser?.id === Number(targetUserId)) {
    return <div className="text-sm text-gray-600">You can't review yourself.</div>;
  }

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!rating || rating < 1 || rating > 5) return alert("Pick rating 1-5");
    setLoading(true);
    try {
      const saved = await ReviewAPI.postReview(targetUserId, rating, comment);
      onPosted(saved);
    } catch (err) {
      console.error(err);
      alert("Failed to post review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="text-sm">Your rating:</div>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(n => (
            <button
              type="button"
              key={n}
              onClick={() => setRating(n)}
              className={`px-2 py-1 rounded ${n <= rating ? 'bg-yellow-300' : 'bg-gray-100'}`}
            >
              {n}★
            </button>
          ))}
        </div>
      </div>

      <div>
        <textarea
          className="input-field w-full"
          placeholder="Optional comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : (initial ? 'Update review' : 'Post review')}
        </button>
      </div>
    </form>
  );
}