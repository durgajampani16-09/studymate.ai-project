import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  ShieldCheck,
  Mail,
  Building,
  GraduationCap,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  BookOpen
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [department, setDepartment] = useState(user?.department || 'Artificial Intelligence');
  const [yearOfStudy, setYearOfStudy] = useState(user?.year_of_study || '3rd Year');

  // Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Study Preferences
  const [preferredChunkSize, setPreferredChunkSize] = useState('500');
  const [preferredModel, setPreferredModel] = useState('Grounded RAG (Gemini Flash / Local)');

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await api.put('/profile', {
        name: name.trim(),
        email: email.trim(),
        department: department.trim(),
        year_of_study: yearOfStudy,
      });

      await refreshUser();
      setSuccessMsg('Student profile updated successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMsg('New password must have at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsChangingPass(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSuccessMsg('Account password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Password update failed. Verify current password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-pastel-dark">
          Student Profile & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-pastel-muted mt-1">
          Manage your verified student credentials, academic department, and study configuration.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-pastel-mint/70 border border-pastel-mint-dark/40 text-emerald-950 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-700" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white rounded-4xl p-6 sm:p-8 border border-pastel-border/60 shadow-pastel flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pastel-pink via-pastel-lavender to-pastel-blue flex items-center justify-center font-extrabold text-2xl text-indigo-900 shadow-pastel">
          {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-pastel-dark">{user?.name}</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pastel-blue text-sky-900">
              <ShieldCheck size={12} /> Student ID: {user?.student_id}
            </span>
          </div>
          <p className="text-xs text-pastel-muted">{user?.email}</p>
          <p className="text-xs text-indigo-700 font-semibold">
            {department} · {yearOfStudy}
          </p>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <div className="bg-white rounded-4xl p-6 sm:p-7 border border-pastel-border/60 shadow-pastel space-y-4">
          <h4 className="font-bold text-sm text-pastel-dark flex items-center gap-2">
            <User size={16} className="text-indigo-600" />
            <span>Academic Details</span>
          </h4>

          <form onSubmit={handleUpdateProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-pastel-dark mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-pastel-dark mb-1">
                University Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-pastel-dark mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-pastel-dark mb-1">
                Year of Study
              </label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior / Final Year)</option>
                <option value="Postgraduate">Postgraduate / Masters</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              className="w-full py-2.5 px-4 rounded-2xl bg-pastel-dark text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Save size={14} />
              <span>{isSavingProfile ? 'Saving...' : 'Update Academic Profile'}</span>
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-4xl p-6 sm:p-7 border border-pastel-border/60 shadow-pastel space-y-4">
          <h4 className="font-bold text-sm text-pastel-dark flex items-center gap-2">
            <KeyRound size={16} className="text-indigo-600" />
            <span>Change Account Password</span>
          </h4>

          <form onSubmit={handleChangePassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-pastel-dark mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-pastel-dark mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-pastel-dark mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2 rounded-2xl bg-pastel-light border border-pastel-border text-xs text-pastel-dark outline-none focus:ring-2 focus:ring-pastel-lavender-dark"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPass}
              className="w-full py-2.5 px-4 rounded-2xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <KeyRound size={14} />
              <span>{isChangingPass ? 'Changing...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
