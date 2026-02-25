import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Camera, FileText, Save, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { uploadAvatar, uploadResume } from '../lib/storage';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { toast } from 'react-hot-toast';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onProfileUpdated: () => void;
}

const SPECIALTIES = [
  'Machine Learning / AI', 'Information Technology (I.T.)', 'Programming / Coding',
  'Electronics / Embedded Tech', 'CAD / Design Engineering', 'Computer Science',
  'Software Development / Engineering', 'Web Development', 'Data Science / Analytics',
  'Cybersecurity', 'Cloud Computing', 'DevOps / SRE', 'Networking / Systems Administration',
  'UX / UI Design', 'Robotics / IoT', 'Construction', 'Chemistry'
];

export function ProfileSettingsModal({ isOpen, onClose, profile, onProfileUpdated }: ProfileSettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    college: '',
    specialties: [] as string[],
    avatarFile: null as File | null,
    resumeFile: null as File | null
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || '',
        bio: profile.bio || '',
        college: profile.college || '',
        specialties: profile.professions || [],
        avatarFile: null,
        resumeFile: null
      });
    }
  }, [profile]);

  const handleToggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = profile.avatar_url;
      let resumeUrl = profile.resume_url;

      if (formData.avatarFile) {
        avatarUrl = await uploadAvatar(profile.id, formData.avatarFile);
      }
      if (formData.resumeFile) {
        resumeUrl = await uploadResume(profile.id, formData.resumeFile);
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          bio: formData.bio,
          college: formData.college,
          professions: formData.specialties,
          avatar_url: avatarUrl,
          resume_url: resumeUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      onProfileUpdated();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
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
            className="w-full max-w-2xl glass-blue rounded-[2.5rem] overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-blue-500/20 overflow-hidden border-4 border-blue-500/30">
                    {formData.avatarFile ? (
                      <img src={URL.createObjectURL(formData.avatarFile)} className="w-full h-full object-cover" />
                    ) : profile?.avatar_url ? (
                      <img src={profile.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-full h-full p-6 text-blue-400" />
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={e => setFormData({ ...formData, avatarFile: e.target.files?.[0] || null })} />
                  </label>
                </div>
                <p className="text-xs text-gray-500 uppercase font-bold">Change Avatar</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                />
                <Input
                  label="School / University"
                  value={formData.college}
                  onChange={e => setFormData({ ...formData, college: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-300/80">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full h-24 bg-black/20 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-blue-300/80">Specialties</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SPECIALTIES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleToggleSpecialty(s)}
                      className={`
                        p-2 rounded-lg text-[10px] font-bold uppercase transition-all border
                        ${formData.specialties.includes(s)
                          ? 'bg-blue-500 border-blue-400 text-white'
                          : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'}
                      `}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 glass rounded-2xl">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-sm font-bold text-white">Resume PDF</p>
                    <p className="text-[10px] text-gray-500 uppercase">{formData.resumeFile ? formData.resumeFile.name : 'Update your resume'}</p>
                  </div>
                </div>
                <label className="cursor-pointer">
                  <input type="file" className="hidden" accept=".pdf" onChange={e => setFormData({ ...formData, resumeFile: e.target.files?.[0] || null })} />
                  <Button variant="outline" size="sm" type="button" className="pointer-events-none">
                    Change
                  </Button>
                </label>
              </div>

              <div className="pt-4">
                <Button type="submit" isLoading={loading} className="w-full gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
