import React, { useState } from 'react';
import { X, Search, Calculator, BookOpen, Copy, Check } from 'lucide-react';

interface FormulaSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuickFormula {
  subject: string;
  topic: string;
  formula: string;
  explanation: string;
  examNote: string;
}

const FORMULA_DATABASE: QuickFormula[] = [
  {
    subject: 'Data Structures',
    topic: 'Tree Edges Formula',
    formula: 'E = N - 1',
    explanation: 'Any tree with N nodes always contains exactly N - 1 edges.',
    examNote: 'Frequent 2-mark question.',
  },
  {
    subject: 'Data Structures',
    topic: 'Maximum Nodes in Binary Tree',
    formula: 'Max Nodes = 2^(h + 1) - 1',
    explanation: 'For a binary tree of height h with root at level 0.',
    examNote: 'Used to check full binary trees.',
  },
  {
    subject: 'Data Structures',
    topic: 'Array Representation (1-indexed)',
    formula: 'Left = 2*i | Right = 2*i + 1 | Parent = floor(i / 2)',
    explanation: 'Position formulas for mapping binary trees into contiguous array memory.',
    examNote: 'Critical for binary heaps and trees.',
  },
  {
    subject: 'Data Structures',
    topic: 'AVL Balance Factor',
    formula: 'BF = Height(Left Subtree) - Height(Right Subtree)',
    explanation: 'Must be -1, 0, or +1. If outside range, rotations are required.',
    examNote: 'Essential for AVL tree rebalancing.',
  },
  {
    subject: 'Data Structures',
    topic: 'AVL Rotations Lookup',
    formula: 'LL -> Single Right | RR -> Single Left | LR -> Left then Right | RL -> Right then Left',
    explanation: 'Rotations restore balance factor while preserving BST Inorder sorting invariant.',
    examNote: 'Core 10-mark question in semester exams.',
  },
  {
    subject: 'Artificial Intelligence',
    topic: 'A* Search Evaluation Function',
    formula: 'f(n) = g(n) + h(n)',
    explanation: 'g(n) = cost from start to node n; h(n) = estimated heuristic cost to goal.',
    examNote: 'Optimal if h(n) is admissible (0 <= h(n) <= h*(n)).',
  },
  {
    subject: 'Artificial Intelligence',
    topic: 'Vector Cosine Similarity',
    formula: 'cos(θ) = (A · B) / (||A|| * ||B||)',
    explanation: 'Evaluates alignment of semantic embeddings between student query and textbook page chunk.',
    examNote: 'Core metric used in StudyMate AI RAG retriever.',
  },
];

export const FormulaSheetModal: React.FC<FormulaSheetModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = FORMULA_DATABASE.filter(
    (f) =>
      f.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (formula: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedFormula(formula);
    setTimeout(() => setCopiedFormula(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pastel-dark/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-4xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-pastel-border max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-pastel-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-pastel-dark">
                Quick Formula & Exam Reference Sheet
              </h3>
              <p className="text-xs text-pastel-muted">
                Mathematical invariants, tree properties & RAG equations
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

        {/* Search */}
        <div className="my-4 relative">
          <Search size={16} className="absolute left-3.5 top-3 text-pastel-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search formulas (e.g. AVL, A*, Balance Factor, Traversal)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Formula Cards */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {filtered.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-3xl bg-pastel-cream/40 border border-pastel-border/70 hover:border-indigo-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {item.subject}
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-pastel-dark">
                    {item.topic}
                  </span>
                </div>
                <div className="bg-white/80 px-3 py-1.5 rounded-xl border border-pastel-border font-mono text-xs font-bold text-indigo-950 inline-block">
                  {item.formula}
                </div>
                <p className="text-xs text-pastel-muted">{item.explanation}</p>
                <p className="text-[11px] text-amber-800 font-semibold">💡 {item.examNote}</p>
              </div>

              <button
                onClick={() => handleCopy(item.formula)}
                className="self-end sm:self-center shrink-0 p-2.5 rounded-xl bg-white hover:bg-indigo-50 border border-pastel-border text-indigo-700 transition-all text-xs flex items-center gap-1 font-semibold"
                title="Copy formula"
              >
                {copiedFormula === item.formula ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copiedFormula === item.formula ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-pastel-muted text-xs">
              No formulas matched your search. Try "Tree", "AVL", or "A*".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-pastel-border/60 flex items-center justify-between text-xs text-pastel-muted">
          <span>{filtered.length} formulas available</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all"
          >
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
