import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Network,
  ChevronRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Info,
  CheckCircle2
} from 'lucide-react';

interface ConceptNode {
  id: string;
  label: string;
  category: 'core' | 'algorithm' | 'formula' | 'rag';
  level: number;
  summary: string;
  formula?: string;
  examMarks?: string;
  children?: ConceptNode[];
}

const SYLLABUS_TREE: ConceptNode[] = [
  {
    id: 'tree-root',
    label: 'Trees & Hierarchies (Module 2)',
    category: 'core',
    level: 1,
    summary: 'Non-linear recursive data structure with 1 root and N-1 edges for N vertices.',
    formula: 'Edges = N - 1',
    children: [
      {
        id: 'traversals',
        label: 'Depth-First Traversals',
        category: 'algorithm',
        level: 2,
        summary: 'Inorder (L-Root-R), Preorder (Root-L-R), Postorder (L-R-Root). Inorder of BST produces sorted order.',
        examMarks: '5 Marks Question',
      },
      {
        id: 'bst',
        label: 'Binary Search Tree (BST)',
        category: 'core',
        level: 2,
        summary: 'Left child < Root < Right child. Insertion, search, and deletion take O(h) time.',
        formula: 'Search Time = O(h)',
        children: [
          {
            id: 'avl',
            label: 'Self-Balancing AVL Trees',
            category: 'algorithm',
            level: 3,
            summary: 'Strictly height-balanced BST where Balance Factor = Height(L) - Height(R) in {-1, 0, +1}. Guaranteed O(log N).',
            formula: 'BF = Height(L) - Height(R)',
            examMarks: '10 Marks Question',
          },
          {
            id: 'rotations',
            label: 'AVL 4 Rotations (LL, RR, LR, RL)',
            category: 'formula',
            level: 3,
            summary: 'Single rotations (LL -> Right rotate, RR -> Left rotate); Double rotations (LR -> Left then Right, RL -> Right then Left).',
            examMarks: '5 / 10 Marks',
          }
        ]
      }
    ]
  },
  {
    id: 'ai-search-root',
    label: 'AI Search & RAG Architecture',
    category: 'rag',
    level: 1,
    summary: 'From state space search graphs to Retrieval-Augmented Generation using PyMuPDF and vector embeddings.',
    children: [
      {
        id: 'informed-search',
        label: 'A* Heuristic Search',
        category: 'algorithm',
        level: 2,
        summary: 'f(n) = g(n) + h(n). Complete and optimal when heuristic h(n) is admissible (never overestimates).',
        formula: 'f(n) = g(n) + h(n)',
        examMarks: '5 Marks Question',
      },
      {
        id: 'rag-pipeline',
        label: 'PyMuPDF RAG Pipeline',
        category: 'rag',
        level: 2,
        summary: 'Extract text page-by-page -> Generate vector embeddings -> Cosine similarity top-k search -> Synthesize with exact page citations.',
        formula: 'Cosine Similarity = (A·B)/(||A||*||B||)',
        examMarks: 'Capstone Core AI',
      }
    ]
  }
];

export const ConceptMapView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState<ConceptNode>(SYLLABUS_TREE[0]);

  const renderNode = (node: ConceptNode) => {
    const isSelected = selectedNode?.id === node.id;

    const badgeColor =
      node.category === 'rag'
        ? 'bg-purple-100 text-purple-800 border-purple-200'
        : node.category === 'algorithm'
        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
        : node.category === 'formula'
        ? 'bg-amber-100 text-amber-800 border-amber-200'
        : 'bg-indigo-100 text-indigo-800 border-indigo-200';

    return (
      <div key={node.id} className="ml-4 pl-4 border-l-2 border-pastel-border/80 my-2">
        <button
          onClick={() => setSelectedNode(node)}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-left transition-all ${
            isSelected
              ? 'bg-white shadow-pastel border border-indigo-300 font-bold scale-[1.02]'
              : 'hover:bg-white/60 text-pastel-dark font-medium'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${
            node.category === 'rag' ? 'bg-purple-500' : node.category === 'algorithm' ? 'bg-emerald-500' : 'bg-indigo-500'
          }`} />
          <span className="text-xs sm:text-sm">{node.label}</span>
          {node.examMarks && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badgeColor} font-semibold ml-1`}>
              {node.examMarks}
            </span>
          )}
        </button>

        {node.children && (
          <div className="mt-1 space-y-1">
            {node.children.map((child) => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-4xl p-6 sm:p-8 border border-pastel-border/60 shadow-pastel">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-pastel-border/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pastel-lavender flex items-center justify-center text-indigo-800">
              <Network size={18} />
            </div>
            <h3 className="font-extrabold text-lg text-pastel-dark">
              Interactive Concept Knowledge Map
            </h3>
          </div>
          <p className="text-xs text-pastel-muted mt-1">
            Visual syllabus graph connecting textbook chapters to RAG concepts and exam topics.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-pastel-muted">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Core Concepts</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Algorithms</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> RAG Architecture</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Tree */}
        <div className="lg:col-span-7 bg-pastel-light/60 p-4 rounded-3xl border border-pastel-border/60 max-h-[460px] overflow-y-auto">
          {SYLLABUS_TREE.map((root) => renderNode(root))}
        </div>

        {/* Right: Detailed Node Inspector */}
        <div className="lg:col-span-5 bg-gradient-to-br from-white to-pastel-cream/50 p-6 rounded-3xl border border-indigo-100 shadow-sm space-y-5">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              Topic Deep-Dive
            </span>
            <h4 className="text-lg font-bold text-pastel-dark mt-2.5">
              {selectedNode.label}
            </h4>
          </div>

          <p className="text-xs sm:text-sm text-pastel-muted leading-relaxed">
            {selectedNode.summary}
          </p>

          {selectedNode.formula && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <span className="text-[11px] font-bold text-amber-900 block mb-1">
                Mathematical Invariant / Formula
              </span>
              <code className="text-xs sm:text-sm font-mono font-bold text-amber-950">
                {selectedNode.formula}
              </code>
            </div>
          )}

          {selectedNode.examMarks && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Exam Relevance: {selectedNode.examMarks}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => navigate('/chat')}
              className="flex-1 py-2.5 px-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Sparkles size={14} />
              <span>Ask AI Tutor</span>
            </button>
            <button
              onClick={() => navigate('/quizzes')}
              className="flex-1 py-2.5 px-3.5 rounded-2xl bg-white hover:bg-pastel-light border border-pastel-border text-pastel-dark font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <HelpCircle size={14} />
              <span>Take Topic Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
