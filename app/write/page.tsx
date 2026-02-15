'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Send, LogOut, ArrowLeft, Image as ImageIcon, X, Eye, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function WritePage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userUid, setUserUid] = useState('');
  const [displayName, setDisplayName] = useState('');

  const [posts, setPosts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    readTime: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthenticated(true);
        setUserEmail(user.email || '');
        setUserUid(user.uid);
        setDisplayName(user.displayName || user.email?.split('@')[0] || '');
        await loadUserPosts(user.uid);
      } else {
        setAuthenticated(false);
        router.push('/signup');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadUserPosts = async (uid: string) => {
    try {
      const response = await fetch(`/api/blogs?uid=${uid}`);
      const data = await response.json();
      if (data.success) {
        setPosts(data.data.map((post: any) => ({ ...post, id: post._id })));
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData({ ...formData, image: base64 });
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create the post
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: new Date().toISOString().split('T')[0],
          published: false,
          status: 'draft',
          author: {
            uid: userUid,
            email: userEmail,
            displayName: displayName,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        const postId = data.data._id;

        // Submit for approval
        const approvalResponse = await fetch('/api/blogs/approval', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId,
            uid: userUid,
          }),
        });

        const approvalData = await approvalResponse.json();
        if (approvalData.success) {
          toast.success('Post submitted for approval! You will be notified once it is reviewed.');
          setShowForm(false);
          resetForm();
          await loadUserPosts(userUid);
        }
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      toast.error('Failed to submit post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      category: '',
      readTime: '',
    });
    setImagePreview('');
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111] to-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111] to-[#0A0A0A] text-white">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF94] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Portfolio
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Write & Submit</h1>
              <p className="text-sm text-gray-400">Logged in as {userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#00FF94] text-black hover:bg-[#00E085]"
            >
              <Pencil className="w-4 h-4 mr-2" />
              {showForm ? 'Cancel' : 'New Post'}
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

        {/* Write Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-8"
          >
            <h2 className="text-xl font-bold mb-6">Create New Blog Post</h2>
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Your amazing blog title"
                  className="bg-[#1A1A1A] border-gray-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Excerpt *</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A short summary of your post (2-3 sentences)"
                  className="bg-[#1A1A1A] border-gray-600 text-white"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Content * (Markdown supported)
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your post using Markdown:&#10;# Heading&#10;**bold** *italic*&#10;- List item&#10;[Link](url)"
                  className="bg-[#1A1A1A] border-gray-600 text-white font-mono text-sm"
                  rows={12}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Category *</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Technology, Tutorial"
                    className="bg-[#1A1A1A] border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Read Time *</label>
                  <Input
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g., 5 min read"
                    className="bg-[#1A1A1A] border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Featured Image *</label>
                <div className="space-y-3">
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Image URL or upload below"
                    className="bg-[#1A1A1A] border-gray-600 text-white"
                  />
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className="px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded-lg hover:border-[#00FF94] transition-colors text-center">
                        <ImageIcon className="w-4 h-4 inline mr-2" />
                        Upload Image
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, image: '' });
                          setImagePreview('');
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#00FF94] text-black hover:bg-[#00E085] font-semibold py-3"
              >
                {submitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit for Approval
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        )}

        {/* User's Posts */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-6">Your Posts</h2>
          <div className="space-y-3">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-[#1A1A1A] rounded-lg border border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          post.status === 'approved'
                            ? 'bg-green-500/20 text-green-400'
                            : post.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : post.status === 'rejected'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-600/20 text-gray-400'
                        }`}
                      >
                        {post.status?.toUpperCase() || 'DRAFT'}
                      </span>
                      {post.published && (
                        <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                          PUBLISHED
                        </span>
                      )}
                      {post.rejectionReason && (
                        <span className="text-xs text-red-400">
                          Reason: {post.rejectionReason}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Pencil className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No posts yet. Create your first post!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
