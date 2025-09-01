'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  viewCount: number;
  tags: string[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPosts = async (page = 1, search = '', tag = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
        ...(search && { search }),
        ...(tag && { tag }),
      });

      const response = await axios.get(`/api/posts?${params}`);
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage, searchTerm, selectedTag);
  }, [currentPage, searchTerm, selectedTag]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts(1, searchTerm, selectedTag);
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const popularTags = [
    { name: 'Technology', color: 'from-cyan-500 to-blue-600' },
    { name: 'Travel', color: 'from-emerald-500 to-teal-600' },
    { name: 'Food', color: 'from-orange-500 to-red-600' },
    { name: 'Lifestyle', color: 'from-purple-500 to-pink-600' },
    { name: 'Business', color: 'from-indigo-500 to-purple-600' },
    { name: 'Health', color: 'from-green-500 to-emerald-600' },
    { name: 'Science', color: 'from-violet-500 to-purple-600' },
    { name: 'Art', color: 'from-rose-500 to-pink-600' }
  ];

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent mx-auto"></div>
            <p className="mt-6 text-cyan-100 text-lg">Loading amazing stories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              Dive Into Stories
            </h1>
            <p className="text-xl md:text-2xl text-cyan-100 max-w-3xl mx-auto leading-relaxed">
              Explore the depths of human imagination, share your voice, and connect with writers from around the world in our ocean of creativity.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{pagination?.total || 0}</div>
              <div className="text-cyan-100">Amazing Stories</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-cyan-100">Always Active</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-blue-400 mb-2">Global</div>
              <div className="text-cyan-100">Community</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex max-w-2xl mx-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for stories, authors, or topics..."
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-l-2xl text-cyan-100 placeholder-cyan-200/60 focus:ring-2 focus:ring-cyan-400 focus:border-transparent focus:outline-none"
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-r-2xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 font-semibold"
              >
                Explore
              </button>
            </div>
          </form>

          {/* Popular Tags */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-cyan-100 mb-4">Popular Topics</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {popularTags.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => handleTagFilter(tag.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedTag === tag.name
                      ? `bg-gradient-to-r ${tag.color} text-white shadow-lg scale-105`
                      : 'bg-white/10 backdrop-blur-md text-cyan-100 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-cyan-100 mb-4">Featured Stories</h2>
            <p className="text-cyan-200/80">Discover the most captivating stories from our community</p>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post) => (
              <div key={post._id} className="group">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-12 border border-white/10">
              <svg className="w-16 h-16 text-cyan-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-cyan-100 text-lg mb-4">
                {searchTerm || selectedTag ? 'No stories found matching your criteria.' : 'No stories available yet.'}
              </p>
              <Link 
                href="/create-post"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Write Your First Story
              </Link>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-12 border border-white/10">
            <h3 className="text-3xl font-bold text-cyan-100 mb-4">Ready to Share Your Story?</h3>
            <p className="text-cyan-200/80 mb-8 max-w-2xl mx-auto">
              Join thousands of writers who are already sharing their thoughts, experiences, and creativity with the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/create-post"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 font-semibold text-lg"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Start Writing
              </Link>
              <Link 
                href="/signup"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md text-cyan-100 rounded-full hover:bg-white/20 border border-white/20 transition-all duration-300 font-semibold text-lg"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center">
            <nav className="flex items-center space-x-2 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-cyan-300 hover:text-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'text-cyan-300 hover:text-cyan-100 hover:bg-white/10'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.pages}
                className="px-4 py-2 text-cyan-300 hover:text-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
