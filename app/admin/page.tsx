'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Save, LogOut, Shield, Plus, Trash2, Edit, FolderKanban, Newspaper } from 'lucide-react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { fetchGitHubRepos, type GitHubRepo } from '@/lib/github';
import {
  getProjectVisibility,
  saveProjectVisibility,
  type ProjectVisibility,
} from '@/lib/projectSettings';
import {
  getAllBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  toggleBlogPublished,
  type BlogPost,
} from '@/lib/blogManagement';
import { useRouter } from 'next/navigation';

type TabType = 'projects' | 'blogs';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [visibility, setVisibility] = useState<ProjectVisibility>({});
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Blog states
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    readTime: '',
    category: '',
    published: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      setLoading(false);
      if (user) {
        loadProjects();
        loadBlogs();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadProjects = async () => {
    setProjectsLoading(true);
    try {
      const repos = await fetchGitHubRepos();
      setProjects(repos);
      setVisibility(getProjectVisibility());
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setProjectsLoading(false);
    }
  };

  const loadBlogs = () => {
    setBlogs(getAllBlogs());
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBlog) {
      updateBlog(editingBlog.id, {
        ...blogForm,
        date: editingBlog.date,
      });
    } else {
      addBlog({
        ...blogForm,
        date: new Date().toISOString().split('T')[0],
      });
    }
    
    loadBlogs();
    resetBlogForm();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetBlogForm = () => {
    setBlogForm({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      readTime: '',
      category: '',
      published: true,
    });
    setEditingBlog(null);
    setShowBlogForm(false);
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content || '',
      image: blog.image,
      readTime: blog.readTime,
      category: blog.category,
      published: blog.published,
    });
    setShowBlogForm(true);
  };

  const handleDeleteBlog = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deleteBlog(id);
      loadBlogs();
    }
  };

  const handleToggleBlogPublished = (id: string) => {
    toggleBlogPublished(id);
    loadBlogs();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
      setPassword('');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const toggleVisibility = (repoId: number) => {
    const newVisibility = {
      ...visibility,
      [repoId]: !visibility[repoId],
    };
    setVisibility(newVisibility);
  };

  const handleSave = () => {
    saveProjectVisibility(visibility);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      window.location.reload();
    }, 1000);
  };

  const isVisible = (repoId: number) => {
    return visibility[repoId] !== false;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] via-[#111] to-[#0A0A0A]">
        <div className="animate-spin w-12 h-12 border-4 border-[#00FF94] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111] to-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto p-6">
        {!authenticated ? (
          // Login Form
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mt-20"
          >
            <div className="glass-card p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[#00FF94]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-10 h-10 text-[#00FF94]" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
                <p className="text-gray-400 text-sm">
                  Sign in with your Firebase credentials
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email</label>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#1A1A1A] border-gray-600 focus:border-[#00FF94] text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#1A1A1A] border-gray-600 focus:border-[#00FF94] text-white"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#00FF94] text-black hover:bg-[#00E085] font-semibold py-3"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Sign In
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="text-sm text-gray-400 hover:text-[#00FF94] transition-colors"
                  >
                    ← Back to portfolio
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          // Admin Dashboard
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#00FF94] rounded-lg flex items-center justify-center">
                    <Shield className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-sm text-gray-400">
                      {activeTab === 'projects' ? 'Manage project visibility' : 'Manage blog posts'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push('/')}
                    className="text-sm text-gray-400 hover:text-[#00FF94] transition-colors"
                  >
                    View Portfolio →
                  </button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'projects'
                      ? 'bg-[#00FF94] text-black font-semibold'
                      : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
                  }`}
                >
                  <FolderKanban className="w-4 h-4" />
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab('blogs')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'blogs'
                      ? 'bg-[#00FF94] text-black font-semibold'
                      : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
                  }`}
                >
                  <Newspaper className="w-4 h-4" />
                  Blogs
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="glass-card p-6">
              {activeTab === 'projects' ? (
                // Projects Tab
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">
                        Manage Projects ({projects.length})
                      </h2>
                      <p className="text-sm text-gray-400">
                        Toggle projects to show or hide them from your portfolio
                      </p>
                    </div>
                  </div>

                  {projectsLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin w-8 h-8 border-2 border-[#00FF94] border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-gray-400 mt-4">Loading projects...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.map((project) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 rounded-lg border transition-all ${
                            isVisible(project.id)
                              ? 'bg-[#1A1A1A] border-[#00FF94]/30'
                              : 'bg-[#0A0A0A] border-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-lg">
                                  {project.name.replace(/-/g, ' ').replace(/_/g, ' ')}
                                </h4>
                                {project.language && (
                                  <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                                    {project.language}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-400 line-clamp-2">
                                {project.description || 'No description'}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>⭐ {project.stargazers_count}</span>
                                <span>🔱 {project.forks_count}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => toggleVisibility(project.id)}
                              className={`
                                relative w-14 h-7 rounded-full transition-colors duration-300
                                ${isVisible(project.id) ? 'bg-[#00FF94]' : 'bg-gray-600'}
                              `}
                            >
                              <motion.div
                                layout
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className={`
                                  absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center
                                  ${isVisible(project.id) ? 'right-0.5' : 'left-0.5'}
                                `}
                              >
                                {isVisible(project.id) ? (
                                  <Eye className="w-3 h-3 text-[#00FF94]" />
                                ) : (
                                  <EyeOff className="w-3 h-3 text-gray-600" />
                                )}
                              </motion.div>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {projects.length > 0 && (
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={handleSave}
                        className="bg-[#00FF94] text-black hover:bg-[#00E085] font-semibold"
                        disabled={saved}
                      >
                        {saved ? (
                          <>✓ Saved!</>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                // Blogs Tab
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">
                        Manage Blog Posts ({blogs.length})
                      </h2>
                      <p className="text-sm text-gray-400">
                        Create, edit, and manage your blog content
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowBlogForm(!showBlogForm)}
                      className="bg-[#00FF94] text-black hover:bg-[#00E085]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Post
                    </Button>
                  </div>

                  {showBlogForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-6 bg-[#1A1A1A] rounded-lg border border-gray-700"
                    >
                      <h3 className="text-lg font-semibold mb-4">
                        {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                      </h3>
                      <form onSubmit={handleBlogSubmit} className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Title</label>
                          <Input
                            value={blogForm.title}
                            onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                            placeholder="Blog title"
                            className="bg-[#0A0A0A] border-gray-600 text-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Excerpt</label>
                          <Textarea
                            value={blogForm.excerpt}
                            onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                            placeholder="Short description"
                            className="bg-[#0A0A0A] border-gray-600 text-white"
                            rows={2}
                            required
                          />
                        </div>

                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Content</label>
                          <Textarea
                            value={blogForm.content}
                            onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                            placeholder="Full blog content (Markdown supported)"
                            className="bg-[#0A0A0A] border-gray-600 text-white"
                            rows={6}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">Image URL</label>
                            <Input
                              value={blogForm.image}
                              onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                              placeholder="https://..."
                              className="bg-[#0A0A0A] border-gray-600 text-white"
                            />
                          </div>

                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">Read Time</label>
                            <Input
                              value={blogForm.readTime}
                              onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                              placeholder="5 min read"
                              className="bg-[#0A0A0A] border-gray-600 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Category</label>
                          <Input
                            value={blogForm.category}
                            onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                            placeholder="Technology, Tutorial, etc."
                            className="bg-[#0A0A0A] border-gray-600 text-white"
                            required
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="published"
                            checked={blogForm.published}
                            onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <label htmlFor="published" className="text-sm text-gray-400">
                            Publish immediately
                          </label>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            type="submit"
                            className="bg-[#00FF94] text-black hover:bg-[#00E085]"
                          >
                            {editingBlog ? 'Update Post' : 'Create Post'}
                          </Button>
                          <Button
                            type="button"
                            onClick={resetBlogForm}
                            variant="outline"
                            className="border-gray-600"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  <div className="space-y-3">
                    {blogs.map((blog) => (
                      <motion.div
                        key={blog.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-[#1A1A1A] rounded-lg border border-gray-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">{blog.title}</h4>
                              <span className={`text-xs px-2 py-1 rounded ${
                                blog.published 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-gray-600/20 text-gray-400'
                              }`}>
                                {blog.published ? 'Published' : 'Draft'}
                              </span>
                              <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                                {blog.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">{blog.excerpt}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{blog.date}</span>
                              <span>{blog.readTime}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleToggleBlogPublished(blog.id)}
                              variant="outline"
                              size="sm"
                              className="border-gray-600"
                            >
                              {blog.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              onClick={() => handleEditBlog(blog)}
                              variant="outline"
                              size="sm"
                              className="border-gray-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteBlog(blog.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {blogs.length === 0 && (
                      <div className="text-center py-12 text-gray-400">
                        <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No blog posts yet. Create your first post!</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
