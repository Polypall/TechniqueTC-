import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  User, 
  Search, 
  Clock, 
  Settings, 
  PlusCircle, 
  Heart, 
  MessageCircle, 
  Share2,
  AlertCircle,
  Wrench
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { ReportModal } from '../components/ReportModal';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [reportTarget, setReportTarget] = useState<{ id: string, type: 'post' | 'profile' } | null>(null);

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setUser(profile);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(username, avatar_url, role_type)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0b1e] bg-circuit pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-blue px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="https://i.postimg.cc/W3V2QG5t/In_Shot_20251108_192211830.jpg" 
            className="w-10 h-10 rounded-full" 
            alt="Logo" 
          />
          <h1 className="text-xl font-bold tracking-tighter hidden sm:block">TECHNIQUE</h1>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search tech..." 
              className="w-full bg-black/40 border border-blue-500/20 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/match')} className="hover:text-blue-400 transition-colors">
            <Wrench className="w-6 h-6" />
          </button>
          <button onClick={() => navigate('/history')} className="hover:text-blue-400 transition-colors">
            <Clock className="w-6 h-6" />
          </button>
          <button onClick={() => navigate(`/profile/${user?.username}`)} className="hover:text-blue-400 transition-colors">
            <User className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Create Post Placeholder */}
        <div className="glass p-4 rounded-2xl flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex-shrink-0 overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} className="w-full h-full object-cover" />
            ) : (
              <User className="w-full h-full p-2 text-blue-400" />
            )}
          </div>
          <button className="flex-1 text-left px-4 py-2 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 transition-all">
            Share your latest invention...
          </button>
          <PlusCircle className="w-8 h-8 text-blue-500 cursor-pointer hover:scale-110 transition-transform" />
        </div>

        {/* Feed */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl overflow-hidden border border-white/5"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 overflow-hidden">
                    {post.profiles?.avatar_url ? (
                      <img src={post.profiles.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-full h-full p-2 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">@{post.profiles?.username}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 uppercase font-bold">
                        {post.profiles?.role_type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">2h ago</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-xs text-blue-400 font-bold hover:underline">Follow</button>
                  <AlertCircle 
                    className="w-5 h-5 text-red-500/50 hover:text-red-500 cursor-pointer" 
                    onClick={() => setReportTarget({ id: post.id, type: 'post' })}
                  />
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-2">
                <p className="text-gray-200 leading-relaxed">{post.content}</p>
              </div>

              {/* Post Media */}
              {post.media_url && (
                <div className="aspect-video bg-black/40 relative">
                  {post.media_type === 'video' ? (
                    <video src={post.media_url} controls className="w-full h-full object-contain" />
                  ) : (
                    <img src={post.media_url} className="w-full h-full object-contain" />
                  )}
                </div>
              )}

              {/* Post Footer */}
              <div className="p-4 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">{post.likes_count || 0}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{post.comments_count || 0}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-400 hover:text-green-400 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No posts yet. Be the first to share an invention!</p>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-blue border-t border-white/10 px-6 py-3 flex justify-between items-center sm:hidden">
        <Home className="w-6 h-6 text-blue-500" />
        <Search className="w-6 h-6 text-gray-400" />
        <PlusCircle className="w-8 h-8 text-blue-500" />
        <Clock className="w-6 h-6 text-gray-400" />
        <User className="w-6 h-6 text-gray-400" />
      </nav>

      <ReportModal 
        isOpen={!!reportTarget} 
        onClose={() => setReportTarget(null)}
        targetId={reportTarget?.id || ''}
        targetType={reportTarget?.type || 'post'}
      />
    </div>
  );
}
