import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Send, KeyRound } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please provide your Student ID or registered email.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.post<{ message: string; reset_token?: string; email_sent: boolean }>(
        '/auth/forgot-password',
        { identifier: identifier.trim() }
      );

      setSubmitted(true);
      setInfoMessage(res.message);
      if (res.reset_token) {
        setResetToken(res.reset_token);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to request password recovery. Please check your Student ID.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-pastel-muted hover:text-pastel-dark mb-3 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Login</span>
        </Link>
        <h2 className="text-2xl font-bold text-pastel-dark">Password Recovery</h2>
        <p className="text-xs text-pastel-muted mt-1">
          Enter your Student ID or registered university email address to initiate verification.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {submitted ? (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-pastel-mint/50 border border-pastel-mint-dark/30 text-emerald-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 size={18} className="text-emerald-700" />
              <span>Recovery Request Processed</span>
            </div>
            <p className="leading-relaxed">
              {infoMessage || 'A verification token has been generated for your student account.'}
            </p>
          </div>

          {resetToken && (
            <div className="p-4 rounded-3xl bg-pastel-cream border border-amber-200 text-xs space-y-2">
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                <KeyRound size={14} /> Development & Verification Token:
              </p>
              <p className="text-pastel-dark font-mono text-[11px] bg-white p-2 rounded-xl border select-all break-all">
                {resetToken}
              </p>
              <p className="text-[10px] text-pastel-muted">
                In local mode without an SMTP provider, use this direct token to proceed immediately.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              navigate('/reset-password', {
                state: { token: resetToken || '', identifier },
              })
            }
            className="w-full py-3 px-4 rounded-2xl bg-pastel-dark text-white font-semibold text-sm hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Proceed to Reset Password</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-pastel-dark mb-1.5">
              Student ID or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pastel-muted">
                <Mail size={16} />
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. STU-2026-001 or student@university.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-sm text-pastel-dark focus:outline-none focus:ring-2 focus:ring-pastel-lavender-dark transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-2xl bg-pastel-dark text-white font-semibold text-sm hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={15} />
                <span>Send Recovery Token</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
