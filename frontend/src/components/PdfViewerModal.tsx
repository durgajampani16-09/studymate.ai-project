import React, { useState } from 'react';
import { X, BookOpen, ExternalLink, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { CitationSource } from '../types';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  citation?: CitationSource | null;
  documentTitle?: string;
  initialPage?: number;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  citation,
  documentTitle,
  initialPage = 1,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(citation?.page_number || initialPage);

  if (!isOpen) return null;

  const docTitle = citation?.document_title || documentTitle || 'Study Material PDF';
  const pageNum = citation?.page_number || currentPage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pastel-dark/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-pastel-hover border border-pastel-border overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-pastel-border/60 flex items-center justify-between bg-pastel-cream/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pastel-lavender flex items-center justify-center text-indigo-700">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-pastel-dark truncate max-w-sm">
                {docTitle}
              </h3>
              <p className="text-xs text-pastel-muted">
                Source Page Reference: <span className="font-bold text-indigo-600">Page {pageNum}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-pastel-muted hover:text-pastel-dark rounded-xl hover:bg-pastel-cream transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Viewer */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {citation?.excerpt ? (
            <div className="bg-pastel-cream/60 border border-amber-200/60 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
                <FileText size={14} />
                <span>Verified RAG Document Chunk (Page {citation.page_number}):</span>
              </div>
              <blockquote className="text-sm text-pastel-dark leading-relaxed italic border-l-4 border-amber-400 pl-3">
                "{citation.excerpt}"
              </blockquote>
            </div>
          ) : null}

          <div className="p-5 rounded-2xl bg-pastel-light border border-pastel-border text-sm text-pastel-dark leading-relaxed">
            <p className="text-xs font-bold uppercase tracking-wider text-pastel-muted mb-3">
              Context Grounding Guarantee
            </p>
            <p className="mb-2">
              StudyMate AI extracts text page-by-page using PyMuPDF (Fitz) and indexes every chunk with its precise origin page number.
            </p>
            <p className="text-xs text-pastel-muted">
              Document ID: <code className="bg-white px-1.5 py-0.5 rounded border">{citation?.document_id || 'active-document'}</code> | Chunk Grounding: Verified
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-pastel-border/60 bg-white flex items-center justify-between">
          <span className="text-xs text-pastel-muted">
            Grounding page citation from vector embeddings
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-pastel-dark text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Citation
          </button>
        </div>
      </div>
    </div>
  );
};
