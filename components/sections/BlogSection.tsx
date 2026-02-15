'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, ArrowRight, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPublishedBlogs, type BlogPost } from '@/lib/blogManagement';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SkeletonBlogCard } from '@/components/LoadingSkeletons';

const BlogSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs?published=true');
        const data = await response.json();
        if (data.success) {
          setBlogPosts(data.data.map((blog: any) => ({
            ...blog,
            id: blog._id,
          })));
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="blog" className="py-20 bg-[#111111]" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Latest <span className="gradient-text">Blog Posts</span>
          </motion.h2>

          {loading ? (
            // Loading State with Skeletons
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <SkeletonBlogCard key={i} />
              ))}
            </div>
          ) : blogPosts.length === 0 ? (
            // Coming Soon Message
            <motion.div
              variants={itemVariants}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-[#00FF94]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-12 h-12 text-[#00FF94]" />
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Blog <span className="gradient-text">Coming Soon</span>
              </h3>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Exciting content is on the way! I'll be sharing insights about web development, 
                automation, cyber security, and my journey in tech. Stay tuned!
              </p>
            </motion.div>
          ) : (
            // Blog Posts Grid
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <motion.article
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="glass-card overflow-hidden group hover:neon-glow transition-all duration-500 cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#00FF94] text-black text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <Clock className="w-4 h-4 ml-4 mr-2" />
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-xl font-semibold mb-3 group-hover:text-[#00FF94] transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center text-[#00FF94] text-sm font-semibold"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              className="border-[#00FF94] text-[#00FF94] hover:bg-[#00FF94] hover:text-black px-8 py-3 text-lg"
            >
              View All Posts
            </Button>
          </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;