import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Video, Send, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { uploadPostMedia } from '../lib/storage';
import { Button } from './ui/Button';
import { toast } from 'react-hot-toast';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  userId: string;
}

export function CreatePostModal({ isOpen, onClose, onPostCreated, userId }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaFile) {
      toast.error('Please add some content or media');
      return;
    }

    setLoading(true);
    try {
      let mediaUrl = '';
      let mediaType = '';

      if (mediaFile) {
        mediaUrl = await uploadPostMedia(userId, mediaFile);
        mediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image';
      }

      const { error } = await supabase.from('posts').insert({
        user_id: userId,
        content,
        media_url: mediaUrl || null,
        media_type: mediaType || null
      });

      if (error) throw error;

      toast.success('Post created successfully!');
      setContent('');
      setMediaFile(null);
      onPostCreated();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg glass-blue rounded-3xl overflow-hidden relative z-10"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Share Invention</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What are you working on?"
                className="w-full h-32 bg-black/20 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
              />

              {mediaFile && (
                <div className="relative rounded-xl overflow-hidden aspect-video bg-black/40 border border-white/10">
                  {mediaFile.type.startsWith('video/') ? (
                    <video src={URL.createObjectURL(mediaFile)} className="w-full h-full object-contain" />
                  ) : (
                    <img src={URL.createObjectURL(mediaFile)} className="w-full h-full object-contain" />
                  )}
                  <button
                    type="button"
                    onClick={() => setMediaFile(null)}
                    className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <label className="p-2 glass rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    <ImageIcon className="w-5 h-5 text-blue-400" />
                  </label>
                  <label className="p-2 glass rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                    <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
                    <Video className="w-5 h-5 text-purple-400" />
                  </label>
                </div>
                <Button type="submit" isLoading={loading} className="gap-2 px-6">
                  <Send className="w-4 h-4" />
                  Post
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
