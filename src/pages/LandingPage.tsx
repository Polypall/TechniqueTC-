import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-circuit flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-8"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse-blue" />
          <img 
            src="https://i.postimg.cc/W3V2QG5t/In_Shot_20251108_192211830.jpg" 
            alt="Technique Logo" 
            className="w-48 h-48 rounded-full border-4 border-blue-500/30 relative z-10 shadow-2xl"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
            Welcome to <span className="text-blue-500">Technique</span>
          </h1>
          <p className="text-xl text-blue-200/60 font-medium italic">
            "The site for inventors and investors"
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
        </div>

        <div className="pt-4">
          <button 
            onClick={() => navigate('/forgot-password')}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors glass px-6 py-2 rounded-full"
          >
            Forgot password
          </button>
        </div>

        <div className="pt-12">
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            A social platform for the tech community. Share projects, find collaborators, and connect with investors.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
