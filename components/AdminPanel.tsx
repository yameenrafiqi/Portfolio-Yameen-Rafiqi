'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff, Save, LogOut, Shield, Plus, Trash2, Edit, FolderKanban, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { fetchGitHubRepos, type GitHubRepo } from '@/lib/github';
import {
  getProjectVisibility,
  saveProjectVisibility,
  verifyAdminPassword,
  isAuthenticated,
  setAuthenticated,
  logout,
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

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'projects' | 'blogs';

const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const [authenticated, setAuthState] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [visibility, setVisibility] = useState<ProjectVisibility>({});
  const [loading, setLoading] = useState(true);
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
    if (isOpen) {
      setAuthState(isAuthenticated());
      loadProjects();
      loadBlogs();
    }
  }, [isOpen]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const repos = await fetchGitHubRepos();
      setProjects(repos);
      setVisibility(getProjectVisibility());
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(password)) {
      setAuthenticated(true);
      setAuthState(true);
      setError('');
      setPassword('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    logout();
    setAuthState(false);
    onClose();
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
      onClose();
      // Reload the page to reflect changes
      window.location.reload();
    }, 1000);
  };

  const isVisible = (repoId: number) => {
    return visibility[repoId] !== false;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00FF94] rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Admin Panel</h2>
                  <p className="text-sm text-gray-400">
                    {activeTab === 'projects' ? 'Manage project visibility' : 'Manage blog posts'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Tabs */}
            {authenticated && (
              <div className="flex gap-2">
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
            )}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {!authenticated ? (
              // Login Form
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto"
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-[#00FF94]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-10 h-10 text-[#00FF94]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
                  <p className="text-gray-400 text-sm">
                    Enter your admin password to continue
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Input
                      type="password"
                      placeholder="Admin Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-[#1A1A1A] border-gray-600 focus:border-[#00FF94] text-white"
                      autoFocus
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#00FF94] text-black hover:bg-[#00E085] font-semibold py-3"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Default password: yameen@2026
                  </p>
                </form>
              </motion.div>
            ) : (
              // Project Management or Blog Management
              <div>
                {activeTab === 'projects' ? (
                  // Projects Tab
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          Manage Projects ({projects.length})
                        </h3>
                        <p className="text-sm text-gray-400">
                          Toggle projects to show or hide them from your portfolio
                        </p>
                      </div>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>

                    {loading ? (
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
                  </>
                ) : (
                  // Blogs Tab
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          Manage Blogs ({blogs.length})
                        </h3>
                        <p className="text-sm text-gray-400">
                          Create and manage your blog posts
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setShowBlogForm(!showBlogForm)}
                          className="bg-[#00FF94] text-black hover:bg-[#00E085]"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          New Post
                        </Button>
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

                    {/* Blog Form */}
                    {showBlogForm && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleBlogSubmit}
                        className="mb-6 p-6 bg-[#1A1A1A] rounded-lg border border-[#00FF94]/30"
                      >
                        <h4 className="text-lg font-semibold mb-4">
                          {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Title</label>
                            <Input
                              value={blogForm.title}
                              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                              placeholder="Enter blog title"
                              className="bg-[#0A0A0A] border-gray-600 text-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Excerpt</label>
                            <Textarea
                              value={blogForm.excerpt}
                              onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                              placeholder="Short description of the blog post"
                              className="bg-[#0A0A0A] border-gray-600 text-white"
                              rows={3}
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Content</label>
                            <Textarea
                              value={blogForm.content}
                              onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                              placeholder="Write your blog content here... (supports markdown)"
                              className="bg-[#0A0A0A] border-gray-600 text-white"
                              rows={10}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Full blog content (optional - for future blog page implementation)
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-gray-400 mb-1 block">Category</label>
                              <Input
                                value={blogForm.category}
                                onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                                placeholder="e.g., Development, Personal"
                                className="bg-[#0A0A0A] border-gray-600 text-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-400 mb-1 block">Read Time</label>
                              <Input
                                value={blogForm.readTime}
                                onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                                placeholder="e.g., 5 min read"
                                className="bg-[#0A0A0A] border-gray-600 text-white"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Image URL</label>
                            <Input
                              value={blogForm.image}
                              onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                              placeholder="https://example.com/image.jpg"
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
                          <div className="flex gap-2">
                            <Button
                              type="submit"
                              className="bg-[#00FF94] text-black hover:bg-[#00E085]"
                            >
                              {editingBlog ? 'Update Post' : 'Create Post'}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={resetBlogForm}
                              className="border-gray-600 hover:bg-[#1A1A1A]"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </motion.form>
                    )}

                    {/* Blog List */}
                    <div className="space-y-3">
                      {blogs.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                          <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No blog posts yet. Create your first post!</p>
                        </div>
                      ) : (
                        blogs.map((blog) => (
                          <motion.div
                            key={blog.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 rounded-lg border transition-all ${
                              blog.published
                                ? 'bg-[#1A1A1A] border-[#00FF94]/30'
                                : 'bg-[#0A0A0A] border-gray-700'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-lg">{blog.title}</h4>
                                  <span className="text-xs px-2 py-1 bg-[#00FF94] text-black rounded">
                                    {blog.category}
                                  </span>
                                  {!blog.published && (
                                    <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                                      Draft
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                                  {blog.excerpt}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>{new Date(blog.date).toLocaleDateString()}</span>
                                  <span>{blog.readTime}</span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleToggleBlogPublished(blog.id)}
                                  className={`p-2 rounded transition-colors ${
                                    blog.published
                                      ? 'bg-[#00FF94] text-black'
                                      : 'bg-gray-600 text-white'
                                  }`}
                                  title={blog.published ? 'Published' : 'Draft'}
                                >
                                  {blog.published ? (
                                    <Eye className="w-4 h-4" />
                                  ) : (
                                    <EyeOff className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleEditBlog(blog)}
                                  className="p-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBlog(blog.id)}
                                  className="p-2 bg-red-500 rounded hover:bg-red-600 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {authenticated && !loading && activeTab === 'projects' && (
            <div className="border-t border-gray-700 p-6 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {projects.filter((p) => isVisible(p.id)).length} of {projects.length} projects visible
              </p>
              <Button
                onClick={handleSave}
                disabled={saved}
                className={`
                  font-semibold px-6 py-3
                  ${saved ? 'bg-green-500' : 'bg-[#00FF94]'}
                  text-black hover:bg-[#00E085]
                `}
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
          
          {authenticated && activeTab === 'blogs' && saved && (
            <div className="border-t border-gray-700 p-6 text-center">
              <p className="text-[#00FF94] font-semibold">✓ Blog saved successfully!</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminPanel;
