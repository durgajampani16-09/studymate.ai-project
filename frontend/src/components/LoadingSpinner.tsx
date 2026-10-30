import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading study content...',
  subMessage,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pastel-lavender via-pastel-pink to-pastel-blue animate-spin duration-1000 flex items-center justify-center shadow-pastel" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-indigo-700 animate-pulse" />
        </div>
      </div>
      <p className="font-semibold text-pastel-dark text-sm sm:text-base">{message}</p>
      {subMessage && (
        <p className="text-xs text-pastel-muted mt-1 max-w-sm">{subMessage}</p>
      )}
    </div>
  );
};
