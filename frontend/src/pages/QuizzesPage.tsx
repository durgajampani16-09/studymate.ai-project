import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { DocumentItem, QuizItem, QuizAttemptResult } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import {
  Sparkles,
  Timer,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Award,
  Send,
  RotateCcw
} from 'lucide-react';

export const QuizzesPage: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [marksPerQuestion, setMarksPerQuestion] = useState<number>(2);
  const [isTimed, setIsTimed] = useState<boolean>(true);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(10);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<QuizItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const docs = await api.get<DocumentItem[]>('/documents');
        setDocuments(docs);
        if (docs.length > 0) setSelectedDocId(docs[0].id);
      } catch (err) {
        console.warn('Backend not reached', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!activeQuiz || !isTimed || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQuiz, isTimed, timeRemaining]);

  const handleGenerateQuiz = async () => {
    if (!selectedDocId) {
      setError('Please select an uploaded document.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const quiz = await api.post<QuizItem>('/quizzes/generate', {
        document_id: selectedDocId,
        question_count: questionCount,
        difficulty,
        marks_per_question: marksPerQuestion,
        total_marks_limit: questionCount * marksPerQuestion,
        time_limit_minutes: isTimed ? timeLimitMinutes : undefined,
      });

      setActiveQuiz(quiz);
      setCurrentQuestionIndex(0);
      setAnswers({});
      if (isTimed) {
        setTimeRemaining(timeLimitMinutes * 60);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz from textbook.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (qId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const handleAutoSubmit = () => {
    alert('Time limit reached! Submitting your answers automatically.');
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || isSubmitting) return;

    if (!window.confirm('Are you sure you want to submit your quiz?')) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const totalSeconds = isTimed ? timeLimitMinutes * 60 - timeRemaining : 120;

    try {
      const result = await api.post<QuizAttemptResult>(
        `/quizzes/${activeQuiz.id}/submit`,
        {
          answers,
          time_spent_seconds: Math.max(1, totalSeconds),
        }
      );

      navigate('/quiz-results', { state: { result } });
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz.');
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <LoadingSpinner message="Loading quiz workshop..." />;
  }

  // Active Quiz Interface
  if (activeQuiz) {
    const currentQuestion = activeQuiz.questions[currentQuestionIndex];
    const totalQuestions = activeQuiz.questions.length;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        {/* Test Header */}
        <div className="bg-white rounded-3xl p-5 border border-pastel-border/60 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              {activeQuiz.subject} · {activeQuiz.chapter}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-pastel-dark">
              {activeQuiz.title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {isTimed && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-mono font-bold text-xs ${
                  timeRemaining < 120
                    ? 'bg-rose-100 text-rose-800 animate-pulse'
                    : 'bg-pastel-cream text-amber-900 border border-amber-200'
                }`}
              >
                <Timer size={15} />
                <span>{formatTimer(timeRemaining)}</span>
              </div>
            )}

            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-2xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Grading...</span>
              ) : (
                <>
                  <Send size={13} />
                  <span>Submit Quiz</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-4 border border-pastel-border/60">
          <div className="flex items-center justify-between text-xs text-pastel-muted mb-2">
            <span>
              Question <strong className="text-pastel-dark">{currentQuestionIndex + 1}</strong> of{' '}
              {totalQuestions}
            </span>
            <span>
              {answeredCount} of {totalQuestions} Answered
            </span>
          </div>
          <div className="w-full h-2 bg-pastel-light rounded-full overflow-hidden">
            <div
              className="h-full bg-pastel-lavender-dark transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Body */}
        {currentQuestion && (
          <div className="bg-white rounded-4xl p-6 sm:p-8 border border-pastel-border/60 shadow-pastel space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pastel-lavender text-indigo-900">
                Question {currentQuestionIndex + 1} ({currentQuestion.marks} Marks)
              </span>
              <span className="text-xs text-pastel-muted">
                Type: {currentQuestion.question_type.toUpperCase()}
              </span>
            </div>

            <h3 className="font-bold text-base sm:text-lg text-pastel-dark leading-snug">
              {currentQuestion.question}
            </h3>

            {/* Options for MCQ */}
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              <div className="space-y-3">
                {currentQuestion.options.map((opt, oIdx) => {
                  const isSelected = answers[currentQuestion.id] === opt;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectAnswer(currentQuestion.id, opt)}
                      className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-medium transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'bg-pastel-lavender border-indigo-400 text-indigo-950 font-bold shadow-xs'
                          : 'bg-pastel-light/60 border-pastel-border/60 hover:bg-pastel-cream text-pastel-dark'
                      }`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-pastel-muted'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Short Answer input */
              <div>
                <label className="block text-xs font-semibold text-pastel-muted mb-2">
                  Enter your answer / formulation:
                </label>
                <textarea
                  rows={3}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleSelectAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Type your explanation here..."
                  className="w-full p-3.5 rounded-2xl bg-pastel-light border border-pastel-border text-xs sm:text-sm text-pastel-dark focus:ring-2 focus:ring-pastel-lavender-dark outline-none"
                />
              </div>
            )}

            {/* Bottom Nav Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-pastel-border/60">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-2xl border border-pastel-border text-xs font-semibold text-pastel-dark hover:bg-pastel-cream transition-colors flex items-center gap-1.5 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
                    }
                    className="px-5 py-2 rounded-2xl bg-pastel-dark text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <span>Next Question</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={16} />
                    <span>Finish & Evaluate</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Quiz Setup Interface
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-pastel-dark">
          Interactive Quiz Generator
        </h2>
        <p className="text-xs sm:text-sm text-pastel-muted mt-1">
          Configure timed practice exams generated directly from your uploaded textbook chapters. AI evaluates answers with transparent marks rubrics and textbook page citations.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      )}

      {/* Quiz Configuration Form */}
      <div className="bg-white rounded-4xl p-6 sm:p-8 border border-pastel-border/60 shadow-pastel space-y-6">
        <h3 className="font-bold text-base text-pastel-dark flex items-center gap-2">
          <Sparkles size={18} className="text-indigo-600" />
          <span>New Quiz Setup</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-pastel-dark mb-1">
              Select Textbook / Unit
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-xs sm:text-sm text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
            >
              {documents.length === 0 ? (
                <option value="">No documents uploaded</option>
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
              Difficulty Tier
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-xs sm:text-sm text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
            >
              <option value="Easy">Easy (Recall & Fundamentals)</option>
              <option value="Medium">Medium (Application & Problem Solving)</option>
              <option value="Hard">Hard (Evaluation & Deep Analysis)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pastel-dark mb-1">
              Question Count
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-xs sm:text-sm text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
            >
              <option value={3}>3 Questions (Quick Drill)</option>
              <option value={5}>5 Questions (Standard Practice)</option>
              <option value={10}>10 Questions (Comprehensive Test)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pastel-dark mb-1">
              Marks per Question
            </label>
            <select
              value={marksPerQuestion}
              onChange={(e) => setMarksPerQuestion(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-xs sm:text-sm text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
            >
              <option value={1}>1 Mark (Objective MCQ)</option>
              <option value={2}>2 Marks (Short Formulation)</option>
              <option value={5}>5 Marks (Standard Concept)</option>
            </select>
          </div>
        </div>

        {/* Timed Settings */}
        <div className="p-4 rounded-3xl bg-pastel-cream/70 border border-amber-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="timed-toggle"
              checked={isTimed}
              onChange={(e) => setIsTimed(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <label htmlFor="timed-toggle" className="text-xs font-semibold text-pastel-dark select-none">
              Enable Timed Examination Mode
            </label>
          </div>

          {isTimed && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-pastel-muted">Time Limit:</span>
              <select
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                className="px-2.5 py-1 rounded-xl bg-white border border-amber-300 text-xs font-bold text-amber-950"
              >
                <option value={5}>5 Minutes</option>
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes</option>
                <option value={20}>20 Minutes</option>
              </select>
            </div>
          )}
        </div>

        <button
          onClick={handleGenerateQuiz}
          disabled={isGenerating || !selectedDocId}
          className="w-full py-3.5 px-4 rounded-2xl bg-pastel-dark text-white font-semibold text-sm hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating Grounded Quiz from Textbook...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Start Practice Quiz Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
