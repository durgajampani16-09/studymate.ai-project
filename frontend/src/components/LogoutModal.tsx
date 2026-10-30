import React from 'react';
import { LogOut, X, AlertCircle } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pastel-dark/30 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-pastel-hover border border-pastel-border/80 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-pastel-muted hover:text-pastel-dark rounded-xl hover:bg-pastel-cream transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-pastel-pink/60 flex items-center justify-center text-rose-700 shrink-0">
            <LogOut size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-pastel-dark">Confirm Logout</h3>
            <p className="text-xs text-pastel-muted">StudyMate AI Student Portal</p>
          </div>
        </div>

        <p className="text-sm text-pastel-muted mb-6 leading-relaxed">
          Are you sure you want to end your active study session? Your generated notes, flashcards, and quiz results are securely saved.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-pastel-dark hover:bg-pastel-cream transition-colors border border-pastel-border"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all duration-200 flex items-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogOut size={16} />
            )}
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
