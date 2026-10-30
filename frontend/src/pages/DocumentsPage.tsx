import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { DocumentItem } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import {
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileUp,
  FolderOpen,
  Eye,
  Plus
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const docs = await api.get<DocumentItem[]>('/documents');
      setDocuments(docs);
    } catch (err: any) {
      console.warn('Failed to load documents from backend', err);
      // Empty array fallback
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setError('Invalid file type! Please upload a valid PDF document.');
      return;
    }
    // Limit: 50MB
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds the 50MB limit.');
      return;
    }
    setError(null);
    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please choose a PDF file to upload.');
      return;
    }
    if (!subject.trim() || !chapter.trim()) {
      setError('Please provide Subject and Chapter or Unit for better organization.');
      return;
    }

    setUploading(true);
    setUploadProgress(20);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title.trim() || selectedFile.name);
    formData.append('subject', subject.trim());
    formData.append('chapter', chapter.trim());

    try {
      setUploadProgress(60);
      const newDoc = await api.post<DocumentItem>('/documents/upload', formData);
      setUploadProgress(100);
      setSuccessMsg(`"${newDoc.title}" uploaded and indexed successfully into RAG vector store!`);
      // Reset form
      setSelectedFile(null);
      setTitle('');
      setSubject('');
      setChapter('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchDocuments();
    } catch (err: any) {
      setError(err.message || 'Failed to upload and process PDF.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string, docTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${docTitle}"? All associated embeddings will be removed.`)) {
      return;
    }
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(documents.filter((d) => d.id !== id));
      setSuccessMsg(`Document "${docTitle}" removed.`);
    } catch (err: any) {
      setError(err.message || 'Failed to delete document.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-pastel-dark">
          Study Materials & PDF Manager
        </h2>
        <p className="text-xs sm:text-sm text-pastel-muted mt-1">
          Upload textbook chapters, lecture notes, or syllabus PDFs. PyMuPDF extracts text page-by-page and stores vector embeddings for grounded AI retrieval.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-3xl bg-pastel-mint/60 border border-pastel-mint-dark/40 text-emerald-900 text-xs flex items-start gap-2.5">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-700" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Upload Box Form */}
      <div className="bg-white rounded-4xl p-6 sm:p-8 border border-pastel-border/60 shadow-pastel">
        <h3 className="font-bold text-base text-pastel-dark mb-4 flex items-center gap-2">
          <Upload size={18} className="text-indigo-600" />
          <span>Upload New Study Material</span>
        </h3>

        <form onSubmit={handleUploadSubmit} className="space-y-5">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
              selectedFile
                ? 'border-indigo-400 bg-pastel-lavender/30'
                : 'border-pastel-border hover:border-pastel-lavender-dark hover:bg-pastel-cream/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-pastel-lavender flex items-center justify-center mx-auto text-indigo-700 mb-3 shadow-sm">
              <FileUp size={24} />
            </div>
            {selectedFile ? (
              <div>
                <p className="font-bold text-sm text-pastel-dark truncate max-w-md mx-auto">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-pastel-muted mt-1">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Click to change file
                </p>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-sm text-pastel-dark">
                  Drag and drop your PDF here, or <span className="text-indigo-600 underline">browse files</span>
                </p>
                <p className="text-xs text-pastel-muted mt-1">
                  Supports college textbook chapters and syllabus notes (up to 50MB)
                </p>
              </div>
            )}
          </div>

          {/* Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-pastel-dark mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 3: Machine Learning Algorithms"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-xs sm:text-sm text-pastel-dark focus:ring-2 focus:ring-pastel-lavender-dark outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pastel-dark mb-1">
                Subject / Course <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Artificial Intelligence"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-xs sm:text-sm text-pastel-dark focus:ring-2 focus:ring-pastel-lavender-dark outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pastel-dark mb-1">
                Chapter / Unit <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="e.g. Unit 2: Supervised Learning"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-xs sm:text-sm text-pastel-dark focus:ring-2 focus:ring-pastel-lavender-dark outline-none"
              />
            </div>
          </div>

          {/* Progress bar if uploading */}
          {uploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-pastel-muted">
                <span>Extracting pages and generating vector embeddings...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-pastel-light rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pastel-lavender-dark to-indigo-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="px-6 py-2.5 rounded-2xl bg-pastel-dark text-white font-semibold text-xs sm:text-sm hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Pages...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Upload & Index Document</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Uploaded Documents List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-pastel-dark">
            Your Indexed Study Materials ({documents.length})
          </h3>
          <span className="text-xs text-pastel-muted">
            All stored securely with student isolation
          </span>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching indexed PDFs..." />
        ) : documents.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No Documents Uploaded Yet"
            description="Upload your textbook chapters or syllabus PDFs above to unlock RAG study assistance, automatic summaries, and quizzes."
            colorScheme="blue"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl p-5 border border-pastel-border/60 shadow-pastel flex flex-col justify-between hover:shadow-pastel-hover transition-all duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-pastel-blue flex items-center justify-center text-sky-800 shrink-0 shadow-sm">
                      <FileText size={20} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {doc.processing_status === 'ready' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-pastel-mint text-emerald-800">
                          <CheckCircle2 size={12} /> Ready
                        </span>
                      ) : doc.processing_status === 'processing' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-pastel-lavender text-indigo-800">
                          <Clock size={12} className="animate-spin" /> Processing
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          <AlertCircle size={12} /> Error
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-pastel-dark line-clamp-1" title={doc.title}>
                    {doc.title}
                  </h4>
                  <p className="text-xs text-indigo-700 font-semibold mt-0.5">
                    {doc.subject} · {doc.chapter}
                  </p>

                  <div className="mt-4 pt-3 border-t border-pastel-border/50 grid grid-cols-2 gap-2 text-[11px] text-pastel-muted">
                    <div>
                      <span>Pages:</span>{' '}
                      <strong className="text-pastel-dark">{doc.page_count}</strong>
                    </div>
                    <div>
                      <span>Size:</span>{' '}
                      <strong className="text-pastel-dark">
                        {(doc.file_size / (1024 * 1024)).toFixed(2)} MB
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-pastel-border/50 flex items-center justify-between">
                  <span className="text-[10px] text-pastel-muted">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="p-1.5 rounded-xl text-pastel-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
