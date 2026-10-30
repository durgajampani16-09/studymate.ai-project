import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { DocumentItem, ChatMessage, CitationSource } from '../types';
import { PdfViewerModal } from '../components/PdfViewerModal';
import {
  Send,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  Trash2,
  FileText,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Volume2,
  VolumeX
} from 'lucide-react';
import { speechAssistant } from '../utils/speech';

export const ChatPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('all');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      speechAssistant.stop();
    };
  }, []);

  const handleSpeak = (id: string, text: string) => {
    if (speakingMsgId === id) {
      speechAssistant.stop();
      setSpeakingMsgId(null);
    } else {
      speechAssistant.stop();
      setSpeakingMsgId(id);
      speechAssistant.speak(
        text,
        () => setSpeakingMsgId(null),
        () => setSpeakingMsgId(null)
      );
    }
  };

  // Citation modal state
  const [activeCitation, setActiveCitation] = useState<CitationSource | null>(null);
  const [isCitationModalOpen, setIsCitationModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await api.get<DocumentItem[]>('/documents');
        setDocuments(docs);
      } catch (err) {
        console.warn('Could not fetch documents', err);
      }
    };
    fetchDocs();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const text = questionText || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      conversation_id: 'active-session',
      role: 'user',
      content: text.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<{
        answer: string;
        sources: CitationSource[];
        conversation_id: string;
      }>('/chat/query', {
        question: text.trim(),
        document_id: selectedDocId !== 'all' ? selectedDocId : undefined,
      });

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        conversation_id: response.conversation_id,
        role: 'assistant',
        content: response.answer,
        sources: response.sources || [],
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate grounded answer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (messages.length === 0) return;
    if (window.confirm('Clear current conversational study session?')) {
      setMessages([]);
    }
  };

  const starterChips = [
    'Explain the fundamental concept of this chapter with key examples.',
    'What are the most probable 5-mark exam questions from this topic?',
    'List all core definitions and formulas explained in this document.',
    'Summarize the step-by-step working of the main algorithm.',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] animate-fadeIn">
      {/* Top Header / Document Filter Bar */}
      <div className="bg-white rounded-3xl p-4 mb-4 border border-pastel-border/60 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pastel-lavender flex items-center justify-center text-indigo-700">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base text-pastel-dark leading-tight">
              RAG Study Assistant
            </h2>
            <p className="text-[11px] text-pastel-muted">
              Grounded in PyMuPDF text chunks & vector similarity
            </p>
          </div>
        </div>

        {/* Filter by Document */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-pastel-muted hidden sm:block">
            Filter Context:
          </label>
          <div className="relative">
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="appearance-none bg-pastel-light border border-pastel-border text-xs font-medium text-pastel-dark py-2 pl-3 pr-8 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pastel-lavender-dark cursor-pointer"
            >
              <option value="all">📚 All Uploaded Documents</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.chapter})
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-pastel-muted"
            />
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl text-pastel-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Clear chat"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-white rounded-4xl p-4 sm:p-6 border border-pastel-border/60 shadow-pastel overflow-y-auto space-y-5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-pastel-lavender/60 flex items-center justify-center text-indigo-700 mb-4 shadow-sm">
              <BookOpen size={30} />
            </div>
            <h3 className="font-bold text-lg text-pastel-dark mb-1">
              Ask anything from your study materials
            </h3>
            <p className="text-xs sm:text-sm text-pastel-muted mb-6 leading-relaxed">
              Every response is matched against your indexed PDF chunks and tagged with direct textbook page citations.
            </p>

            <div className="w-full space-y-2 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-pastel-muted mb-2 text-center">
                Recommended Starter Inquiries:
              </p>
              {starterChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="w-full text-xs font-medium text-pastel-dark bg-pastel-light hover:bg-pastel-cream p-3 rounded-2xl border border-pastel-border/60 text-left transition-colors flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{chip}</span>
                  <ExternalLink size={13} className="text-pastel-muted group-hover:text-indigo-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 shadow-sm text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-pastel-dark text-white rounded-br-xs'
                    : 'bg-pastel-light text-pastel-dark border border-pastel-border/60 rounded-bl-xs'
                }`}
              >
                {/* Assistant Message Header */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-pastel-border/40">
                    <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-indigo-600" /> StudyMate RAG
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className={`p-1 rounded-lg transition-colors ${
                          speakingMsgId === msg.id
                            ? 'text-indigo-600 bg-indigo-50 animate-pulse'
                            : 'text-pastel-muted hover:text-pastel-dark hover:bg-pastel-cream'
                        }`}
                        title={speakingMsgId === msg.id ? 'Stop listening' : 'Listen to answer'}
                      >
                        {speakingMsgId === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 rounded-lg hover:bg-pastel-cream text-pastel-muted hover:text-pastel-dark transition-colors"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check size={14} className="text-emerald-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Supporting Source Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-pastel-border/60">
                    <p className="text-[11px] font-bold text-pastel-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                      <FileText size={12} /> Supporting Textbook Citations:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((src, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => {
                            setActiveCitation(src);
                            setIsCitationModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-pastel-lavender/70 hover:bg-pastel-lavender border border-indigo-200 text-[11px] font-semibold text-indigo-950 transition-colors"
                        >
                          <span>{src.document_title}</span>
                          <span className="bg-white/80 px-1 rounded text-indigo-800">
                            p. {src.page_number}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-pastel-muted mt-1 px-1">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="max-w-[75%] rounded-3xl p-4 bg-pastel-light border border-pastel-border/60 text-xs text-pastel-dark flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span>Retrieving relevant chunks and verifying citations...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-3 bg-white rounded-3xl p-2 border border-pastel-border/60 shadow-pastel flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={
            selectedDocId === 'all'
              ? 'Ask a question across all your uploaded documents...'
              : 'Ask a question from selected document...'
          }
          className="flex-1 px-4 py-2 text-xs sm:text-sm text-pastel-dark bg-transparent outline-none placeholder:text-pastel-muted"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="p-3 rounded-2xl bg-pastel-dark text-white hover:bg-slate-800 transition-colors disabled:opacity-40 shadow-sm"
        >
          <Send size={16} />
        </button>
      </form>

      {/* PDF Citation Modal */}
      <PdfViewerModal
        isOpen={isCitationModalOpen}
        onClose={() => setIsCitationModalOpen(false)}
        citation={activeCitation}
      />
    </div>
  );
};
