import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { QuizAttemptResult } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';

export const QuizResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeResult, setActiveResult] = useState<QuizAttemptResult | null>(
    (location.state as any)?.result || null
  );
  const [historyResults, setHistoryResults] = useState<QuizAttemptResult[]>([]);
  const [loading, setLoading] = useState<boolean>(!activeResult);
  const [expandedQuestion, setExpandedQuestion] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchRecentResults = async () => {
      try {
        const res = await api.get<QuizAttemptResult[]>('/quizzes/attempts/recent');
        setHistoryResults(res);
        if (!activeResult && res.length > 0) {
          setActiveResult(res[0]);
        }
      } catch (err) {
        console.warn('Could not load quiz history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentResults();
  }, [activeResult]);

  const toggleExpand = (qId: string) => {
    setExpandedQuestion((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  if (loading) {
    return <LoadingSpinner message="Evaluating and scoring your answers..." />;
  }

  if (!activeResult && historyResults.length === 0) {
    return (
      <EmptyState
        icon={Award}
        title="No Quiz Attempts Found"
        description="Take your first practice quiz to see comprehensive scoring, rubric breakdowns, and AI revision suggestions."
        actionText="Generate a Quiz"
        onAction={() => navigate('/quizzes')}
        colorScheme="mint"
      />
    );
  }

  const result = activeResult || historyResults[0];
  const isHighScorer = result.percentage >= 75;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Score Summary Banner */}
      <div
        className={`rounded-4xl p-6 sm:p-8 border shadow-pastel relative overflow-hidden ${
          isHighScorer
            ? 'bg-gradient-to-br from-pastel-mint via-pastel-blue/40 to-white border-emerald-200'
            : 'bg-gradient-to-br from-pastel-cream via-pastel-pink/30 to-white border-amber-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-xs font-bold text-pastel-dark mb-2 shadow-xs">
              <Award size={14} className="text-amber-500" />
              <span>{result.quiz_title}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-pastel-dark">
              {isHighScorer ? 'Great Performance! 🎉' : 'Keep Practicing! 📖'}
            </h2>
            <p className="text-xs sm:text-sm text-pastel-muted mt-1">
              {result.subject} · {result.chapter} · Completed on{' '}
              {new Date(result.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Big Score Badge */}
          <div className="text-center sm:text-right bg-white/80 p-4 rounded-3xl border border-white/60 shadow-sm shrink-0">
            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-950 block">
              {result.marks_obtained} / {result.total_marks}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {Math.round(result.percentage)}% Score
            </span>
          </div>
        </div>

        {/* Mini stats counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-black/5">
          <div className="bg-white/70 p-3 rounded-2xl">
            <span className="text-[11px] font-semibold text-pastel-muted block">Correct</span>
            <span className="text-lg font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 size={16} /> {result.correct_count}
            </span>
          </div>
          <div className="bg-white/70 p-3 rounded-2xl">
            <span className="text-[11px] font-semibold text-pastel-muted block">Incorrect</span>
            <span className="text-lg font-bold text-rose-700 flex items-center gap-1">
              <XCircle size={16} /> {result.incorrect_count}
            </span>
          </div>
          <div className="bg-white/70 p-3 rounded-2xl">
            <span className="text-[11px] font-semibold text-pastel-muted block">Time Spent</span>
            <span className="text-lg font-bold text-pastel-dark flex items-center gap-1">
              <Clock size={16} /> {Math.round(result.time_spent_seconds)}s
            </span>
          </div>
          <div className="bg-white/70 p-3 rounded-2xl">
            <span className="text-[11px] font-semibold text-pastel-muted block">Total Questions</span>
            <span className="text-lg font-bold text-indigo-800">
              {result.questions_review?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* AI Revision Suggestions */}
      {result.revision_suggestions && result.revision_suggestions.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pastel-border/60 shadow-pastel">
          <h3 className="font-bold text-sm text-pastel-dark mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-600" />
            <span>Recommended Focus Topics for Revision</span>
          </h3>
          <div className="space-y-2">
            {result.revision_suggestions.map((sug, sIdx) => (
              <div
                key={sIdx}
                className="p-3 rounded-2xl bg-pastel-light/60 border border-pastel-border/50 text-xs sm:text-sm text-pastel-dark flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                <span>{sug}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question by Question Review */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-pastel-dark">
          Detailed Question-by-Question Review ({result.questions_review?.length || 0})
        </h3>

        {result.questions_review?.map((rev, idx) => {
          const isExp = expandedQuestion[rev.question_id] !== false; // Default expanded
          return (
            <div
              key={rev.question_id || idx}
              className="bg-white rounded-3xl p-5 border border-pastel-border/60 shadow-sm space-y-3"
            >
              <div
                onClick={() => toggleExpand(rev.question_id)}
                className="flex items-start justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      rev.is_correct
                        ? 'bg-pastel-mint text-emerald-800'
                        : 'bg-pastel-pink text-rose-800'
                    }`}
                  >
                    {rev.is_correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-pastel-muted uppercase tracking-wider block">
                      Question {idx + 1} · {rev.marks_awarded} / {rev.max_marks} Marks
                    </span>
                    <h4 className="font-bold text-sm text-pastel-dark mt-0.5">
                      {rev.question}
                    </h4>
                  </div>
                </div>

                <button className="text-pastel-muted hover:text-pastel-dark p-1">
                  {isExp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {isExp && (
                <div className="pt-3 border-t border-pastel-border/40 space-y-3 text-xs leading-relaxed animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div
                      className={`p-3 rounded-2xl border ${
                        rev.is_correct
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : 'bg-rose-50 border-rose-200 text-rose-950'
                      }`}
                    >
                      <span className="font-bold block mb-0.5">Your Submitted Answer:</span>
                      <span>{rev.student_answer || 'No answer submitted'}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-pastel-mint/50 border border-emerald-200 text-emerald-950">
                      <span className="font-bold block mb-0.5">Verified Correct Solution:</span>
                      <span>{rev.correct_answer}</span>
                    </div>
                  </div>

                  {rev.explanation && (
                    <div className="p-3 rounded-2xl bg-pastel-light border border-pastel-border/60 text-pastel-dark">
                      <span className="font-bold text-pastel-muted uppercase tracking-wider text-[10px] block mb-1">
                        Explanation & Textbook Grounding:
                      </span>
                      <p>{rev.explanation}</p>
                      {rev.source_page && (
                        <p className="text-[11px] text-indigo-700 font-semibold mt-1">
                          Source textbook citation: Page {rev.source_page}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Retake and Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => navigate('/quizzes')}
          className="px-5 py-2.5 rounded-2xl border border-pastel-border text-xs font-semibold text-pastel-dark hover:bg-pastel-cream transition-colors flex items-center gap-2"
        >
          <RotateCcw size={15} />
          <span>Retake or New Quiz</span>
        </button>

        <button
          onClick={() => navigate('/flashcards')}
          className="px-5 py-2.5 rounded-2xl bg-pastel-dark text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2"
        >
          <span>Revise with Flashcards</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
