'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollProgress from '@/components/ScrollProgress';
import BackToTop from '@/components/BackToTop';
import type { BlogPost } from '@/lib/blogManagement';

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
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#00FF94] border-t-transparent rounded-full"></div>
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
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="w-full h-[400px] object-cover"
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
            className="text-4xl md:text-5xl font-bold mb-6 gradient-text"
          >
            {blog.title}
          </motion.h1>

          {/* Date and Read Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-6 text-gray-400 mb-8 pb-8 border-b border-gray-700"
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
            className="text-xl text-gray-300 mb-8 p-6 glass-card rounded-xl border-l-4 border-[#00FF94]"
            dangerouslySetInnerHTML={{ __html: blog.excerpt }}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="prose prose-invert prose-lg max-w-none 
              prose-headings:text-[#00FF94] 
              prose-headings:font-bold 
              prose-a:text-[#00FF94] 
              prose-a:no-underline 
              prose-a:hover:underline
              prose-strong:text-[#00FF94]
              prose-code:text-[#00FF94]
              prose-code:bg-gray-800
              prose-code:px-2
              prose-code:py-1
              prose-code:rounded
              prose-pre:bg-gray-800
              prose-pre:border
              prose-pre:border-gray-700
              prose-img:rounded-lg
              prose-hr:border-gray-700"
            dangerouslySetInnerHTML={{ __html: blog.content || blog.excerpt }}
          />

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
