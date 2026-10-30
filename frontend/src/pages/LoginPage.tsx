import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, User, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [studentId, setStudentId] = useState(
    () => localStorage.getItem('studymate_remember_id') || 'STU-2026-001'
  );
  const [password, setPassword] = useState('Pass@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Registration fields
  const [name, setName] = useState('Durga Student');
  const [email, setEmail] = useState('durga@student.university.edu');
  const [department, setDepartment] = useState('Computer Science & AI');

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!studentId.trim() || !password.trim()) {
      setError('Please provide both your Student ID and Password.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRegisterMode) {
        if (!name.trim() || !email.trim()) {
          setError('Please provide your full name and university email.');
          setIsSubmitting(false);
          return;
        }
        await register(studentId, password, name, email, department, '3rd Year');
      } else {
        await login(studentId, password, rememberMe);
      }
      const destination = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your student credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setStudentId('STU-2026-001');
    setPassword('Pass@1234');
    setError(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-pastel-dark">
          {isRegisterMode ? 'Student Registration' : 'Student Login'}
        </h2>
        <p className="text-xs text-pastel-muted mt-1">
          {isRegisterMode
            ? 'Create your StudyMate student account for RAG-assisted revision'
            : 'Enter your assigned Student ID and password to access your materials'}
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegisterMode && (
          <>
            <div>
              <label className="block text-xs font-semibold text-pastel-dark mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Durga Sharma"
                className="w-full px-4 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-sm text-pastel-dark focus:outline-none focus:ring-2 focus:ring-pastel-lavender-dark transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pastel-dark mb-1.5">
                University Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-4 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-sm text-pastel-dark focus:outline-none focus:ring-2 focus:ring-pastel-lavender-dark transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-pastel-dark mb-1.5">
                Department / Major
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Artificial Intelligence"
                className="w-full px-4 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-sm text-pastel-dark focus:outline-none focus:ring-2 focus:ring-pastel-lavender-dark transition-all"
              />
            </div>
          </>
        )}

        {/* Student ID */}
        <div>
          <label className="block text-xs font-semibold text-pastel-dark mb-1.5">
            Student ID / Roll No.
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pastel-muted">
              <User size={16} />
            </div>
            <input
              type="text"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. STU-2026-001"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-pastel-light border border-pastel-border text-sm text-pastel-dark focus:outline-none focus:ring-2 focus:ring-pastel-lavender-dark transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-pastel-dark">
              Password
            </label>
            {!isRegisterMode && (
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pastel-muted">
              <Lock size={16} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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

        {/* Remember Me */}
        {!isRegisterMode && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-pastel-border rounded focus:ring-indigo-500"
            />
            <label htmlFor="remember-me" className="ml-2 text-xs text-pastel-muted select-none">
              Remember my Student ID on this device
            </label>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3 px-4 rounded-2xl bg-pastel-dark text-white font-semibold text-sm hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>{isRegisterMode ? 'Create Student Account' : 'Sign In to Dashboard'}</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Mode switch */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            setIsRegisterMode(!isRegisterMode);
            setError(null);
          }}
          className="text-xs font-semibold text-pastel-muted hover:text-indigo-600 transition-colors"
        >
          {isRegisterMode
            ? 'Already have an ID? Switch to Student Sign In'
            : 'New student? Register an account'}
        </button>
      </div>

      {/* Quick Demo Fill Pill for Fast Evaluation */}
      <div className="mt-6 pt-5 border-t border-pastel-border/60 text-center">
        <p className="text-[11px] text-pastel-muted mb-2 font-medium">Quick Capstone Evaluation Credentials:</p>
        <button
          type="button"
          onClick={handleDemoFill}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-lavender/50 text-[11px] font-semibold text-indigo-900 hover:bg-pastel-lavender transition-colors"
        >
          <CheckCircle2 size={13} className="text-indigo-700" />
          <span>Auto-fill Demo Student ID (STU-2026-001)</span>
        </button>
      </div>
    </div>
  );
};
