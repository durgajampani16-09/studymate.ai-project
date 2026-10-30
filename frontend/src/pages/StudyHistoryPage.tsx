import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { StudyActivity } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import {
  History,
  Search,
  Filter,
  Trash2,
  FileText,
  MessageSquare,
  BookOpen,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  Calendar
} from 'lucide-react';

export const StudyHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<StudyActivity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await api.get<StudyActivity[]>('/history');
      setActivities(data);
    } catch (err) {
      console.warn('Backend not reached', err);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteActivity = async (id: string) => {
    if (!window.confirm('Delete this study log entry?')) return;
    try {
      await api.delete(`/history/${id}`);
      setActivities(activities.filter((a) => a.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to remove entry.');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear your study activity log?')) return;
    try {
      await api.delete('/history/clear-all');
      setActivities([]);
    } catch (err: any) {
      setError(err.message || 'Failed to clear history.');
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return { icon: FileText, bg: 'bg-pastel-blue text-sky-800' };
      case 'chat':
        return { icon: MessageSquare, bg: 'bg-pastel-lavender text-indigo-800' };
      case 'summary':
        return { icon: BookOpen, bg: 'bg-pastel-mint text-emerald-800' };
      case 'important_questions':
        return { icon: HelpCircle, bg: 'bg-pastel-pink text-rose-800' };
      case 'quiz':
        return { icon: Sparkles, bg: 'bg-pastel-cream text-amber-800' };
      case 'flashcard':
        return { icon: Layers, bg: 'bg-purple-100 text-purple-800' };
      default:
        return { icon: Clock, bg: 'bg-pastel-light text-pastel-dark' };
    }
  };

  const filtered = activities.filter((act) => {
    const matchesType = selectedType === 'all' || act.activity_type === selectedType;
    const matchesSearch =
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (act.subject && act.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner message="Retrieving your study history logs..." />;
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-pastel-dark">
            Study History & Activity Audit
          </h2>
          <p className="text-xs sm:text-sm text-pastel-muted mt-1">
            Complete persistent audit log of your uploads, queries, summaries, quiz attempts, and scores.
          </p>
        </div>

        {activities.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 rounded-2xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 size={14} />
            <span>Clear History Log</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-pastel-border/60 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pastel-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by topic, document, or score..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Activities' },
            { id: 'upload', label: 'PDFs' },
            { id: 'chat', label: 'Chat Q&A' },
            { id: 'summary', label: 'Summaries' },
            { id: 'quiz', label: 'Quizzes' },
            { id: 'important_questions', label: 'Questions' },
            { id: 'flashcard', label: 'Cards' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === type.id
                  ? 'bg-pastel-dark text-white shadow-xs'
                  : 'bg-pastel-light text-pastel-muted hover:bg-pastel-cream hover:text-pastel-dark'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Matching Activity Found"
          description="Your revision actions, quiz attempts, and document interactions will automatically be logged here."
          colorScheme="blue"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((act) => {
            const { icon: Icon, bg } = getActivityIcon(act.activity_type);
            return (
              <div
                key={act.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-pastel-border/60 shadow-pastel hover:shadow-pastel-hover transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center shrink-0 shadow-xs`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-pastel-dark">{act.title}</h4>
                      {act.subject && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pastel-light border text-pastel-muted">
                          {act.subject}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-pastel-muted mt-0.5 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-pastel-border/40">
                  <span className="text-[11px] text-pastel-muted flex items-center gap-1 font-medium">
                    <Calendar size={12} />
                    {new Date(act.created_at).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  <button
                    onClick={() => handleDeleteActivity(act.id)}
                    className="p-1.5 rounded-xl text-pastel-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove entry"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
