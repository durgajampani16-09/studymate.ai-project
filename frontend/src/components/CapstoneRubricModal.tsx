import React from 'react';
import { X, Award, CheckCircle2, FileText, Cpu, Target, ExternalLink } from 'lucide-react';

interface CapstoneRubricModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CapstoneRubricModal: React.FC<CapstoneRubricModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const criteria = [
    { name: 'Problem Statement & Motivation', marks: '15 M', desc: 'Real-world problem of student revision overload & LLM hallucinations solved with grounded RAG.' },
    { name: 'AI Concept & Algorithm Clarity', marks: '15 M', desc: 'Clear methodology: PyMuPDF extraction, dense semantic embeddings, top-k cosine similarity retrieval.' },
    { name: 'Implementation & Execution', marks: '20 M', desc: 'Fully realized React + TypeScript + Tailwind frontend and FastAPI RAG service architecture.' },
    { name: 'Results & Accuracy Analysis', marks: '15 M', desc: 'Verifiable citations with page numbers, quiz scoring breakdown, topic mastery analytics.' },
    { name: 'Technical Competency', marks: '15 M', desc: 'Proper handling of state, asynchronous retrieval, token handling, and robust fallbacks.' },
    { name: 'Innovation & Real-World Relevance', marks: '10 M', desc: 'Active recall flashcards, instant chapter summarization, and exam question generator.' },
    { name: 'Presentation & Communication', marks: '5 M', desc: 'Intuitive modern pastel UI designed for distraction-free student learning.' },
    { name: 'Documentation & Poster Quality', marks: '5 M', desc: 'A5 poster readiness, clean modular codebase, and thorough technical architecture logs.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pastel-dark/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-4xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-pastel-border max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-pastel-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pastel-mint text-emerald-800 flex items-center justify-center font-bold">
              <Award size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-pastel-dark">
                AI Mini-Capstone Project Guidelines (25CS301)
              </h3>
              <p className="text-xs text-pastel-muted">
                100 Marks Evaluation Framework & Architectural Alignment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-pastel-light text-pastel-muted hover:text-pastel-dark transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto space-y-4 my-4 pr-1 flex-1">
          {/* Project Summary Banner */}
          <div className="p-4 rounded-3xl bg-pastel-lavender/40 border border-pastel-lavender-dark/30 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900">Project: StudyMate AI (Intelligent Study Assistant)</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">Total: 100 Marks</span>
            </div>
            <p className="text-pastel-muted leading-relaxed">
              Demonstrates practical implementation of <strong>Large Language Models (LLMs)</strong> and <strong>Retrieval-Augmented Generation (RAG)</strong> to synthesize syllabus notes and generate practice quizzes with exact textbook page citations.
            </p>
          </div>

          {/* Criteria Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {criteria.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-3xl bg-pastel-light/80 border border-pastel-border/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-pastel-dark">{item.name}</span>
                    <span className="text-[11px] font-extrabold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-100 shadow-2xs">
                      {item.marks}
                    </span>
                  </div>
                  <p className="text-[11px] text-pastel-muted leading-relaxed">{item.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-700 font-semibold">
                  <CheckCircle2 size={12} />
                  <span>Covered in StudyMate AI</span>
                </div>
              </div>
            ))}
          </div>

          {/* RAG Pipeline Breakdown */}
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Cpu size={14} className="text-indigo-600" />
              <span>Grounded AI Architecture (How to Explain in Viva)</span>
            </h4>
            <div className="text-[11px] text-slate-600 space-y-1">
              <p>1. <strong>Input Ingestion:</strong> Student uploads textbook or handwritten notes PDF.</p>
              <p>2. <strong>Page Chunking:</strong> PyMuPDF extracts text per page preserving exact page numbers.</p>
              <p>3. <strong>Embeddings:</strong> Semantic vector generation via Transformer embedding model.</p>
              <p>4. <strong>Retrieval:</strong> Cosine similarity top-k search grounds query in syllabus context.</p>
              <p>5. <strong>Generation:</strong> LLM synthesizes answer with verified citations to prevent hallucinations.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-pastel-border/60 flex items-center justify-between text-xs text-pastel-muted">
          <span>Aligned with course curriculum</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
