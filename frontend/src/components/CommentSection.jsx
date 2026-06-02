import React, { useState, useEffect } from 'react';
import { getStoryComments, createStoryComment } from '../services/api';

export default function CommentSection({ storyId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (storyId) {
      loadComments();
    }
  }, [storyId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await getStoryComments(storyId);
      setComments(res.data || []);
    } catch (err) {
      setError("Không thể tải bình luận");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const res = await createStoryComment(storyId, newComment.trim());
      setComments(prev => [...prev, res.data]);
      setNewComment('');
    } catch (err) {
      setError("Không thể gửi bình luận");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="mt-8 border-t border-outline-variant/20 pt-6">
      <h4 className="text-sm font-bold text-on-surface flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-[18px]">forum</span>
        Thảo luận ({comments.length})
      </h4>

      {/* Comment List */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 custom-scrollbar">
        {comments.length === 0 && !loading && (
          <p className="text-xs text-on-surface-variant/50 italic text-center py-4">
            Chưa có bình luận nào. Hãy bắt đầu thảo luận!
          </p>
        )}
        
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
              {(comment.user?.fullName || comment.user?.email || '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 bg-surface-container-low p-3 rounded-2xl rounded-tl-none border border-outline-variant/10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-on-surface">
                  {comment.user?.fullName || comment.user?.email}
                </span>
                <span className="text-[9px] text-on-surface-variant/60">
                  {formatTime(comment.createdAt)}
                </span>
              </div>
              <p className="text-[12px] text-on-surface-variant leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
        
        {loading && comments.length === 0 && (
          <div className="flex justify-center py-4 text-primary">
            <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* New Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <textarea
            className="w-full px-4 py-3 rounded-2xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none text-xs min-h-[44px]"
            placeholder="Viết phản hồi..."
            rows="1"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="w-11 h-11 bg-primary text-on-primary rounded-xl flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:translate-y-0 active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">send</span>
        </button>
      </form>
      
      {error && (
        <p className="mt-2 text-[10px] text-error flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px]">error</span>
          {error}
        </p>
      )}
    </div>
  );
}
