import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  User, 
  Settings, 
  Clock, 
  Wrench, 
  Home, 
  FileText, 
  PlusCircle,
  Heart,
  MessageCircle,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { ReportModal } from '../components/ReportModal';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      setProfile(data);
      setIsOwnProfile(user?.id === data.id);
      
      // Fetch user's posts
      const { data: userPosts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', data.id)
        .order('created_at', { ascending: false });
      
      setPosts(userPosts || []);
    } catch (error: any) {
      toast.error('Profile not found');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return <div className="min-h-screen bg-[#0a0b1e] flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0a0b1e] bg-circuit">
      {/* Profile Header */}
      <div className="relative h-64 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-b border-white/5">
        <div className="absolute top-6 left-6 flex gap-4">
          <button onClick={() => navigate('/home')} className="p-3 glass rounded-full hover:bg-white/10 transition-all">
            <Home className="w-6 h-6" />
          </button>
          <button className="p-3 glass rounded-full hover:bg-white/10 transition-all">
            <Wrench className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute top-6 right-6 flex gap-4">
          {!isOwnProfile && (
            <button 
              onClick={() => setIsReportModalOpen(true)}
              className="p-3 glass rounded-full hover:bg-red-500/20 text-red-400 transition-all"
            >
              <AlertCircle className="w-6 h-6" />
            </button>
          )}
          <button className="p-3 glass rounded-full hover:bg-white/10 transition-all">
            <Settings className="w-6 h-6" />
          </button>
          {isOwnProfile && (
            <button onClick={handleLogout} className="p-3 glass rounded-full hover:bg-red-500/20 text-red-400 transition-all">
              <LogOut className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Profile Info Card */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-lg px-6">
          <div className="glass-blue rounded-[2.5rem] p-8 flex flex-col items-center text-center relative">
            {/* Avatar */}
            <div className="absolute -top-16 w-32 h-32 rounded-full bg-[#0a0b1e] p-1">
              <div className="w-full h-full rounded-full bg-blue-500/20 overflow-hidden border-4 border-blue-500/30">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-full h-full p-6 text-blue-400" />
                )}
              </div>
            </div>

            <div className="mt-16 space-y-2">
              <h1 className="text-3xl font-bold text-white">{profile?.full_name || profile?.username}</h1>
              <p className="text-blue-400 font-mono text-sm">@{profile?.username}</p>
              
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {profile?.professions?.map((p: string) => (
                  <span key={p} className="text-[10px] px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 uppercase font-bold">
                    {p}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 text-left">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Bio</p>
                  <p className="text-xs text-gray-300 leading-relaxed">{profile?.bio || 'No bio yet.'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Education</p>
                  <p className="text-xs text-gray-300">{profile?.college || 'Not specified'}</p>
                </div>
              </div>

              <div className="pt-6 flex justify-center">
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center group-hover:bg-blue-500/10 transition-all">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Resume</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-32 max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Posts</h2>
          <div className="flex gap-4">
            <button className="p-2 glass rounded-full hover:bg-white/10 transition-all">
              <Clock className="w-5 h-5" />
            </button>
            <button className="p-2 glass rounded-full hover:bg-white/10 transition-all">
              <PlusCircle className="w-5 h-5 text-blue-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              whileHover={{ scale: 1.02 }}
              className="glass rounded-2xl overflow-hidden aspect-square relative group cursor-pointer"
            >
              {post.media_url ? (
                <img src={post.media_url} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full p-4 flex items-center justify-center text-center text-xs text-gray-500">
                  {post.content}
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <div className="flex items-center gap-1 text-white">
                  <Heart className="w-4 h-4 fill-white" />
                  <span className="text-xs font-bold">{post.likes_count || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-white">
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span className="text-xs font-bold">{post.comments_count || 0}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12 glass rounded-2xl">
            <p className="text-gray-500">No posts yet.</p>
          </div>
        )}
      </div>

      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetId={profile?.id || ''}
        targetType="profile"
      />
    </div>
  );
}
