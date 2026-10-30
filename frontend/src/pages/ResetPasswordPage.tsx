import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState((location.state as any)?.token || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError('Please provide a valid verification token.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/reset-password', {
        reset_token: token.trim(),
        new_password: newPassword,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Password reset failed. Token may be invalid or expired.');
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
        <h2 className="text-2xl font-bold text-pastel-dark">Set New Password</h2>
        <p className="text-xs text-pastel-muted mt-1">
          Verify your reset token and enter your new secure password.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="p-6 rounded-3xl bg-pastel-mint/50 border border-pastel-mint-dark/30 text-emerald-900 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-pastel-mint flex items-center justify-center mx-auto text-emerald-800 shadow-sm">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="font-bold text-base">Password Reset Successfully!</h3>
          <p className="text-xs text-emerald-800/80 leading-relaxed">
            Your student account password has been updated. You can now log in with your new credentials.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-4 rounded-2xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-all shadow-sm"
          >
            Sign In with New Password
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Verification Token */}
          <div>
            <label className="block text-xs font-semibold text-pastel-dark mb-1.5">
              Reset Token
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pastel-muted">
                <KeyRound size={16} />
              </div>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter reset token"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-sm text-pastel-dark focus:outline-none focus:ring-2 focus:ring-pastel-lavender-dark transition-all font-mono text-xs"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-pastel-dark mb-1.5">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pastel-muted">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-sm text-pastel-dark focus:outline-none focus:ring-2 focus:ring-pastel-lavender-dark transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-pastel-muted hover:text-pastel-dark"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-pastel-dark mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pastel-muted">
                <Lock size={16} />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-sm text-pastel-dark focus:outline-none focus:ring-2 focus:ring-pastel-lavender-dark transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-pastel-muted hover:text-pastel-dark"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
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
              <span>Reset Password</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
