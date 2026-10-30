import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-pastel-cream">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pastel-lavender-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-pastel-dark">Preparing your study dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get current page title for the navbar
  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return { title: 'Study Dashboard', subtitle: 'Overview of your academic progress' };
    if (path.includes('/documents')) return { title: 'Study Materials & PDFs', subtitle: 'Upload and organize syllabus books & chapters' };
    if (path.includes('/chat')) return { title: 'RAG Conversational Tutor', subtitle: 'Ask questions grounded directly in your textbooks' };
    if (path.includes('/summaries')) return { title: 'Chapter Summaries', subtitle: 'Key points, formulas, definitions, and quick revision' };
    if (path.includes('/important-questions')) return { title: 'Important Exam Questions', subtitle: 'Marks-wise practice questions with citation hints' };
    if (path.includes('/quizzes') && !path.includes('/quiz-results')) return { title: 'Interactive Quizzes', subtitle: 'Self-assessments generated from uploaded topics' };
    if (path.includes('/quiz-results')) return { title: 'Quiz Performance & Review', subtitle: 'Score breakdown and AI revision suggestions' };
    if (path.includes('/flashcards')) return { title: 'Spaced Flashcards', subtitle: 'Active recall for formulas and key concepts' };
    if (path.includes('/study-history')) return { title: 'Study History & Audit', subtitle: 'Timeline of your documents, quizzes, and queries' };
    if (path.includes('/profile')) return { title: 'Student Profile', subtitle: 'Personal credentials and study preferences' };
    return { title: 'StudyMate AI', subtitle: 'Intelligent Study Assistant' };
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-pastel-cream flex flex-col font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-pastel-dark/30 backdrop-blur-sm">
          <div className="w-64 h-full bg-white shadow-pastel-hover relative animate-slideRight">
            <Sidebar
              isCollapsed={false}
              setIsCollapsed={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <Navbar
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
