/**
 * Blog Management System
 * Handles blog post creation, storage, and retrieval
 */

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  published: boolean;
}

const BLOG_STORAGE_KEY = 'portfolio_blogs';

/**
 * Get all blog posts from localStorage
 */
export function getAllBlogs(): BlogPost[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(BLOG_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading blogs:', error);
    return [];
  }
}

/**
 * Get only published blog posts
 */
export function getPublishedBlogs(): BlogPost[] {
  return getAllBlogs().filter(blog => blog.published);
}

/**
 * Save blogs to localStorage
 */
export function saveBlogs(blogs: BlogPost[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(blogs));
  } catch (error) {
    console.error('Error saving blogs:', error);
  }
}

/**
 * Add a new blog post
 */
export function addBlog(blog: Omit<BlogPost, 'id'>): BlogPost {
  const blogs = getAllBlogs();
  const newBlog: BlogPost = {
    ...blog,
    id: Date.now().toString(),
  };
  
  blogs.push(newBlog);
  saveBlogs(blogs);
  
  return newBlog;
}

/**
 * Update an existing blog post
 */
export function updateBlog(id: string, updates: Partial<BlogPost>): boolean {
  const blogs = getAllBlogs();
  const index = blogs.findIndex(blog => blog.id === id);
  
  if (index === -1) return false;
  
  blogs[index] = { ...blogs[index], ...updates };
  saveBlogs(blogs);
  
  return true;
}

/**
 * Delete a blog post
 */
export function deleteBlog(id: string): boolean {
  const blogs = getAllBlogs();
  const filtered = blogs.filter(blog => blog.id !== id);
  
  if (filtered.length === blogs.length) return false;
  
  saveBlogs(filtered);
  return true;
}

/**
 * Toggle blog published status
 */
export function toggleBlogPublished(id: string): boolean {
  const blogs = getAllBlogs();
  const blog = blogs.find(b => b.id === id);
  
  if (!blog) return false;
  
  blog.published = !blog.published;
  saveBlogs(blogs);
  
  return true;
}
