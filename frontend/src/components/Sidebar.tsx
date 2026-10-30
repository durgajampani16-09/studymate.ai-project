import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BookOpen,
  Sparkles,
  HelpCircle,
  Award,
  Layers,
  History,
  User,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/documents', label: 'PDF Documents', icon: FileText },
    { to: '/chat', label: 'AI Study Chat (RAG)', icon: MessageSquare },
    { to: '/summaries', label: 'Chapter Summaries', icon: BookOpen },
    { to: '/important-questions', label: 'Exam Questions', icon: HelpCircle },
    { to: '/quizzes', label: 'Quizzes & Practice', icon: Sparkles },
    { to: '/quiz-results', label: 'Quiz Results', icon: Award },
    { to: '/flashcards', label: 'Flashcards', icon: Layers },
    { to: '/study-history', label: 'Study History', icon: History },
    { to: '/profile', label: 'Student Profile', icon: User },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-pastel-border/60 transition-all duration-300 z-30 flex flex-col justify-between shadow-pastel ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-pastel-border/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pastel-lavender to-pastel-blue flex items-center justify-center text-pastel-dark shadow-sm shrink-0">
              <GraduationCap className="w-6 h-6 text-indigo-700" />
            </div>
            {!isCollapsed && (
              <div className="leading-tight truncate">
                <span className="font-extrabold text-base tracking-tight text-pastel-dark flex items-center gap-1.5">
                  StudyMate <span className="text-xs px-1.5 py-0.5 rounded-full bg-pastel-mint text-emerald-800 font-semibold">AI</span>
                </span>
                <span className="text-[11px] text-pastel-muted block truncate font-medium">
                  RAG Study Assistant
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl hover:bg-pastel-cream text-pastel-muted hover:text-pastel-dark transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3 py-2.5 rounded-2xl font-medium text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-pastel-lavender text-indigo-900 shadow-sm font-semibold'
                      : 'text-pastel-muted hover:bg-pastel-cream hover:text-pastel-dark'
                  }`
                }
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Mini Academic Tag */}
      {!isCollapsed && (
        <div className="p-3 m-3 rounded-2xl bg-pastel-blue/40 border border-pastel-blue-dark/20 text-xs text-pastel-dark">
          <p className="font-semibold text-slate-700">AI Mini-Capstone Project</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Retrieval-Augmented Generation</p>
        </div>
      )}
    </aside>
  );
};
