import React, { useState } from "react";
import CommentAPI from "../api/comment_api";

export default function CommentItem({ comment, currentUser, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.content);

  const isAuthor = currentUser && currentUser.id === comment.author?.id;
  const isModerator = currentUser && (currentUser.role === "ROLE_MODERATOR" || currentUser.role === "ROLE_ADMIN");

  const save = async () => {
    try {
      const updated = await CommentAPI.editComment(comment.id, text);
      onUpdate(updated);
      setEditing(false);
    } catch (err) { console.error(err); }
  };

  const remove = async () => {
    if (!confirm("Delete comment?")) return;
    try {
      await CommentAPI.deleteComment(comment.id);
      onDelete();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-3 border rounded flex gap-3">
      <img src={comment.author?.profilePicture ? `/images/profiles/${comment.author.profilePicture}` : "/placeholder.png"} className="w-10 h-10 rounded-full object-cover" />
      <div className="flex-1">
        <div className="text-sm font-medium">{comment.author?.username} <span className="muted-text">{new Date(comment.createdAt).toLocaleString()}</span></div>
        {!editing ? <div className="mt-1">{comment.content}</div> :
          <div>
            <textarea className="input-field w-full" value={text} onChange={(e)=>setText(e.target.value)} />
            <div className="mt-2 flex gap-2">
              <button onClick={save} className="btn-primary text-sm">Save</button>
              <button onClick={()=>setEditing(false)} className="text-sm">Cancel</button>
            </div>
          </div>
        }
      </div>
      {(isAuthor || isModerator) && (
        <div className="flex flex-col gap-1">
          <button onClick={()=>setEditing(!editing)} className="text-sm text-gray-600">Edit</button>
          <button onClick={remove} className="text-sm text-red-600">Delete</button>
        </div>
      )}
    </div>
  );
}