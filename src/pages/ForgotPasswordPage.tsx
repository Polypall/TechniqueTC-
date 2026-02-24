import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setSubmitted(true);
      toast.success('Reset link sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-circuit flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-blue p-8 rounded-3xl space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Forgot Password</h2>
          <p className="text-blue-300/60">We'll send you a link to reset your password</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleReset} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
            />

            <Button 
              type="submit" 
              className="w-full" 
              isLoading={loading}
            >
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
              Check your email for the reset link.
            </div>
            <Button variant="outline" className="w-full" onClick={() => setSubmitted(false)}>
              Try another email
            </Button>
          </div>
        )}

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-blue-400 hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
