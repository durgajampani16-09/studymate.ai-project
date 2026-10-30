import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { LogoutPage } from './pages/LogoutPage';
import { DashboardPage } from './pages/DashboardPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ChatPage } from './pages/ChatPage';
import { SummariesPage } from './pages/SummariesPage';
import { ImportantQuestionsPage } from './pages/ImportantQuestionsPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { QuizResultsPage } from './pages/QuizResultsPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { StudyHistoryPage } from './pages/StudyHistoryPage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Logout Confirmation Screen */}
          <Route path="/logout" element={<LogoutPage />} />

          {/* Protected Student Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/summaries" element={<SummariesPage />} />
            <Route path="/important-questions" element={<ImportantQuestionsPage />} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/quiz-results" element={<QuizResultsPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="/study-history" element={<StudyHistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback & Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
