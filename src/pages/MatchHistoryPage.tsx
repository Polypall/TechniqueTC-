import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  Home, 
  Wrench, 
  AlertCircle, 
  PhoneIncoming, 
  User,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function MatchHistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch calls where user was either caller or callee
      const { data, error } = await supabase
        .from('match_calls')
        .select('*, caller:profiles!caller_id(username, avatar_url, role_type), callee:profiles!callee_id(username, avatar_url, role_type)')
        .or(`caller_id.eq.${user.id},callee_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b1e] bg-circuit p-6">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <Clock className="w-10 h-10 text-blue-400" />
          <h1 className="text-3xl font-bold border-b-2 border-white">Match history</h1>
        </div>
        <button onClick={() => navigate('/home')} className="p-3 glass rounded-full hover:bg-white/10 transition-all">
          <Home className="w-8 h-8" />
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {history.map((call) => {
            const otherUser = call.caller_id === history[0]?.caller_id ? call.callee : call.caller;
            return (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-blue rounded-[2.5rem] overflow-hidden aspect-[3/4] relative group"
              >
                <img 
                  src={otherUser?.avatar_url || `https://picsum.photos/seed/${otherUser?.username}/400/600`} 
                  className="w-full h-full object-cover"
                  alt={otherUser?.username}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                <div className="absolute top-6 right-6 text-right">
                  <h3 className="text-lg font-bold text-white">{otherUser?.username}</h3>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wrench className="w-6 h-6 text-gray-400 cursor-pointer hover:text-blue-400" />
                    <AlertCircle className="w-6 h-6 text-red-500/50 cursor-pointer hover:text-red-500" />
                  </div>
                  <PhoneIncoming className="w-6 h-6 text-green-400" />
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500">No match history yet.</p>
        </div>
      )}
    </div>
  );
}
