// Mock data for offline mode – all arrays start empty.
import {
  DocumentItem,
  SummaryItem,
  ImportantQuestionItem,
  QuizItem,
  FlashcardItem,
  StudyActivity,
  QuizAttemptResult,
  DashboardStats,
  ChatMessage,
} from '../types';

export const INITIAL_DOCUMENTS: DocumentItem[] = [];
export const INITIAL_SUMMARIES: SummaryItem[] = [];
export const INITIAL_QUESTIONS: ImportantQuestionItem[] = [];
export const INITIAL_QUIZZES: QuizItem[] = [];
export const INITIAL_QUIZ_RESULTS: QuizAttemptResult[] = [];
export const INITIAL_FLASHCARDS: FlashcardItem[] = [];
export const INITIAL_STUDY_ACTIVITIES: StudyActivity[] = [];

// Default chat response when no relevant data is found.
export const SAMPLE_CHAT_RESPONSES = {
  default: {
    answer: "No information found in the uploaded material.",
    sources: [] as any[],
  },
};
