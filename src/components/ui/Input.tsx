import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-sm font-medium text-blue-300/80 ml-1">{label}</label>}
      <div className="relative group">
        <input
          className={`
            w-full bg-black/40 border border-blue-500/30 rounded-xl px-4 py-3 
            text-white placeholder-gray-500 outline-none transition-all
            focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20
            group-hover:border-blue-500/50
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
        {icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
    </div>
  );
};
