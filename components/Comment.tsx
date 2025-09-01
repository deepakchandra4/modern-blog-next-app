'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import Image from 'next/image';
import CommentForm from './CommentForm';

interface CommentAuthor {
  _id: string;
  name: string;
  avatar: string;
}

interface Comment {
  _id: string;
  content: string;
  author: CommentAuthor;
  createdAt: string;
  isEdited: boolean;
  replies?: Comment[];
}

interface CommentProps {
  comment: Comment;
  postId: string;
  onCommentUpdated: () => void;
  onCommentDeleted: () => void;
  level?: number;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  postId,
  onCommentUpdated,
  onCommentDeleted,
  level = 0,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.put(`/api/comments/${comment._id}`, {
        content: editContent.trim(),
      });
      setIsEditing(false);
      onCommentUpdated();
    } catch (error: unknown) {
      console.error('Error updating comment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update comment';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    setIsSubmitting(true);
    try {
      await axios.delete(`/api/comments/${comment._id}`);
      onCommentDeleted();
    } catch (error: unknown) {
      console.error('Error deleting comment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete comment';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAuthor = user?._id === comment.author._id;

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-cyan-400/30 pl-4' : ''}`}>
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/10">
        <div className="flex items-start space-x-3">
          {comment.author.avatar ? (
            <Image
              src={comment.author.avatar}
              alt={comment.author.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border border-cyan-400/30"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center border border-cyan-400/30">
              <span className="text-white text-xs font-semibold">
                {comment.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-cyan-100">{comment.author.name}</span>
              <span className="text-sm text-cyan-200/60">
                {formatDate(comment.createdAt)}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-cyan-200/40">(edited)</span>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleEdit} className="mb-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none text-cyan-100 placeholder-cyan-200/60 transition-all duration-300"
                  rows={3}
                  maxLength={1000}
                  placeholder="Edit your comment..."
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-cyan-200/60">
                    {editContent.length}/1000 characters
                  </span>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditContent(comment.content);
                      }}
                      className="px-3 py-1 text-cyan-200/80 hover:text-cyan-100 text-sm transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!editContent.trim() || isSubmitting}
                      className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-300"
                    >
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <p className="text-cyan-100 mb-3 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
            )}

            {!isEditing && (
              <div className="flex items-center space-x-4 text-sm">
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                >
                  Reply
                </button>
                
                {isAuthor && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-cyan-200/80 hover:text-cyan-100 transition-colors duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isSubmitting}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors duration-300"
                    >
                      {isSubmitting ? 'Deleting...' : 'Delete'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="mb-4">
          <CommentForm
            postId={postId}
            parentCommentId={comment._id}
            onCommentAdded={() => {
              setIsReplying(false);
              onCommentUpdated();
            }}
            onCancel={() => setIsReplying(false)}
            placeholder="Write a reply..."
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              postId={postId}
              onCommentUpdated={onCommentUpdated}
              onCommentDeleted={onCommentDeleted}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
