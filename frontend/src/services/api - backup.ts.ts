import {
  AuthResponse,
  Student,
  DocumentItem,
  SummaryItem,
  ImportantQuestionItem,
  QuizItem,
  QuizAttemptResult,
  FlashcardItem,
  StudyActivity,
  DashboardStats,
  ChatMessage,
  CitationSource
} from '../types';
import {
  INITIAL_DOCUMENTS,
  INITIAL_SUMMARIES,
  INITIAL_QUESTIONS,
  INITIAL_QUIZZES,
  INITIAL_QUIZ_RESULTS,
  INITIAL_FLASHCARDS,
  INITIAL_STUDY_ACTIVITIES,
  SAMPLE_CHAT_RESPONSES
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Local storage keys for standalone demo mode
const LS_DOCS = 'studymate_mock_docs';
const LS_SUMMARIES = 'studymate_mock_summaries';
const LS_QUESTIONS = 'studymate_mock_questions';
const LS_QUIZZES = 'studymate_mock_quizzes';
const LS_FLASHCARDS = 'studymate_mock_flashcards';
const LS_ACTIVITIES = 'studymate_mock_activities';
const LS_QUIZ_RESULTS = 'studymate_mock_quiz_results';

class ApiClient {
  public isOfflineMode: boolean = false;

  private getStorageItem<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(stored);
    } catch {
      return defaultValue;
    }
  }

  private setStorageItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  private getHeaders(isFormData = false): HeadersInit {
    const token = localStorage.getItem('studymate_token');
    const headers: HeadersInit = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isFormData = options.body instanceof FormData;
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout for quick fallback

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.getHeaders(isFormData),
          ...(options.headers || {}),
        },
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        if (!endpoint.startsWith('/auth/login') && !endpoint.startsWith('/auth/register')) {
          localStorage.removeItem('studymate_token');
          localStorage.removeItem('studymate_user');
          window.dispatchEvent(new Event('studymate-auth-expired'));
        }
      }

      if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || response.statusText;
        } catch {
          errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
      }

      this.isOfflineMode = false;
      window.dispatchEvent(new CustomEvent('studymate-backend-status', { detail: { online: true } }));
      return await response.json();
    } catch (err: any) {
      // Backend unreachable or timeout -> Fallback to intelligent local simulation
      console.info(`[StudyMate AI] Backend offline or unreachable at ${url}. Serving via interactive demo simulation.`);
      this.isOfflineMode = true;
      window.dispatchEvent(new CustomEvent('studymate-backend-status', { detail: { online: false } }));
      return this.handleMockFallback<T>(endpoint, options);
    }
  }

  // Fallback simulator for complete frontend independence
  private handleMockFallback<T>(endpoint: string, options: RequestInit = {}): T {
    const method = options.method || 'GET';
    let bodyData: any = null;
    if (options.body && typeof options.body === 'string') {
      try {
        bodyData = JSON.parse(options.body);
      } catch {
        bodyData = {};
      }
    }

    // 1. Auth routes
    if (endpoint === '/auth/login' && method === 'POST') {
      const studentId = bodyData?.student_id || 'STU-2026-001';
      const mockUser: Student = {
        id: 'usr-' + Date.now(),
        student_id: studentId,
        name: studentId === 'STU-2026-001' ? 'Durga Student' : 'Student Scholar',
        email: `${studentId.toLowerCase()}@university.edu`,
        department: 'Computer Science & AI',
        year_of_study: '3rd Year B.Tech',
        created_at: new Date().toISOString(),
      };
      const res: AuthResponse = {
        access_token: 'mock-jwt-token-' + Date.now(),
        token_type: 'bearer',
        user: mockUser,
      };
      return res as unknown as T;
    }

    if (endpoint === '/auth/register' && method === 'POST') {
      const mockUser: Student = {
        id: 'usr-' + Date.now(),
        student_id: bodyData?.student_id || 'STU-NEW',
        name: bodyData?.name || 'New Student',
        email: bodyData?.email || 'student@university.edu',
        department: bodyData?.department || 'Computer Science & AI',
        year_of_study: bodyData?.year_of_study || '3rd Year',
        created_at: new Date().toISOString(),
      };
      return {
        access_token: 'mock-jwt-token-' + Date.now(),
        token_type: 'bearer',
        user: mockUser,
      } as unknown as T;
    }

    if (endpoint === '/auth/me') {
      const saved = localStorage.getItem('studymate_user');
      if (saved) return JSON.parse(saved) as T;
      return {
        id: 'usr-default',
        student_id: 'STU-2026-001',
        name: 'Durga Student',
        email: 'durga@student.university.edu',
        department: 'Computer Science & AI',
        year_of_study: '3rd Year B.Tech',
        created_at: new Date().toISOString(),
      } as unknown as T;
    }

    if (endpoint === '/auth/logout') {
      return { message: 'Logged out successfully' } as unknown as T;
    }

    // 2. Documents
    if (endpoint === '/documents' && method === 'GET') {
      return this.getStorageItem<DocumentItem[]>(LS_DOCS, INITIAL_DOCUMENTS) as unknown as T;
    }

    if (endpoint === '/documents/upload' && method === 'POST') {
      const docs = this.getStorageItem<DocumentItem[]>(LS_DOCS, INITIAL_DOCUMENTS);
      let title = 'Uploaded Textbook';
      let subject = 'Engineering & AI';
      let chapter = 'Module 1';
      let filename = 'document.pdf';

      if (options.body instanceof FormData) {
        title = (options.body.get('title') as string) || title;
        subject = (options.body.get('subject') as string) || subject;
        chapter = (options.body.get('chapter') as string) || chapter;
        const file = options.body.get('file') as File;
        if (file) filename = file.name;
      }

      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        user_id: 'STU-2026-001',
        title,
        subject,
        chapter,
        filename,
        file_size: 1540200,
        page_count: Math.floor(Math.random() * 8) + 4,
        processing_status: 'ready',
        created_at: new Date().toISOString(),
      };
      docs.unshift(newDoc);
      this.setStorageItem(LS_DOCS, docs);

      this.recordActivity('upload', 'Uploaded Textbook', `Processed "${title}" (${newDoc.page_count} pages)`);
      return newDoc as unknown as T;
    }

    if (endpoint.startsWith('/documents/') && method === 'DELETE') {
      const docId = endpoint.replace('/documents/', '');
      let docs = this.getStorageItem<DocumentItem[]>(LS_DOCS, INITIAL_DOCUMENTS);
      docs = docs.filter((d) => d.id !== docId);
      this.setStorageItem(LS_DOCS, docs);
      return { message: 'Document deleted' } as unknown as T;
    }

    // 3. Summaries
    if (endpoint === '/summaries' && method === 'GET') {
      return this.getStorageItem<SummaryItem[]>(LS_SUMMARIES, INITIAL_SUMMARIES) as unknown as T;
    }

    if (endpoint === '/summaries/generate' && method === 'POST') {
      const summaries = this.getStorageItem<SummaryItem[]>(LS_SUMMARIES, INITIAL_SUMMARIES);
      const docs = this.getStorageItem<DocumentItem[]>(LS_DOCS, INITIAL_DOCUMENTS);
      const doc = docs.find((d) => d.id === bodyData?.document_id) || docs[0];

      const newSummary: SummaryItem = {
        id: `sum-${Date.now()}`,
        document_id: doc.id,
        document_title: doc.title,
        chapter: doc.chapter,
        subject: doc.subject,
        short_summary: `Synthesized key concepts, tree invariants, algorithmic traversal orders, and rotation procedures directly extracted from ${doc.title}.`,
        detailed_summary: `The uploaded document focuses on foundational principles in ${doc.subject}. Key mechanisms include structured recursive traversals (Inorder, Preorder, Postorder) guaranteeing systematic state exploration, balanced search trees enforcing strict balance factors, and step-by-step rebalancing via single and double rotations. This summary was synthesized via chunk-wise extraction of core definitions, formulas, and examination topics.`,
        main_points: [
          'Hierarchical representation enables recursive problem breakdown.',
          'Inorder traversal evaluates left child, current root, and right child in sequence.',
          'Worst-case search time is bounded by tree height h: O(h).',
          'AVL balancing guarantees O(log N) operations by keeping balance factor in {-1, 0, +1}.'
        ],
        important_definitions: [
          { term: 'Balance Factor', definition: 'Height of Left Subtree minus Height of Right Subtree.' },
          { term: 'Traversal', definition: 'Visiting every node in a tree structure exactly once.' }
        ],
        key_concepts: ['Recursive Data Structures', 'AVL Rebalancing', 'Traversals'],
        formulas: [
          { title: 'Tree Edges', formula: 'E = N - 1', explanation: 'Edges in a tree with N vertices.' },
          { title: 'Max Nodes', formula: '2^(h+1) - 1', explanation: 'Max nodes at height h.' }
        ],
        revision_notes: [
          'Review LL and RR single rotations vs LR and RL double rotations.',
          'Remember: Inorder of a BST is always sorted in ascending order.'
        ],
        source_pages: [1, 2, 4],
        created_at: new Date().toISOString(),
      };

      summaries.unshift(newSummary);
      this.setStorageItem(LS_SUMMARIES, summaries);
      this.recordActivity('summary', 'Generated Summary', `Synthesized notes for ${doc.chapter}`);
      return newSummary as unknown as T;
    }

    // 4. Important Questions
    if (endpoint === '/important-questions' && method === 'GET') {
      return this.getStorageItem<ImportantQuestionItem[]>(LS_QUESTIONS, INITIAL_QUESTIONS) as unknown as T;
    }

    if (endpoint === '/important-questions/generate' && method === 'POST') {
      const questions = this.getStorageItem<ImportantQuestionItem[]>(LS_QUESTIONS, INITIAL_QUESTIONS);
      const marks = bodyData?.question_type === '2-mark' ? 2 : bodyData?.question_type === '10-mark' ? 10 : 5;

      const newQ: ImportantQuestionItem = {
        id: `q-${Date.now()}`,
        document_id: bodyData?.document_id || 'doc-ds-trees',
        document_title: 'Data Structures — Trees, Traversals & AVL Rotations',
        chapter: 'Unit 2: Trees',
        subject: 'Data Structures',
        question_type: bodyData?.question_type || '5-mark',
        difficulty: bodyData?.difficulty || 'Medium',
        marks,
        question: `Explain how the balance factor is calculated in an AVL tree and show how an LR (Left-Right) double rotation restores balance.`,
        answer: `Balance Factor = Height(Left Subtree) - Height(Right Subtree). An LR imbalance occurs when a key is inserted into the right subtree of the left child. Resolution requires two steps: (1) Single Left Rotation on the left child, (2) Single Right Rotation on the unbalanced ancestor node.`,
        hint: 'Two rotations are combined: left on child, right on root.',
        source_pages: [4, 5],
        is_bookmarked: false,
        created_at: new Date().toISOString(),
      };

      questions.unshift(newQ);
      this.setStorageItem(LS_QUESTIONS, questions);
      return [newQ] as unknown as T;
    }

    if (endpoint.includes('/toggle-bookmark') && method === 'POST') {
      const qId = endpoint.split('/')[2];
      const questions = this.getStorageItem<ImportantQuestionItem[]>(LS_QUESTIONS, INITIAL_QUESTIONS);
      const q = questions.find((item) => item.id === qId);
      if (q) {
        q.is_bookmarked = !q.is_bookmarked;
        this.setStorageItem(LS_QUESTIONS, questions);
        return q as unknown as T;
      }
    }

    // 5. Quizzes
    if (endpoint === '/quizzes/generate' && method === 'POST') {
      const quiz = INITIAL_QUIZZES[0];
      return quiz as unknown as T;
    }

    if (endpoint.includes('/submit') && method === 'POST') {
      const userAnswers: Record<string, string> = bodyData?.answers || {};
      const timeSpent: number = bodyData?.time_spent_seconds || 65;

      const quiz = INITIAL_QUIZZES[0];
      let correct = 0;
      quiz.questions.forEach((q) => {
        if (userAnswers[q.id] === q.correct_answer) {
          correct += 1;
        }
      });

      const questions_review = quiz.questions.map((q) => {
        const studentAns = userAnswers[q.id] || '';
        const isCorrect = studentAns === q.correct_answer;
        return {
          question_id: q.id,
          question: q.question,
          options: q.options,
          student_answer: studentAns,
          correct_answer: q.correct_answer,
          is_correct: isCorrect,
          marks_awarded: isCorrect ? q.marks : 0,
          max_marks: q.marks,
          explanation: q.explanation,
          source_page: q.source_page,
        };
      });

      const marksObtained = questions_review.reduce((sum, r) => sum + r.marks_awarded, 0);
      const totalMarks = quiz.total_marks;
      const percentage = Math.round((marksObtained / totalMarks) * 100);

      const result: QuizAttemptResult = {
        id: `att-${Date.now()}`,
        quiz_id: quiz.id,
        quiz_title: quiz.title,
        subject: quiz.subject,
        chapter: quiz.chapter,
        marks_obtained: marksObtained,
        total_marks: totalMarks,
        percentage,
        correct_count: correct,
        incorrect_count: quiz.questions.length - correct,
        time_spent_seconds: timeSpent,
        created_at: new Date().toISOString(),
        questions_review,
        revision_suggestions: [
          'Review Unit 2 Lecture Notes on AVL Double Rotations (Page 4-5).',
          'Practice calculating Balance Factors for multi-level unbalanced subtrees.',
          'Verify Inorder traversal patterns for sorted key generation.'
        ],
      };

      const pastResults = this.getStorageItem<QuizAttemptResult[]>(LS_QUIZ_RESULTS, INITIAL_QUIZ_RESULTS);
      pastResults.unshift(result);
      this.setStorageItem(LS_QUIZ_RESULTS, pastResults);

      this.recordActivity('quiz', 'Completed Practice Quiz', `Scored ${marksObtained}/${totalMarks} (${percentage}%) in ${quiz.title}`);
      return result as unknown as T;
    }

    if (endpoint === '/quizzes/results/latest' || endpoint === '/quizzes/results' || endpoint === '/quizzes/attempts/recent') {
      const pastResults = this.getStorageItem<QuizAttemptResult[]>(LS_QUIZ_RESULTS, INITIAL_QUIZ_RESULTS);
      if (endpoint === '/quizzes/results/latest' && pastResults.length > 0) return pastResults[0] as unknown as T;
      return pastResults as unknown as T;
    }

    // 6. Flashcards
    if (endpoint === '/flashcards' && method === 'GET') {
      return this.getStorageItem<FlashcardItem[]>(LS_FLASHCARDS, INITIAL_FLASHCARDS) as unknown as T;
    }

    if (endpoint === '/flashcards/generate' && method === 'POST') {
      const cards = this.getStorageItem<FlashcardItem[]>(LS_FLASHCARDS, INITIAL_FLASHCARDS);
      return cards as unknown as T;
    }

    if (endpoint.startsWith('/flashcards/') && endpoint.endsWith('/status')) {
      const parts = endpoint.split('/');
      const cardId = parts[2];
      const newStatus = bodyData?.status || 'known';
      const cards = this.getStorageItem<FlashcardItem[]>(LS_FLASHCARDS, INITIAL_FLASHCARDS);
      const c = cards.find((item) => item.id === cardId);
      if (c) {
        c.status = newStatus;
        this.setStorageItem(LS_FLASHCARDS, cards);
      }
      return { message: 'Status updated' } as unknown as T;
    }

    // 7. Chat (RAG)
    if (endpoint === '/chat/query' && method === 'POST') {
      const q = (bodyData?.question || '').toLowerCase();
      let answer = SAMPLE_CHAT_RESPONSES.default.answer;
      let sources = SAMPLE_CHAT_RESPONSES.default.sources;

      if (q.includes('rag') || q.includes('retrieval') || q.includes('hallucination')) {
        answer =
          '**Retrieval-Augmented Generation (RAG)** is an AI architecture that mitigates large language model hallucinations by anchoring responses in textbook documents.\n\n### RAG Workflow in StudyMate AI:\n1. **Document Parsing**: PyMuPDF extracts text, headings, and formulas page-by-page from syllabus PDFs.\n2. **Vector Embeddings**: High-dimensional semantic vectors are calculated for each chunk.\n3. **Cosine Similarity Matching**: Student queries are vectorized to retrieve top-*k* textbook passages.\n4. **Grounded Synthesis**: Context chunks and page references are passed to the generator to synthesize accurate, cited answers.';
        sources = [
          {
            document_id: 'doc-ai-search',
            document_title: 'Artificial Intelligence — Search Algorithms & RAG Architecture',
            page_number: 7,
            excerpt:
              'Retrieval-Augmented Generation (RAG): Combines dense vector retrieval with LLMs. Queries retrieve top-k document chunks via Cosine Similarity, injecting verified textbook text to eliminate hallucinations.',
          },
          {
            document_id: 'doc-ai-search',
            document_title: 'Artificial Intelligence — Search Algorithms & RAG Architecture',
            page_number: 3,
            excerpt:
              'Important: Simply creating a prompt and obtaining output from an online tool is insufficient. Students must explain the AI concept, inputs, chunking, and evaluation.',
          },
        ];
      } else if (q.includes('traversal') || q.includes('inorder') || q.includes('preorder')) {
        answer =
          'Tree traversal systematically visits every node in a hierarchical structure:\n\n1. **Inorder (Left -> Root -> Right)**: When applied to a Binary Search Tree (BST), Inorder traversal yields keys in **ascending sorted order**.\n2. **Preorder (Root -> Left -> Right)**: Useful for prefix expressions and creating a clone of the tree.\n3. **Postorder (Left -> Right -> Root)**: Ideal for freeing allocated memory or evaluating postfix mathematical expressions.';
        sources = [
          {
            document_id: 'doc-ds-trees',
            document_title: 'Data Structures — Trees, Traversals & AVL Rotations',
            page_number: 2,
            excerpt:
              'Binary Tree Traversals: Process of visiting all nodes at least once. 1. Inorder (Left Root Right) 2. Preorder (Root Left Right) 3. Postorder (Left Right Root).',
          },
        ];
      }

      this.recordActivity('chat', 'AI Study Tutor Query', `Asked: "${bodyData?.question?.slice(0, 45)}..."`);

      return {
        conversation_id: 'conv-' + Date.now(),
        answer,
        sources,
      } as unknown as T;
    }

    // 8. Dashboard stats
    if (endpoint === '/dashboard/stats') {
      const docs = this.getStorageItem<DocumentItem[]>(LS_DOCS, INITIAL_DOCUMENTS);
      const questions = this.getStorageItem<ImportantQuestionItem[]>(LS_QUESTIONS, INITIAL_QUESTIONS);
      const cards = this.getStorageItem<FlashcardItem[]>(LS_FLASHCARDS, INITIAL_FLASHCARDS);
      const activities = this.getStorageItem<StudyActivity[]>(LS_ACTIVITIES, INITIAL_STUDY_ACTIVITIES);
      const results = this.getStorageItem<QuizAttemptResult[]>(LS_QUIZ_RESULTS, INITIAL_QUIZ_RESULTS);

      const knownCount = cards.filter((c) => c.status === 'known').length;
      const avgScore = results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length) : 80;

      const stats: DashboardStats = {
        total_documents: docs.length,
        subjects_count: 2,
        chapters_count: 4,
        important_questions_count: questions.length,
        quizzes_completed: results.length,
        total_quiz_attempts: results.length,
        average_quiz_score: avgScore,
        flashcards_known: knownCount,
        flashcards_total: cards.length,
        recent_activities: activities.slice(0, 6),
        recent_quiz_results: results.slice(0, 3),
      };
      return stats as unknown as T;
    }

    // 9. Study History
    if (endpoint === '/study-history' || endpoint === '/activities') {
      const activities = this.getStorageItem<StudyActivity[]>(LS_ACTIVITIES, INITIAL_STUDY_ACTIVITIES);
      return activities as unknown as T;
    }

    return {} as unknown as T;
  }

  private recordActivity(
    activity_type: 'upload' | 'chat' | 'summary' | 'important_questions' | 'quiz' | 'flashcard',
    title: string,
    description: string,
    subject?: string
  ) {
    try {
      const activities = this.getStorageItem<StudyActivity[]>(LS_ACTIVITIES, INITIAL_STUDY_ACTIVITIES);
      const newAct: StudyActivity = {
        id: `act-${Date.now()}`,
        activity_type,
        title,
        description,
        subject,
        created_at: new Date().toISOString(),
      };
      activities.unshift(newAct);
      this.setStorageItem(LS_ACTIVITIES, activities);
    } catch (e) {
      console.warn('Activity recording failed', e);
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: any): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
    });
  }

  put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
