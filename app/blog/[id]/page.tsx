'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollProgress from '@/components/ScrollProgress';
import BackToTop from '@/components/BackToTop';
import type { BlogPost } from '@/lib/blogManagement';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setBlog({
            ...data.data,
            id: data.data._id,
          });
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBlog();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <ScrollProgress />
        
        {/* Header Skeleton */}
        <div className="fixed top-0 left-0 right-0 z-50 glass-card backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-10 w-40 bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="pt-24 pb-20">
          <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Image Skeleton */}
            <div className="mb-8 rounded-2xl overflow-hidden bg-gray-800 h-[500px] animate-pulse"></div>

            {/* Category Skeleton */}
            <div className="mb-6">
              <div className="h-8 w-24 bg-gray-800 rounded-full animate-pulse"></div>
            </div>

            {/* Title Skeleton */}
            <div className="mb-4 space-y-3">
              <div className="h-16 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-16 bg-gray-800 rounded w-3/4 animate-pulse"></div>
            </div>

            {/* Author Skeleton */}
            <div className="mb-6">
              <div className="h-6 w-40 bg-gray-800 rounded animate-pulse"></div>
            </div>

            {/* Meta Skeleton */}
            <div className="flex items-center gap-6 mb-12 pb-8 border-b border-gray-800">
              <div className="h-5 w-32 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-5 w-24 bg-gray-800 rounded animate-pulse"></div>
            </div>

            {/* Excerpt Skeleton */}
            <div className="mb-12 border-l-4 border-gray-700 pl-6 py-2 space-y-3">
              <div className="h-6 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-800 rounded w-2/3 animate-pulse"></div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-5 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-5 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-5 bg-gray-800 rounded w-5/6 animate-pulse"></div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
          <Button onClick={() => router.push('/#blog')} className="bg-[#00FF94] text-black">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <ScrollProgress />
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 glass-card backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            onClick={() => router.push('/#blog')}
            variant="ghost"
            className="text-gray-300 hover:text-[#00FF94]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-24 pb-20">
        <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Image */}
          {blog.image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-2xl overflow-hidden neon-glow-strong"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-[500px] object-cover"
              />
            </motion.div>
          )}

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <span className="px-4 py-2 bg-[#00FF94] text-black text-sm font-semibold rounded-full">
              {blog.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-4 text-white leading-tight"
          >
            {blog.title}
          </motion.h1>

          {/* Author */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg text-gray-400 mb-6"
          >
            By <span className="text-white font-semibold">Yameen Rafiqi</span>
          </motion.div>

          {/* Date and Read Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-6 text-gray-400 mb-12 pb-8 border-b border-gray-800"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(blog.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{blog.readTime}</span>
            </div>
          </motion.div>

          {/* Excerpt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl leading-relaxed text-gray-300 mb-12 italic border-l-4 border-[#00FF94] pl-6 py-2 article-excerpt"
          >
            {blog.excerpt}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="article-content"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content || blog.excerpt}
            </ReactMarkdown>
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-gray-700"
          >
            <Button
              onClick={() => router.push('/#blog')}
              className="bg-[#00FF94] text-black hover:bg-[#00E085] px-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Read More Posts
            </Button>
          </motion.div>
        </article>
      </div>

      <BackToTop />
    </main>
  );
}
