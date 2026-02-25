import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Home,
  AlertCircle,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';
import { GoogleGenAI } from "@google/genai";

export default function MatchPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'inventor' | 'startup' | 'investor'>('inventor');
  const [matches, setMatches] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCalling, setIsCalling] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [aiResponse, setAiResponse] = useState<string>('Analyzing compatibility...');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchMatches();
  }, [activeFilter]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setCurrentUser(profile);
    }
  };

  useEffect(() => {
    let timer: any;
    if (isCalling && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
      if (countdown === 19) {
        generateAiMatch();
      }
    } else if (countdown === 0) {
      setIsCalling(false);
      setCountdown(20);
      setAiResponse('Analyzing compatibility...');
      toast.success('Call ended');
    }
    return () => clearInterval(timer);
  }, [isCalling, countdown]);

  const generateAiMatch = async () => {
    if (!currentMatch || !currentUser) return;

    try {
      // Safe access to process.env for Vite environment
      const apiKey = typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : null;
      if (!apiKey) {
        setAiResponse("Technical synergy detected. Proceed with collaboration!");
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the compatibility between these two users for a tech collaboration platform called TECHNIQUE.
        
        User 1 (Current User):
        Name: ${currentUser.full_name}
        Role: ${currentUser.role_type}
        Specialties: ${currentUser.professions?.join(', ')}
        Bio: ${currentUser.bio}
        
        User 2 (Potential Match):
        Name: ${currentMatch.full_name}
        Role: ${currentMatch.role_type}
        Specialties: ${currentMatch.professions?.join(', ')}
        Bio: ${currentMatch.bio}
        
        Provide a brief (2-3 sentences), highly enthusiastic "Live A.I Match" analysis explaining why they should work together. Focus on technical synergy.`,
      });

      setAiResponse(response.text || "Connection established. Start your collaboration!");
    } catch (error) {
      console.error('AI Error:', error);
      setAiResponse("Technical synergy detected. Proceed with collaboration!");
    }
  };

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // In a real app, we'd call the RPC function `get_compatible_matches`
      // For now, we'll fetch profiles of the selected role
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role_type', activeFilter)
        .neq('id', user.id)
        .limit(10);

      if (error) throw error;
      setMatches(data || []);
      setCurrentIndex(0);
    } catch (error: any) {
      toast.error('Failed to find matches');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentMatch = matches[currentIndex];

  return (
    <div className="min-h-screen bg-[#0a0b1e] bg-circuit flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <button onClick={() => navigate('/home')} className="p-2 glass rounded-full hover:bg-white/10 transition-all">
          <Home className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold border-b-2 border-white pb-1">Match with</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Filters */}
      <div className="flex justify-center gap-4 px-6 py-4">
        <button 
          onClick={() => setActiveFilter('inventor')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${activeFilter === 'inventor' ? 'bg-red-500 text-white' : 'bg-red-500/20 text-red-400'}`}
        >
          Inventor
        </button>
        <button 
          onClick={() => setActiveFilter('startup')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${activeFilter === 'startup' ? 'bg-purple-600 text-white' : 'bg-purple-600/20 text-purple-400'}`}
        >
          Start up
        </button>
        <button 
          onClick={() => setActiveFilter('investor')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${activeFilter === 'investor' ? 'bg-yellow-500 text-white' : 'bg-yellow-500/20 text-yellow-400'}`}
        >
          Investor
        </button>
      </div>

      {/* Match Card Area */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-4 p-4 glass rounded-full disabled:opacity-20 hover:bg-white/10 transition-all z-10"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          ) : currentMatch ? (
            <motion.div
              key={currentMatch.id}
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -50 }}
              className="max-w-sm w-full aspect-[3/4] glass-blue rounded-[3rem] overflow-hidden relative shadow-2xl"
            >
              {/* Profile Image */}
              <div className="absolute inset-0">
                <img 
                  src={currentMatch.avatar_url || `https://picsum.photos/seed/${currentMatch.username}/800/1200`} 
                  className="w-full h-full object-cover"
                  alt={currentMatch.username}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
              </div>

              {/* Info Overlay */}
              <div className="absolute top-8 right-8 text-right max-w-[70%]">
                <h3 className="text-xl font-bold text-white">{currentMatch.full_name || currentMatch.username}</h3>
                <p className="text-xs text-blue-300">specialty: {currentMatch.professions?.[0] || 'Tech'}</p>
                <p className="text-[10px] text-gray-300 mt-2 line-clamp-3">
                  Bio: {currentMatch.bio || 'I will help with technical match & circuit analysis.'}
                </p>
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4">
                <div className="flex items-center gap-6">
                  <button className="p-3 glass rounded-full hover:bg-white/10 transition-all">
                    <Wrench className="w-8 h-8" />
                  </button>
                  <button 
                    onClick={() => setIsCalling(true)}
                    className="p-4 bg-red-500 rounded-full hover:bg-red-600 transition-all shadow-lg shadow-red-500/40"
                  >
                    <PhoneIncoming className="w-10 h-10 text-white" />
                  </button>
                  <button className="p-3 glass rounded-full hover:bg-white/10 transition-all">
                    <PhoneOutgoing className="w-8 h-8 text-green-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <p className="text-gray-500">No matches found in this category.</p>
          )}
        </AnimatePresence>

        <button 
          onClick={handleNext}
          disabled={currentIndex === matches.length - 1}
          className="absolute right-4 p-4 glass rounded-full disabled:opacity-20 hover:bg-white/10 transition-all z-10"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Call Overlay */}
      <AnimatePresence>
        {isCalling && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8"
          >
            <div className="absolute top-12 text-center px-6">
              <h2 className="text-2xl font-bold text-white mb-2">Live A.I Match</h2>
              <div className="text-5xl font-mono text-blue-500 mb-4">{countdown}s</div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-blue-200/80 italic max-w-sm mx-auto"
              >
                "{aiResponse}"
              </motion.p>
            </div>

            <div className="w-full max-w-md aspect-video glass-blue rounded-3xl overflow-hidden relative">
              <img 
                src={`https://picsum.photos/seed/${currentMatch?.username}/800/600`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 w-32 aspect-video glass rounded-xl overflow-hidden border-2 border-blue-500">
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-8">
              <button className="p-6 glass rounded-full hover:bg-white/10">
                <VideoOff className="w-8 h-8" />
              </button>
              <button 
                onClick={() => setIsCalling(false)}
                className="p-6 bg-red-500 rounded-full hover:bg-red-600"
              >
                <Phone className="w-8 h-8 rotate-[135deg]" />
              </button>
              <button className="p-6 glass rounded-full hover:bg-white/10">
                <MicOff className="w-8 h-8" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Icons */}
      <footer className="p-6 flex justify-between items-center">
        <VideoOff className="w-8 h-8 text-gray-500" />
        <button onClick={() => navigate('/home')} className="p-3 glass rounded-full">
          <Home className="w-6 h-6" />
        </button>
        <MicOff className="w-8 h-8 text-gray-500" />
      </footer>
    </div>
  );
}
