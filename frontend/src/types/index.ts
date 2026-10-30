export interface Student {
  id: string;
  student_id: string;
  name: string;
  email: string;
  department?: string;
  year_of_study?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: Student;
}

export interface DocumentItem {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  chapter: string;
  filename: string;
  file_size: number;
  page_count: number;
  processing_status: 'processing' | 'ready' | 'error';
  error_message?: string;
  created_at: string;
}

export interface CitationSource {
  document_id: string;
  document_title: string;
  page_number: number;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: CitationSource[];
  created_at: string;
}

export interface DefinitionItem {
  term: string;
  definition: string;
}

export interface FormulaItem {
  title: string;
  formula: string;
  explanation: string;
}

export interface SummaryItem {
  id: string;
  document_id: string;
  document_title: string;
  chapter: string;
  subject?: string;
  short_summary: string;
  detailed_summary: string;
  main_points: string[];
  important_definitions: DefinitionItem[];
  key_concepts: string[];
  formulas: FormulaItem[];
  revision_notes: string[];
  source_pages: number[];
  created_at: string;
}

export type QuestionType =
  | '2-mark'
  | '5-mark'
  | '10-mark'
  | 'mcq'
  | 'short-answer'
  | 'long-answer'
  | 'definition'
  | 'fill-blank'
  | 'true-false';

export interface ImportantQuestionItem {
  id: string;
  document_id: string;
  document_title: string;
  chapter: string;
  subject: string;
  question_type: QuestionType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  question: string;
  answer: string;
  hint?: string;
  source_pages: number[];
  is_bookmarked: boolean;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  marks: number;
  question_type: 'mcq' | 'short-answer' | 'true-false';
  source_page?: number;
}

export interface QuizItem {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  total_questions: number;
  total_marks: number;
  time_limit_minutes?: number;
  questions: QuizQuestion[];
  created_at: string;
}

export interface QuestionReview {
  question_id: string;
  question: string;
  options?: string[];
  student_answer: string;
  correct_answer: string;
  is_correct: boolean;
  marks_awarded: number;
  max_marks: number;
  explanation: string;
  source_page?: number;
}

export interface QuizAttemptResult {
  id: string;
  quiz_id: string;
  quiz_title: string;
  subject: string;
  chapter: string;
  marks_obtained: number;
  total_marks: number;
  percentage: number;
  correct_count: number;
  incorrect_count: number;
  time_spent_seconds: number;
  created_at: string;
  questions_review: QuestionReview[];
  revision_suggestions: string[];
}

export interface FlashcardItem {
  id: string;
  document_id?: string;
  subject: string;
  chapter: string;
  front: string;
  back: string;
  status: 'unstudied' | 'known' | 'needs_revision';
  created_at: string;
}

export interface StudyActivity {
  id: string;
  activity_type: 'upload' | 'chat' | 'summary' | 'important_questions' | 'quiz' | 'flashcard';
  title: string;
  description: string;
  subject?: string;
  meta?: Record<string, any>;
  created_at: string;
}

export interface DashboardStats {
  total_documents: number;
  subjects_count: number;
  chapters_count: number;
  important_questions_count: number;
  quizzes_completed: number;
  total_quiz_attempts: number;
  average_quiz_score: number;
  flashcards_known: number;
  flashcards_total: number;
  recent_activities: StudyActivity[];
  recent_quiz_results: QuizAttemptResult[];
}
