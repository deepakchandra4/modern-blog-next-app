'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import CommentForm from '@/components/CommentForm';
import CommentComponent from '@/components/Comment';

interface PostAuthor {
  _id: string;
  name: string;
  avatar: string;
  bio: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  author: PostAuthor;
  createdAt: string;
  viewCount: number;
  tags: string[];
  likes: string[];
}

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

export default function PostPage() {
  const params = useParams();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPost = useCallback(async () => {
    try {
      const response = await axios.get(`/api/posts/${postId}`);
      setPost(response.data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load post';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`/api/posts/${postId}/comments`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId, fetchPost, fetchComments]);

  const handleCommentAdded = () => {
    fetchComments();
  };

  const handleCommentUpdated = () => {
    fetchComments();
  };

  const handleCommentDeleted = () => {
    fetchComments();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent mx-auto"></div>
            <p className="mt-6 text-cyan-100 text-lg">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-100 mb-4">Post Not Found</h1>
            <p className="text-cyan-200/80">{error || 'The post you are looking for does not exist.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <article className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-4 mb-6">
            {post.author.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={48}
                height={48}
                className="rounded-full border-2 border-cyan-400/30"
                onError={(e) => {
                  // Fallback to initials if avatar fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-cyan-400/30 ${post.author.avatar ? 'hidden' : ''}`}>
              <span className="text-white font-semibold">
                {post.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div>
              <p className="font-medium text-cyan-100">{post.author.name}</p>
              <p className="text-sm text-cyan-200/60">{formatDate(post.createdAt)}</p>
            </div>
            
            <div className="ml-auto flex items-center gap-1 text-sm text-cyan-200/60">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.viewCount} views
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded-full border border-cyan-400/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.imageUrl ? (
          <div className="relative h-96 w-full mb-8 rounded-2xl overflow-hidden border border-white/10">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center hidden">
              <svg className="w-24 h-24 text-cyan-300/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="relative h-96 w-full mb-8 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
            <svg className="w-24 h-24 text-cyan-300/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Post Content */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 mb-12 border border-white/10">
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-cyan-100 leading-relaxed text-lg">
              {post.content}
            </div>
          </div>
        </div>

        {/* Author Bio */}
        {post.author.bio && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/10">
            <h3 className="text-xl font-semibold text-cyan-100 mb-3">About the Author</h3>
            <p className="text-cyan-200/80">{post.author.bio}</p>
          </div>
        )}

        {/* Comments Section */}
        <section className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-cyan-100 mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          <CommentForm
            postId={postId}
            onCommentAdded={handleCommentAdded}
          />

          {/* Comments List */}
          <div className="space-y-6 mt-8">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentComponent
                  key={comment._id}
                  comment={comment}
                  postId={postId}
                  onCommentUpdated={handleCommentUpdated}
                  onCommentDeleted={handleCommentDeleted}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-cyan-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-cyan-200/80">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </section>
      </article>
    </div>
  );
}
