import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, GraduationCap } from 'lucide-react';

export const LogoutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-pastel-cream flex flex-col justify-center items-center p-6 text-center">
      <div className="w-full max-w-md bg-white rounded-4xl p-8 sm:p-10 shadow-pastel-hover border border-pastel-border/60">
        <div className="w-14 h-14 rounded-3xl bg-pastel-mint flex items-center justify-center mx-auto text-emerald-800 shadow-sm mb-4">
          <CheckCircle2 size={30} />
        </div>

        <h2 className="text-2xl font-bold text-pastel-dark mb-2">
          Logged Out Successfully
        </h2>
        <p className="text-sm text-pastel-muted mb-6 leading-relaxed">
          Your active study session has been securely closed. All your document embeddings, notes, and quiz records remain saved for your next login.
        </p>

        <Link
          to="/login"
          className="w-full py-3 px-4 rounded-2xl bg-pastel-dark text-white font-semibold text-sm hover:bg-slate-800 transition-all shadow-md inline-flex items-center justify-center gap-2 group"
        >
          <span>Sign In Again</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-pastel-muted">
        <GraduationCap size={16} />
        <span>StudyMate AI — AI Mini-Capstone Project</span>
      </div>
    </div>
  );
};
