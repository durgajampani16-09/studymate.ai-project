import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoutModal } from './LogoutModal';
import { FormulaSheetModal } from './FormulaSheetModal';
import { CapstoneRubricModal } from './CapstoneRubricModal';
import {
  Menu,
  User,
  LogOut,
  Sparkles,
  BookMarked,
  ShieldCheck,
  Calculator,
  Award,
  Wifi,
  WifiOff
} from 'lucide-react';

interface NavbarProps {
  onMobileMenuToggle: () => void;
  title?: string;
  subtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,
  title = 'Student Workspace',
  subtitle = 'Retrieval-Augmented Study Assistant',
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [showRubricModal, setShowRubricModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);

  useEffect(() => {
    const handleStatus = (e: any) => {
      setIsBackendOnline(!!e.detail?.online);
    };
    window.addEventListener('studymate-backend-status', handleStatus);
    return () => window.removeEventListener('studymate-backend-status', handleStatus);
  }, []);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
      navigate('/logout');
    } catch (e) {
      console.error(e);
      setShowLogoutModal(false);
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-pastel-border/60 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
        {/* Left Section: Mobile trigger and Page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-xl text-pastel-dark hover:bg-pastel-cream md:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-pastel-dark leading-snug">
              {title}
            </h1>
            <p className="text-[11px] sm:text-xs text-pastel-muted hidden sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Section: Quick Access Tools & Student Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action: Formula Sheet */}
          <button
            onClick={() => setShowFormulaModal(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-pastel-cream hover:bg-amber-100/70 border border-amber-200/60 text-xs font-semibold text-amber-900 transition-all shadow-2xs"
            title="Open Formula Sheet"
          >
            <Calculator size={14} className="text-amber-700" />
            <span>Formulas</span>
          </button>

          {/* Quick Action: Capstone Guidelines & Rubric */}
          <button
            onClick={() => setShowRubricModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 text-xs font-semibold text-indigo-900 transition-all shadow-2xs"
            title="View 100M Capstone Rubric & RAG Specs"
          >
            <Award size={14} className="text-indigo-700" />
            <span>AI Capstone (100M)</span>
          </button>

          {/* Backend / Simulation Status Pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              isBackendOnline
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-pastel-lavender/60 text-indigo-900 border-pastel-lavender-dark/50'
            }`}
            title={
              isBackendOnline
                ? 'Connected to live FastAPI backend on port 8000'
                : 'Running in Interactive Demo Mode with pre-loaded textbook notes & RAG simulation'
            }
          >
            {isBackendOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden lg:inline">Backend: Live</span>
                <span className="lg:hidden">Live</span>
              </>
            ) : (
              <>
                <Sparkles size={11} className="text-indigo-600" />
                <span className="hidden lg:inline">Interactive Demo</span>
                <span className="lg:hidden">Demo</span>
              </>
            )}
          </div>

          {/* Student Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full hover:bg-pastel-cream/80 transition-colors border border-transparent hover:border-pastel-border"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pastel-pink to-pastel-lavender flex items-center justify-center font-bold text-xs text-pastel-dark shadow-sm">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-pastel-dark truncate max-w-[110px]">
                  {user?.name || 'Student'}
                </p>
                <p className="text-[10px] text-pastel-muted truncate max-w-[110px]">
                  {user?.student_id || 'STU-2026-001'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-3xl shadow-pastel-hover border border-pastel-border py-2 z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b border-pastel-border/60">
                  <p className="text-xs font-bold text-pastel-dark">{user?.name || 'Student User'}</p>
                  <p className="text-[11px] text-pastel-muted truncate">{user?.email || 'student@university.edu'}</p>
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] bg-pastel-blue text-slate-800 px-2 py-0.5 rounded-full font-medium">
                    <ShieldCheck size={10} /> ID: {user?.student_id || 'STU-2026-001'}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-pastel-dark hover:bg-pastel-cream"
                  >
                    <User size={15} className="text-indigo-600" />
                    <span>My Profile & Settings</span>
                  </Link>
                  <Link
                    to="/documents"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-pastel-dark hover:bg-pastel-cream"
                  >
                    <BookMarked size={15} className="text-purple-600" />
                    <span>Uploaded PDFs</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowFormulaModal(true);
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-pastel-dark hover:bg-pastel-cream md:hidden"
                  >
                    <Calculator size={15} className="text-amber-600" />
                    <span>Quick Formula Sheet</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowRubricModal(true);
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-pastel-dark hover:bg-pastel-cream sm:hidden"
                  >
                    <Award size={15} className="text-emerald-600" />
                    <span>AI Capstone Rubric</span>
                  </button>
                </div>

                <div className="border-t border-pastel-border/60 pt-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
      />

      {/* Formula Sheet Modal */}
      <FormulaSheetModal
        isOpen={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
      />

      {/* Capstone 100M Guidelines Modal */}
      <CapstoneRubricModal
        isOpen={showRubricModal}
        onClose={() => setShowRubricModal(false)}
      />
    </>
  );
};
