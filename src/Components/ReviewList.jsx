import React from 'react';

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <div className="muted-text">No reviews yet.</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map(r => (
        <div key={r.id} className="p-3 border rounded">
          <div className="flex items-center gap-3">
            <img
              src={r.author?.profilePicture ? `/images/profiles/${r.author.profilePicture}` : '/placeholder.png'}
              alt={r.author?.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium">{r.author?.username}</div>
              <div className="muted-text">{new Date(r.createdAt).toLocaleString()}</div>
            </div>
            <div className="ml-auto text-sm font-semibold">{r.rating}★</div>
          </div>
          {r.comment && <div className="mt-2">{r.comment}</div>}
        </div>
      ))}
    </div>
  );
}