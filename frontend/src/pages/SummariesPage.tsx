import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DocumentItem, SummaryItem } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import {
  BookOpen,
  Sparkles,
  Copy,
  Check,
  FileText,
  ListOrdered,
  Bookmark,
  Calculator,
  CheckCircle2,
  Trash2,
  Layers,
  Volume2,
  VolumeX,
  Printer
} from 'lucide-react';
import { speechAssistant } from '../utils/speech';

export const SummariesPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [summaries, setSummaries] = useState<SummaryItem[]>([]);
  const [activeSummary, setActiveSummary] = useState<SummaryItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      speechAssistant.stop();
    };
  }, []);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      speechAssistant.stop();
      setIsSpeaking(false);
    } else if (activeSummary) {
      const readText = `${activeSummary.chapter}. Summary: ${activeSummary.short_summary}. Main points: ${activeSummary.main_points.join('. ')}`;
      setIsSpeaking(true);
      speechAssistant.speak(
        readText,
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const docs = await api.get<DocumentItem[]>('/documents');
        setDocuments(docs);
        if (docs.length > 0) {
          setSelectedDocId(docs[0].id);
        }

        const savedSummaries = await api.get<SummaryItem[]>('/summaries');
        setSummaries(savedSummaries);
        if (savedSummaries.length > 0) {
          setActiveSummary(savedSummaries[0]);
        }
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
      const summary = await api.post<SummaryItem>('/summaries/generate', {
        document_id: selectedDocId,
      });

      setSummaries((prev) => [summary, ...prev.filter((s) => s.id !== summary.id)]);
      setActiveSummary(summary);
    } catch (err: any) {
      setError(err.message || 'Failed to generate chapter summary.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!activeSummary) return;
    const text = `
=== ${activeSummary.document_title} — ${activeSummary.chapter} ===

SHORT SUMMARY:
${activeSummary.short_summary}

DETAILED SUMMARY:
${activeSummary.detailed_summary}

MAIN POINTS:
${activeSummary.main_points.map((p, i) => `${i + 1}. ${p}`).join('\n')}

IMPORTANT DEFINITIONS:
${activeSummary.important_definitions.map((d) => `• ${d.term}: ${d.definition}`).join('\n')}

FORMULAS & EQUATIONS:
${activeSummary.formulas.map((f) => `• ${f.title}: ${f.formula} (${f.explanation})`).join('\n')}

EXAM REVISION NOTES:
${activeSummary.revision_notes.map((n) => `• ${n}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteSummary = async (id: string) => {
    if (!window.confirm('Delete this generated summary?')) return;
    try {
      await api.delete(`/summaries/${id}`);
      const updated = summaries.filter((s) => s.id !== id);
      setSummaries(updated);
      setActiveSummary(updated.length > 0 ? updated[0] : null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete summary.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching chapter summaries..." />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-pastel-dark">
            Chapter Summary & Revision Notes
          </h2>
          <p className="text-xs sm:text-sm text-pastel-muted mt-1">
            Generate high-yield summaries, key concepts, formulas, and definitions from any uploaded chapter.
          </p>
        </div>

        {/* Generate Selector Form */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            disabled={isGenerating || documents.length === 0}
            className="px-3 py-2 rounded-2xl bg-white border border-pastel-border text-xs font-medium text-pastel-dark shadow-sm focus:ring-2 focus:ring-pastel-lavender-dark outline-none cursor-pointer"
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
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedDocId}
            className="px-4 py-2 rounded-2xl bg-pastel-dark text-white font-semibold text-xs hover:bg-slate-800 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      )}

      {/* Main Content Layout */}
      {summaries.length === 0 && !activeSummary ? (
        <EmptyState
          icon={BookOpen}
          title="No Summaries Generated Yet"
          description={
            documents.length === 0
              ? 'Please upload a PDF document first in the PDF Documents tab.'
              : 'Select one of your uploaded chapters above and click Generate to extract comprehensive revision notes.'
          }
          colorScheme="mint"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Summary Selector Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-4xl p-4 sm:p-5 border border-pastel-border/60 shadow-pastel space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-pastel-muted px-2">
              Saved Summaries ({summaries.length})
            </h3>
            <div className="space-y-2 max-h-[70vh] overflow-y-auto">
              {summaries.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setActiveSummary(s)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    activeSummary?.id === s.id
                      ? 'bg-pastel-lavender/60 border-indigo-300 shadow-sm'
                      : 'bg-pastel-light/60 border-pastel-border/60 hover:bg-pastel-cream'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-pastel-dark truncate max-w-[180px]">
                      {s.chapter}
                    </h4>
                    <span className="text-[10px] text-pastel-muted">
                      {new Date(s.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-pastel-muted truncate mt-0.5">
                    {s.document_title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Active Summary Display */}
          {activeSummary && (
            <div className="lg:col-span-8 bg-white rounded-4xl p-6 sm:p-8 border border-pastel-border/60 shadow-pastel space-y-6">
              {/* Header and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-pastel-border/60 gap-3">
                <div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-pastel-mint text-emerald-800 mb-1">
                    <CheckCircle2 size={12} /> RAG Grounded Summary
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-pastel-dark">
                    {activeSummary.chapter}
                  </h3>
                  <p className="text-xs text-indigo-700 font-semibold mt-0.5">
                    {activeSummary.document_title} · Source Pages:{' '}
                    {activeSummary.source_pages.join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleSpeech}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSpeaking
                        ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse'
                        : 'border-pastel-border text-pastel-dark hover:bg-pastel-cream'
                    }`}
                    title={isSpeaking ? 'Stop listening' : 'Listen to audio revision'}
                  >
                    {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} className="text-indigo-600" />}
                    <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-xl border border-pastel-border text-xs font-semibold text-pastel-dark hover:bg-pastel-cream transition-colors flex items-center gap-1.5"
                    title="Print or export as PDF"
                  >
                    <Printer size={14} className="text-pastel-muted" />
                    <span>Print</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-xl border border-pastel-border text-xs font-semibold text-pastel-dark hover:bg-pastel-cream transition-colors flex items-center gap-1.5"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy All'}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteSummary(activeSummary.id)}
                    className="p-1.5 rounded-xl text-pastel-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete summary"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Short Summary Card */}
              <div className="bg-pastel-lavender/40 border border-pastel-lavender-dark/30 rounded-3xl p-5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-950 mb-2 flex items-center gap-1.5">
                  <Bookmark size={14} /> Quick Abstract (Short Summary)
                </h4>
                <p className="text-xs sm:text-sm text-pastel-dark leading-relaxed">
                  {activeSummary.short_summary}
                </p>
              </div>

              {/* Detailed Summary */}
              <div>
                <h4 className="font-bold text-sm text-pastel-dark mb-2 flex items-center gap-1.5">
                  <FileText size={16} className="text-indigo-600" />
                  <span>Comprehensive Chapter Breakdown</span>
                </h4>
                <p className="text-xs sm:text-sm text-pastel-muted leading-relaxed whitespace-pre-line bg-pastel-light/60 p-4 rounded-2xl border border-pastel-border/60">
                  {activeSummary.detailed_summary}
                </p>
              </div>

              {/* Main Points */}
              {activeSummary.main_points?.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm text-pastel-dark mb-3 flex items-center gap-1.5">
                    <ListOrdered size={16} className="text-indigo-600" />
                    <span>Key Highlights & Main Points</span>
                  </h4>
                  <ul className="space-y-2">
                    {activeSummary.main_points.map((pt, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-pastel-dark bg-white p-3 rounded-2xl border border-pastel-border/50 shadow-xs"
                      >
                        <span className="w-5 h-5 rounded-full bg-pastel-blue text-sky-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Important Definitions */}
              {activeSummary.important_definitions?.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm text-pastel-dark mb-3 flex items-center gap-1.5">
                    <Layers size={16} className="text-indigo-600" />
                    <span>Important Definitions for Exams</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeSummary.important_definitions.map((def, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-pastel-cream/60 border border-amber-200/60"
                      >
                        <h5 className="font-bold text-xs text-amber-950 mb-1">{def.term}</h5>
                        <p className="text-xs text-pastel-muted leading-relaxed">{def.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulas & Equations */}
              {activeSummary.formulas?.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm text-pastel-dark mb-3 flex items-center gap-1.5">
                    <Calculator size={16} className="text-indigo-600" />
                    <span>Formulas & Mathematical Formulations</span>
                  </h4>
                  <div className="space-y-2.5">
                    {activeSummary.formulas.map((form, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-pastel-mint/40 border border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <span className="font-bold text-xs text-emerald-950 block">{form.title}</span>
                          <span className="text-xs text-emerald-900/80">{form.explanation}</span>
                        </div>
                        <code className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-xl border border-emerald-200 text-emerald-900 shrink-0">
                          {form.formula}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exam-Oriented Revision Notes */}
              {activeSummary.revision_notes?.length > 0 && (
                <div className="bg-pastel-light rounded-3xl p-5 border border-pastel-border/60">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-pastel-dark mb-3">
                    🎯 Quick Exam-Oriented Revision Checklist
                  </h4>
                  <div className="space-y-2">
                    {activeSummary.revision_notes.map((note, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-pastel-dark">
                        <CheckCircle2 size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
