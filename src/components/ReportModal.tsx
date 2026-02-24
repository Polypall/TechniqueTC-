import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from './ui/Button';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const REPORT_CATEGORIES = [
  'Spam or Advertising Abuse',
  'Scam, Fraud, or Impersonation',
  'Inappropriate Solicitation',
  'Harassment or Bullying',
  'Hate Speech or Discrimination',
  'Misinformation or False Claims',
  'Intellectual Property Violation',
  'Confidential Information Disclosure',
  'Off-Topic or Low-Quality',
  'Other'
];

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'post' | 'profile' | 'comment';
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, targetId, targetType }) => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!category) {
      toast.error('Please select a category');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Note: This assumes a 'reports' table exists with these columns
      const { error } = await supabase.from('reports').insert({
        reporter_id: user?.id,
        target_id: targetId,
        target_type: targetType,
        category,
        description,
        status: 'pending'
      });

      if (error) throw error;

      toast.success('Report submitted. Our team will review it within 24-48 hours.');
      onClose();
    } catch (error: any) {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
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
            className="relative w-full max-w-md glass-blue p-8 rounded-3xl space-y-6 shadow-2xl border border-red-500/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle className="w-6 h-6" />
                <h2 className="text-xl font-bold text-white">Report {targetType}</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Why are you reporting this?</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500/50 transition-all"
                >
                  <option value="" disabled>Select a category</option>
                  {REPORT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Additional Details (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us more about the issue..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500/50 transition-all h-32 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button variant="danger" className="flex-1" isLoading={loading} onClick={handleSubmit}>
                Submit Report
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
