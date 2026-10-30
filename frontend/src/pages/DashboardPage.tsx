import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DashboardStats, StudyActivity, QuizAttemptResult } from '../types';
import { StatCard } from '../components/StatCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ConceptMapView } from '../components/ConceptMapView';
import {
  FileText,
  BookOpen,
  HelpCircle,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  Upload,
  MessageSquare,
  Clock,
  CheckCircle,
  BarChart3,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await api.get<DashboardStats>('/dashboard/stats');
        setStats(data);
      } catch (err: any) {
        console.warn('Backend not reached, using default initial stats', err);
        // Fallback default stats for display
        setStats({
          total_documents: 0,
          subjects_count: 0,
          chapters_count: 0,
          important_questions_count: 0,
          quizzes_completed: 0,
          total_quiz_attempts: 0,
          average_quiz_score: 0,
          flashcards_known: 0,
          flashcards_total: 0,
          recent_activities: [],
          recent_quiz_results: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your student study metrics..." />;
  }

  const quickActions = [
    {
      title: 'Upload PDF',
      desc: 'Process textbook or syllabus',
      icon: Upload,
      to: '/documents',
      color: 'bg-pastel-blue text-sky-800',
    },
    {
      title: 'Ask AI (RAG)',
      desc: 'Query with textbook citations',
      icon: MessageSquare,
      to: '/chat',
      color: 'bg-pastel-lavender text-indigo-800',
    },
    {
      title: 'Generate Summary',
      desc: 'Key points & formulas',
      icon: BookOpen,
      to: '/summaries',
      color: 'bg-pastel-mint text-emerald-800',
    },
    {
      title: 'Important Questions',
      desc: '2, 5 & 10 mark practice',
      icon: HelpCircle,
      to: '/important-questions',
      color: 'bg-pastel-pink text-rose-800',
    },
    {
      title: 'Create Quiz',
      desc: 'Timed test & grading',
      icon: Sparkles,
      to: '/quizzes',
      color: 'bg-pastel-cream text-amber-800',
    },
    {
      title: 'Study Flashcards',
      desc: 'Active recall spaced cards',
      icon: Layers,
      to: '/flashcards',
      color: 'bg-purple-100 text-purple-800',
    },
  ];

  const flashcardPercentage = stats && stats.flashcards_total > 0
    ? Math.round((stats.flashcards_known / stats.flashcards_total) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pastel-lavender via-pastel-blue/60 to-pastel-pink/50 rounded-4xl p-6 sm:p-8 border border-white/60 shadow-pastel relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-xs font-semibold text-pastel-dark mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Student Portal Active: {user?.student_id || 'ID-001'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-pastel-dark tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 📚
          </h2>
          <p className="text-sm text-pastel-muted mt-2 leading-relaxed">
            Ready to prepare for your exams? All answers generated in StudyMate AI are strictly grounded in your uploaded documents using vector similarity search.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Uploaded Materials"
          value={stats?.total_documents ?? 0}
          subtitle={`${stats?.subjects_count ?? 0} Subjects · ${stats?.chapters_count ?? 0} Chapters`}
          icon={FileText}
          variant="blue"
        />
        <StatCard
          title="Questions Saved"
          value={stats?.important_questions_count ?? 0}
          subtitle="Exam questions indexed"
          icon={HelpCircle}
          variant="lavender"
        />
        <StatCard
          title="Average Quiz Score"
          value={`${stats?.average_quiz_score ? Math.round(stats.average_quiz_score) : 0}%`}
          subtitle={`${stats?.quizzes_completed ?? 0} Quizzes Completed`}
          icon={Award}
          variant="mint"
          trend={`${stats?.total_quiz_attempts ?? 0} Attempts`}
        />
        <StatCard
          title="Flashcard Mastery"
          value={`${flashcardPercentage}%`}
          subtitle={`${stats?.flashcards_known ?? 0} of ${stats?.flashcards_total ?? 0} cards mastered`}
          icon={Layers}
          variant="pink"
        />
      </div>

      {/* Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-pastel-dark">
            Quick Actions
          </h3>
          <span className="text-xs text-pastel-muted">RAG Accelerated Tools</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(action.to)}
                className="bg-white p-4 rounded-3xl border border-pastel-border/60 hover:border-pastel-lavender-dark hover:shadow-pastel transition-all duration-200 text-left flex flex-col justify-between group"
              >
                <div className={`w-10 h-10 rounded-2xl ${action.color} flex items-center justify-center mb-3 transition-transform group-hover:scale-110`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-pastel-dark leading-tight group-hover:text-indigo-900 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-pastel-muted mt-0.5 line-clamp-1">
                    {action.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Concept Knowledge Map */}
      <ConceptMapView />

      {/* Recent Activity and Quiz Results Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Study Activity */}
        <div className="lg:col-span-7 bg-white rounded-4xl p-6 border border-pastel-border/60 shadow-pastel">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-base text-pastel-dark">Recent Study Activity</h3>
              <p className="text-xs text-pastel-muted">Your logged timeline of learning actions</p>
            </div>
            <button
              onClick={() => navigate('/study-history')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {stats?.recent_activities && stats.recent_activities.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_activities.slice(0, 5).map((act, i) => (
                <div
                  key={act.id || i}
                  className="flex items-center justify-between p-3 rounded-2xl bg-pastel-light/60 border border-pastel-border/40 hover:bg-pastel-cream/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-pastel-lavender flex items-center justify-center text-indigo-700 shrink-0">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-pastel-dark">{act.title}</p>
                      <p className="text-[11px] text-pastel-muted truncate max-w-xs">{act.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-pastel-muted shrink-0 font-medium">
                    {new Date(act.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-pastel-muted">
              <Calendar size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">No study activities recorded yet.</p>
              <p className="text-[11px] mt-0.5">Upload your first textbook PDF to get started!</p>
            </div>
          )}
        </div>

        {/* Recent Quiz Scores */}
        <div className="lg:col-span-5 bg-white rounded-4xl p-6 border border-pastel-border/60 shadow-pastel">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-base text-pastel-dark">Quiz Performance</h3>
              <p className="text-xs text-pastel-muted">Latest evaluated tests</p>
            </div>
            <button
              onClick={() => navigate('/quiz-results')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Results</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {stats?.recent_quiz_results && stats.recent_quiz_results.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_quiz_results.slice(0, 4).map((q, i) => (
                <div
                  key={q.id || i}
                  className="p-3.5 rounded-2xl bg-pastel-light/60 border border-pastel-border/40 flex items-center justify-between"
                >
                  <div className="truncate mr-2">
                    <h5 className="font-bold text-xs text-pastel-dark truncate">{q.quiz_title}</h5>
                    <p className="text-[11px] text-pastel-muted">{q.chapter || q.subject}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-pastel-mint text-emerald-800">
                      {q.marks_obtained}/{q.total_marks} ({Math.round(q.percentage)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-pastel-muted">
              <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">No quiz attempts yet.</p>
              <p className="text-[11px] mt-0.5">Generate a quiz from any chapter to test yourself.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
