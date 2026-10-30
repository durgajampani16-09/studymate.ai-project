import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GraduationCap, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F0] via-[#F8F5FF] to-[#EDF6FD] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <Link to="/login" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pastel-lavender to-pastel-blue flex items-center justify-center text-indigo-800 shadow-sm transition-transform group-hover:scale-105">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-pastel-dark tracking-tight flex items-center gap-2">
              StudyMate <span className="text-xs px-2 py-0.5 rounded-full bg-pastel-mint text-emerald-800 font-bold">AI</span>
            </span>
            <span className="text-xs text-pastel-muted block font-medium">
              Intelligent Retrieval-Augmented Study Assistant
            </span>
          </div>
        </Link>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/70 border border-pastel-border/80 text-pastel-muted shadow-sm">
          <Sparkles size={14} className="text-indigo-600" />
          <span>AI Mini-Capstone Project</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Academic Showcase Info */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 pr-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pastel-lavender/60 border border-pastel-lavender-dark/40 text-xs font-bold text-indigo-900 w-fit">
            <span>Powered by PyMuPDF & Vector Embeddings</span>
          </div>
          <h2 className="text-4xl font-extrabold text-pastel-dark leading-tight">
            Study smarter with grounded AI textbook assistance.
          </h2>
          <p className="text-base text-pastel-muted leading-relaxed">
            Upload your syllabus PDFs, generate chapter summaries, test yourself with automated quizzes, and ask questions with exact textbook page citations.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-white/80 p-4 rounded-3xl border border-white/60 shadow-pastel">
              <div className="w-8 h-8 rounded-xl bg-pastel-blue flex items-center justify-center text-sky-800 mb-2">
                <BookOpen size={18} />
              </div>
              <h4 className="font-bold text-sm text-pastel-dark">No Hallucinations</h4>
              <p className="text-xs text-pastel-muted mt-0.5">RAG ensures all answers cite your uploaded pages.</p>
            </div>
            <div className="bg-white/80 p-4 rounded-3xl border border-white/60 shadow-pastel">
              <div className="w-8 h-8 rounded-xl bg-pastel-mint flex items-center justify-center text-emerald-800 mb-2">
                <ShieldCheck size={18} />
              </div>
              <h4 className="font-bold text-sm text-pastel-dark">Student ID Login</h4>
              <p className="text-xs text-pastel-muted mt-0.5">Secure isolated access for each student.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Outlet for Login / Reset Password */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-4xl p-8 sm:p-10 shadow-pastel-hover border border-pastel-border/60 relative">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center py-4 text-xs text-pastel-muted">
        <p>© 2026 StudyMate AI — Artificial Intelligence Mini-Capstone Project. Grounded RAG Architecture.</p>
      </footer>
    </div>
  );
};
