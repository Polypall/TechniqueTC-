import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function VerifyEmailPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-circuit flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-blue p-8 rounded-3xl text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/30">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Email Verified!</h2>
          <p className="text-blue-300/60">
            Your account is now active. You can now log in and start connecting with inventors and investors.
          </p>
        </div>

        <Button 
          className="w-full" 
          onClick={() => navigate('/login')}
          icon={ArrowRight}
        >
          Go to Login
        </Button>
      </motion.div>
    </div>
  );
}
