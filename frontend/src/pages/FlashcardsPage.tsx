import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DocumentItem, FlashcardItem } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import {
  Layers,
  Sparkles,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  RotateCw,
  X
} from 'lucide-react';

export const FlashcardsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Manual Add Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalFront, setModalFront] = useState<string>('');
  const [modalBack, setModalBack] = useState<string>('');
  const [modalSubject, setModalSubject] = useState<string>('');
  const [modalChapter, setModalChapter] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const docs = await api.get<DocumentItem[]>('/documents');
        setDocuments(docs);
        if (docs.length > 0) setSelectedDocId(docs[0].id);

        const cards = await api.get<FlashcardItem[]>('/flashcards');
        setFlashcards(cards);
      } catch (err) {
        console.warn('Backend not reached', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleGenerate = async () => {
    if (!selectedDocId) {
      setError('Please select an uploaded document.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const generated = await api.post<FlashcardItem[]>('/flashcards/generate', {
        document_id: selectedDocId,
        count: 6,
      });

      setFlashcards((prev) => [...generated, ...prev]);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err: any) {
      setError(err.message || 'Failed to generate flashcards.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'known' | 'needs_revision') => {
    try {
      await api.patch(`/flashcards/${id}/status`, { status });
      setFlashcards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
      // Auto advance to next card
      if (currentIndex < filteredCards.length - 1) {
        setIsFlipped(false);
        setCurrentIndex((prev) => prev + 1);
      }
    } catch (err) {
      // Local fallback
      setFlashcards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
    }
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleCreatePersonalCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalFront.trim() || !modalBack.trim()) return;

    try {
      const newCard = await api.post<FlashcardItem>('/flashcards', {
        front: modalFront.trim(),
        back: modalBack.trim(),
        subject: modalSubject.trim() || 'General Study',
        chapter: modalChapter.trim() || 'Quick Notes',
      });

      setFlashcards((prev) => [newCard, ...prev]);
      setIsModalOpen(false);
      setModalFront('');
      setModalBack('');
    } catch (err: any) {
      setError(err.message || 'Failed to save flashcard.');
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await api.delete(`/flashcards/${id}`);
      const updated = flashcards.filter((c) => c.id !== id);
      setFlashcards(updated);
      if (currentIndex >= updated.length) {
        setCurrentIndex(Math.max(0, updated.length - 1));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete card.');
    }
  };

  const filteredCards = flashcards.filter((c) => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  const currentCard = filteredCards[currentIndex];

  if (loading) {
    return <LoadingSpinner message="Preparing your flashcard deck..." />;
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-pastel-dark">
            Spaced Flashcard Revision
          </h2>
          <p className="text-xs sm:text-sm text-pastel-muted mt-1">
            Active recall for core definitions, algorithms, and formulas extracted from your textbooks.
          </p>
        </div>

        {/* Generate / Add Buttons */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            disabled={isGenerating || documents.length === 0}
            className="px-3 py-2 rounded-2xl bg-white border border-pastel-border text-xs font-medium text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark cursor-pointer"
          >
            {documents.length === 0 ? (
              <option value="">No documents</option>
            ) : (
              documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.chapter})
                </option>
              ))
            )}
          </select>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedDocId}
            className="px-4 py-2 rounded-2xl bg-pastel-dark text-white font-semibold text-xs hover:bg-slate-800 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            <span>Generate</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-2xl border border-pastel-border bg-white text-pastel-dark hover:bg-pastel-cream transition-colors"
            title="Create Custom Card"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      )}

      {/* Filter and Shuffle Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {['all', 'known', 'needs_revision'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setFilterStatus(st);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all capitalize ${
                filterStatus === st
                  ? 'bg-pastel-dark text-white shadow-sm'
                  : 'bg-white border border-pastel-border/60 text-pastel-muted hover:bg-pastel-cream hover:text-pastel-dark'
              }`}
            >
              {st === 'all'
                ? `All (${flashcards.length})`
                : st === 'known'
                ? `Mastered (${flashcards.filter((c) => c.status === 'known').length})`
                : `Need Revision (${flashcards.filter((c) => c.status === 'needs_revision').length})`}
            </button>
          ))}
        </div>

        {flashcards.length > 1 && (
          <button
            onClick={handleShuffle}
            className="px-3 py-1.5 rounded-2xl border border-pastel-border bg-white text-xs font-semibold text-pastel-dark hover:bg-pastel-cream transition-colors flex items-center gap-1.5"
          >
            <Shuffle size={13} />
            <span>Shuffle</span>
          </button>
        )}
      </div>

      {/* Main Flashcard Deck */}
      {filteredCards.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Flashcards Found"
          description="Generate flashcards from your textbook above or create personal revision cards."
          colorScheme="lavender"
        />
      ) : (
        <div className="space-y-6">
          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="perspective-1000 min-h-[300px] sm:min-h-[340px] cursor-pointer select-none"
          >
            <div
              className={`relative w-full h-full min-h-[300px] sm:min-h-[340px] rounded-4xl p-8 sm:p-10 transition-transform duration-500 transform-style-3d shadow-pastel-hover flex flex-col justify-between ${
                isFlipped
                  ? 'bg-gradient-to-tr from-[#F0F5FE] via-white to-[#FDF4F8] border border-indigo-200'
                  : 'bg-gradient-to-tr from-[#FFFDF9] via-white to-[#F7F4FD] border border-amber-200/60'
              }`}
            >
              {/* Card Meta Header */}
              <div className="flex items-center justify-between text-xs font-bold text-pastel-muted">
                <span className="uppercase tracking-wider">
                  {currentCard.subject} · {currentCard.chapter}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pastel-light border text-[11px]">
                  <RotateCw size={12} /> {isFlipped ? 'Answer Side' : 'Question Side (Click to Flip)'}
                </span>
              </div>

              {/* Core Content */}
              <div className="my-auto py-4 text-center">
                {isFlipped ? (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                      Answer & Explanation:
                    </span>
                    <p className="text-base sm:text-xl font-bold text-pastel-dark leading-relaxed">
                      {currentCard.back}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                      Concept / Prompt:
                    </span>
                    <h3 className="text-lg sm:text-2xl font-extrabold text-pastel-dark leading-snug">
                      {currentCard.front}
                    </h3>
                  </div>
                )}
              </div>

              {/* Card Footer Progress */}
              <div className="flex items-center justify-between pt-4 border-t border-black/5 text-xs text-pastel-muted">
                <span>
                  Card <strong className="text-pastel-dark">{currentIndex + 1}</strong> of{' '}
                  {filteredCards.length}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    currentCard.status === 'known'
                      ? 'bg-pastel-mint text-emerald-800'
                      : currentCard.status === 'needs_revision'
                      ? 'bg-pastel-pink text-rose-800'
                      : 'bg-pastel-light text-pastel-muted'
                  }`}
                >
                  {currentCard.status === 'known'
                    ? '✓ Mastered'
                    : currentCard.status === 'needs_revision'
                    ? '⚠️ Needs Review'
                    : 'Unstudied'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row: Known / Needs Revision and Nav */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-pastel-border/60 shadow-sm">
            {/* Status updates */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStatusUpdate(currentCard.id, 'needs_revision')}
                className="px-4 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-rose-200"
              >
                <RefreshCw size={14} />
                <span>Needs Revision</span>
              </button>

              <button
                onClick={() => handleStatusUpdate(currentCard.id, 'known')}
                className="px-4 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-emerald-200"
              >
                <CheckCircle2 size={14} />
                <span>Mark as Known</span>
              </button>
            </div>

            {/* Prev / Next controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentIndex === 0}
                className="p-2 rounded-xl border border-pastel-border hover:bg-pastel-cream disabled:opacity-40 transition-colors"
                title="Previous Card"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex((prev) => Math.min(filteredCards.length - 1, prev + 1));
                }}
                disabled={currentIndex === filteredCards.length - 1}
                className="p-2 rounded-xl border border-pastel-border hover:bg-pastel-cream disabled:opacity-40 transition-colors"
                title="Next Card"
              >
                <ChevronRight size={18} />
              </button>

              <button
                onClick={() => handleDeleteCard(currentCard.id)}
                className="p-2 rounded-xl text-pastel-muted hover:text-rose-600 hover:bg-rose-50 transition-colors ml-2"
                title="Delete this card"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Card Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pastel-dark/30 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-4xl max-w-lg w-full p-6 shadow-pastel-hover border border-pastel-border relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-pastel-muted hover:text-pastel-dark rounded-xl"
            >
              <X size={18} />
            </button>

            <h3 className="font-bold text-base text-pastel-dark mb-4">
              Create Personal Flashcard
            </h3>

            <form onSubmit={handleCreatePersonalCard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-pastel-dark mb-1">
                  Card Front (Question / Concept / Formula Name)
                </label>
                <textarea
                  rows={2}
                  required
                  value={modalFront}
                  onChange={(e) => setModalFront(e.target.value)}
                  placeholder="e.g. State Bayes' Theorem and its mathematical formulation."
                  className="w-full p-3 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark focus:ring-2 focus:ring-pastel-lavender-dark outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pastel-dark mb-1">
                  Card Back (Concise Answer / Formula / Explanation)
                </label>
                <textarea
                  rows={3}
                  required
                  value={modalBack}
                  onChange={(e) => setModalBack(e.target.value)}
                  placeholder="e.g. P(A|B) = [P(B|A) * P(A)] / P(B). Describes probability of an event based on prior condition."
                  className="w-full p-3 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark focus:ring-2 focus:ring-pastel-lavender-dark outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-pastel-dark mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={modalSubject}
                    onChange={(e) => setModalSubject(e.target.value)}
                    placeholder="e.g. AI & Probability"
                    className="w-full px-3 py-2 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-pastel-dark mb-1">
                    Chapter
                  </label>
                  <input
                    type="text"
                    value={modalChapter}
                    onChange={(e) => setModalChapter(e.target.value)}
                    placeholder="e.g. Unit 3"
                    className="w-full px-3 py-2 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-2xl text-xs font-semibold text-pastel-muted hover:text-pastel-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-pastel-dark text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Save Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
