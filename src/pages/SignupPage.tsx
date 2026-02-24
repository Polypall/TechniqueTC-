import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User, School, FileText, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'react-hot-toast';

const SPECIALTIES = [
  'Machine Learning / AI', 'Information Technology (I.T.)', 'Programming / Coding',
  'Electronics / Embedded Tech', 'CAD / Design Engineering', 'Computer Science',
  'Software Development / Engineering', 'Web Development', 'Data Science / Analytics',
  'Cybersecurity', 'Cloud Computing', 'DevOps / SRE', 'Networking / Systems Administration',
  'UX / UI Design', 'Robotics / IoT', 'Construction', 'Chemistry'
];

const ACCOUNT_TYPES = [
  { id: 'inventor', label: 'Inventor Account' },
  { id: 'investor', label: 'Investor Account' },
  { id: 'startup', label: 'Startup Account' },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
    roleType: 'inventor',
    school: '',
    specialties: [] as string[],
    agreedToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleToggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleSignup = async () => {
    if (!formData.agreedToTerms) {
      toast.error('You must agree to the terms');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      // 1. Auth Signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            full_name: formData.fullName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create Profile
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          email: formData.email,
          username: formData.username,
          full_name: formData.fullName,
          role_type: formData.roleType,
          college: formData.school,
          professions: formData.specialties,
          is_active: true
        });

        if (profileError) throw profileError;
      }

      toast.success('Account created! Please check your email for verification.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-circuit flex items-center justify-center p-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full glass-blue p-8 rounded-3xl space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`h-1.5 w-8 rounded-full transition-all ${step >= i ? 'bg-blue-500' : 'bg-blue-500/20'}`} 
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                icon={<User className="w-5 h-5" />}
              />
              <Input
                label="Username"
                placeholder="johndoe_tech"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                icon={<User className="w-5 h-5" />}
              />
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                icon={<Mail className="w-5 h-5" />}
              />
              <Input
                label="Password (min 8 chars)"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                icon={
                  <button onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
              />
              <Button className="w-full" onClick={() => setStep(2)}>Next</Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <label className="block text-sm font-medium text-blue-300/80 ml-1">Account Type</label>
                <div className="grid grid-cols-1 gap-3">
                  {ACCOUNT_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, roleType: type.id })}
                      className={`
                        flex items-center justify-between p-4 rounded-xl border transition-all
                        ${formData.roleType === type.id 
                          ? 'bg-blue-600/20 border-blue-500 text-white' 
                          : 'bg-black/20 border-blue-500/20 text-gray-400 hover:border-blue-500/40'}
                      `}
                    >
                      <span>{type.label}</span>
                      {formData.roleType === type.id && <Check className="w-5 h-5 text-blue-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="School / University (Optional)"
                placeholder="University of Nebraska-Lincoln"
                value={formData.school}
                onChange={e => setFormData({ ...formData, school: e.target.value })}
                icon={<School className="w-5 h-5" />}
              />

              <div className="flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1" onClick={() => setStep(3)}>Next</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <label className="block text-sm font-medium text-blue-300/80 ml-1">Choose Specialties</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 glass rounded-xl">
                  {SPECIALTIES.map(s => (
                    <button
                      key={s}
                      onClick={() => handleToggleSpecialty(s)}
                      className={`
                        flex items-center gap-2 p-2 rounded-lg text-sm transition-all
                        ${formData.specialties.includes(s)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'}
                      `}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.specialties.includes(s) ? 'border-white' : 'border-gray-600'}`}>
                        {formData.specialties.includes(s) && <Check className="w-3 h-3" />}
                      </div>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 glass rounded-xl space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Terms of Agreement</h4>
                <div className="text-[10px] text-gray-400 leading-tight h-24 overflow-y-auto pr-2">
                  Polypall is not liable for any interactions, communications, or consequences arising from your use of this service.
                  Bullying, harassment, or any form of abusive behavior is strictly prohibited. Sexually explicit content is not permitted.
                  Polypall is not responsible for any events, outcomes, or risks associated with in-person meetings.
                </div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={formData.agreedToTerms}
                    onChange={e => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                  />
                  <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${formData.agreedToTerms ? 'bg-blue-500 border-blue-500' : 'border-gray-600 group-hover:border-blue-400'}`}>
                    {formData.agreedToTerms && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-sm text-blue-200">I agree to terms & wish to continue</span>
                </label>
              </div>

              <div className="flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                <Button className="flex-1" isLoading={loading} onClick={handleSignup}>Create Account</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center">
          <p className="text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
