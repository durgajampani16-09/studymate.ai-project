import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DocumentItem, ImportantQuestionItem, QuestionType } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import {
  HelpCircle,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Eye,
  EyeOff,
  Copy,
  Check,
  Filter,
  Trash2,
  FileText,
  AlertCircle,
  Printer
} from 'lucide-react';

export const ImportantQuestionsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [questionType, setQuestionType] = useState<QuestionType>('5-mark');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [count, setCount] = useState<number>(5);

  const [questions, setQuestions] = useState<ImportantQuestionItem[]>([]);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [filterMarks, setFilterMarks] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const docs = await api.get<DocumentItem[]>('/documents');
        setDocuments(docs);
        if (docs.length > 0) setSelectedDocId(docs[0].id);

        const savedQuestions = await api.get<ImportantQuestionItem[]>('/important-questions');
        setQuestions(savedQuestions);
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
      const generated = await api.post<ImportantQuestionItem[]>(
        '/important-questions/generate',
        {
          document_id: selectedDocId,
          question_type: questionType,
          difficulty,
          count,
        }
      );

      setQuestions((prev) => [...generated, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate questions.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = async (id: string) => {
    try {
      const updated = await api.post<ImportantQuestionItem>(
        `/important-questions/${id}/toggle-bookmark`
      );
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, is_bookmarked: updated.is_bookmarked } : q))
      );
    } catch (err) {
      // Local toggle fallback
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, is_bookmarked: !q.is_bookmarked } : q))
      );
    }
  };

  const handleCopy = (id: string, q: ImportantQuestionItem) => {
    const text = `
[${q.marks} Marks | ${q.difficulty}] Question:
${q.question}

Model Answer:
${q.answer}
${q.hint ? `\nHint / Key Points: ${q.hint}` : ''}
Source Pages: ${q.source_pages.join(', ')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/important-questions/${id}`);
      setQuestions(questions.filter((q) => q.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete question.');
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (filterMarks === 'all') return true;
    if (filterMarks === 'bookmarked') return q.is_bookmarked;
    return q.question_type === filterMarks;
  });

  if (loading) {
    return <LoadingSpinner message="Loading exam practice questions..." />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-pastel-dark">
          Important Exam Questions Generator
        </h2>
        <p className="text-xs sm:text-sm text-pastel-muted mt-1">
          Generate syllabus-aligned university practice questions categorized by marks (2, 5, 10 marks, MCQs) with model answers and textbook citations.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      )}

      {/* Generation Panel */}
      <div className="bg-white rounded-4xl p-6 border border-pastel-border/60 shadow-pastel space-y-4">
        <h3 className="font-bold text-sm text-pastel-dark flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-600" />
          <span>Configure Question Generator</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-pastel-dark mb-1">
              Select Document
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
            >
              {documents.length === 0 ? (
                <option value="">No documents available</option>
              ) : (
                documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.chapter})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pastel-dark mb-1">
              Question Type & Marks
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as QuestionType)}
              className="w-full px-3 py-2 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
            >
              <option value="2-mark">2-Mark Short Question</option>
              <option value="5-mark">5-Mark Standard Question</option>
              <option value="10-mark">10-Mark Detailed Essay Question</option>
              <option value="mcq">Multiple Choice Question (MCQ)</option>
              <option value="definition">Definition & Concept</option>
              <option value="true-false">True / False</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pastel-dark mb-1">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-3 py-2 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
            >
              <option value="Easy">Easy (Foundation / Recall)</option>
              <option value="Medium">Medium (Application / Analysis)</option>
              <option value="Hard">Hard (Evaluation / Synthesis)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pastel-dark mb-1">
              Number of Questions
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={8}>8 Questions</option>
              <option value={10}>10 Questions</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-pastel-muted">
            ⚠️ Disclaimer: AI-generated exam-practice questions grounded in uploaded text. Not guaranteed to appear in university examinations.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedDocId}
            className="px-5 py-2.5 rounded-2xl bg-pastel-dark text-white font-semibold text-xs hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Questions...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Generate Questions</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['all', '2-mark', '5-mark', '10-mark', 'mcq', 'bookmarked'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterMarks(tab)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-semibold capitalize transition-all ${
                filterMarks === tab
                  ? 'bg-pastel-dark text-white shadow-sm'
                  : 'bg-white border border-pastel-border/60 text-pastel-muted hover:bg-pastel-cream hover:text-pastel-dark'
              }`}
            >
              {tab === 'all'
                ? `All (${questions.length})`
                : tab === 'bookmarked'
                ? `Bookmarked (${questions.filter((q) => q.is_bookmarked).length})`
                : tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-1.5 rounded-2xl bg-white border border-pastel-border/60 text-xs font-semibold text-pastel-dark hover:bg-pastel-cream transition-all flex items-center gap-1.5 shadow-2xs"
          title="Print or export questions as PDF examination sheet"
        >
          <Printer size={13} className="text-pastel-muted" />
          <span>Print Exam Sheet</span>
        </button>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No Questions Match Filter"
          description="Generate questions from your uploaded materials above or switch your filter tab."
          colorScheme="pink"
        />
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const isRevealed = !!revealedAnswers[q.id];
            return (
              <div
                key={q.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-pastel-border/60 shadow-pastel transition-all"
              >
                {/* Question Top Header */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-pastel-lavender text-indigo-900">
                      {q.marks} Marks
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-pastel-blue text-sky-900">
                      {q.difficulty}
                    </span>
                    <span className="text-[11px] font-semibold text-pastel-muted">
                      {q.document_title} · {q.chapter}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleBookmark(q.id)}
                      className={`p-1.5 rounded-xl transition-colors ${
                        q.is_bookmarked
                          ? 'text-amber-500 hover:bg-amber-50'
                          : 'text-pastel-muted hover:text-pastel-dark hover:bg-pastel-cream'
                      }`}
                      title={q.is_bookmarked ? 'Remove bookmark' : 'Bookmark question'}
                    >
                      {q.is_bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                    <button
                      onClick={() => handleCopy(q.id, q)}
                      className="p-1.5 rounded-xl text-pastel-muted hover:text-pastel-dark hover:bg-pastel-cream transition-colors"
                      title="Copy question"
                    >
                      {copiedId === q.id ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 rounded-xl text-pastel-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete question"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <h4 className="font-bold text-sm sm:text-base text-pastel-dark mb-3 leading-snug">
                  {q.question}
                </h4>

                {/* Hint if present */}
                {q.hint && (
                  <div className="mb-3 p-3 rounded-2xl bg-pastel-cream/70 border border-amber-200/50 text-xs text-amber-950">
                    <span className="font-bold">Key Focus Points:</span> {q.hint}
                  </div>
                )}

                {/* Answer Reveal Section */}
                <div className="pt-2">
                  <button
                    onClick={() => toggleReveal(q.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
                  >
                    {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{isRevealed ? 'Hide Model Answer' : 'Reveal Model Answer & Rubric'}</span>
                  </button>

                  {isRevealed && (
                    <div className="mt-3 p-4 rounded-2xl bg-pastel-light border border-pastel-border/60 text-xs sm:text-sm text-pastel-dark leading-relaxed animate-fadeIn">
                      <div className="font-bold text-xs uppercase tracking-wider text-pastel-muted mb-1.5 flex items-center gap-1.5">
                        <FileText size={13} />
                        <span>Model Solution & Marking Guide:</span>
                      </div>
                      <p className="whitespace-pre-line">{q.answer}</p>

                      {q.source_pages?.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-pastel-border/50 text-[11px] text-pastel-muted">
                          Source textbook pages: <span className="font-bold text-indigo-700">{q.source_pages.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
