# StudyMate AI 🎓 — Intelligent RAG-Grounded Study Assistant

> **AI Mini-Capstone Project (25CS301)**  
> Built with React 18, TypeScript, Tailwind CSS, Vite, and an Intelligent Retrieval-Augmented Generation (RAG) Architecture.

---

## 📖 Project Overview

**StudyMate AI** is an intelligent academic study assistant designed to eliminate hallucinations common in generic Large Language Models by grounding all responses directly in syllabus textbooks, lecture notes, and course modules.

### Key Capabilities
- **📚 PDF Document Ingestion**: Upload textbook chapters and notes (e.g., *Data Structures — Trees, Traversals & AVL Rotations* and *Artificial Intelligence — Search Algorithms*).
- **💬 RAG Conversational Tutor**: Ask questions and receive structured explanations with **direct textbook page citations** and exact excerpts.
- **📝 High-Yield Chapter Summaries**: Generate core summaries, main points, critical definitions, mathematical formulas, and quick revision notes with **Audio Read-Aloud (Text-to-Speech)**.
- **🎯 Important Exam Questions Bank**: Marks-wise practice questions (**2-Mark**, **5-Mark**, **10-Mark**, and **MCQs**) with model answers, citation hints, and print-ready exam sheet export.
- **⚡ Interactive Quizzes & Assessment**: Timed practice tests with automatic scoring, question-by-question review, source verification, and topic-specific improvement recommendations.
- **🗂️ Spaced Repetition Flashcards**: 3D animated flip cards tracking mastery status (*Known* vs. *Needs Revision*).
- **🗺️ Interactive Concept Knowledge Map**: Hierarchical visual tree mapping syllabus topics to algorithms, formulas, and examination marks.
- **📐 Quick Formula & Exam Reference Sheet**: Instant search and copy for tree invariants, AVL balance factors, and search formulas.
- **🏆 Capstone Evaluation Rubric (100 Marks)**: Directly built-in modal detailing marks breakdown and viva readiness.

---

## 🚀 How to Run the Application

### Option A: One-Click Runner (Windows)
Double-click `run-frontend.bat` in the project root folder.

### Option B: Terminal Command

1. Open PowerShell or Command Prompt.
2. Navigate to the `frontend` folder:
   ```powershell
   cd c:\Ammu\studymate.ai\frontend
   ```
3. Run the development server:
   ```powershell
   npm.cmd run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔑 Demo Login Credentials

The application is equipped with an **Interactive Demo Simulation Mode** that automatically provides pre-loaded course materials (*Data Structures — Trees & AVL Rotations* and *AI Search Algorithms*) even when the Python backend is not running.

- **Student ID**: `STU-2026-001` (or click *"Fill Demo Credentials"*)
- **Password**: `Pass@1234`
- You can also click **Register** to create any custom student account.

---

## 🏗️ Project Architecture & File Structure

```
studymate.ai/
├── run-frontend.bat             # One-click Windows development server launcher
├── package.json                 # Root script runner delegating to frontend
├── README.md                    # Project manual and architectural guide
└── frontend/
    ├── index.html               # Main HTML entry with Plus Jakarta Sans typography
    ├── package.json             # React 18, TypeScript, Lucide, Tailwind dependencies
    ├── tailwind.config.js       # Pastel design system color palette
    ├── tsconfig.json            # Strict TypeScript configuration
    ├── vite.config.ts           # Vite bundler configuration
    └── src/
        ├── App.tsx              # Router setup with public and protected layouts
        ├── main.tsx             # React DOM root entry
        ├── index.css            # Custom pastel scrollbars and 3D card perspective
        ├── vite-env.d.ts        # Vite client type definitions
        ├── context/
        │   └── AuthContext.tsx  # Student auth state, tokens, and localStorage sync
        ├── services/
        │   ├── api.ts           # Smart hybrid API client (Live Backend + Demo Simulation)
        │   └── mockData.ts      # Syllabus datasets for Trees, AVL, and AI Search
        ├── utils/
        │   └── speech.ts        # Browser Text-to-Speech audio revision assistant
        ├── types/
        │   └── index.ts         # Complete TypeScript interfaces for all data models
        ├── layouts/
        │   ├── AuthLayout.tsx   # Login/Register showcase layout
        │   └── DashboardLayout.tsx # Collapsible sidebar, dynamic header, responsive drawer
        ├── components/
        │   ├── Sidebar.tsx      # Multi-page student navigation sidebar
        │   ├── Navbar.tsx       # Search, profile menu, formula sheet, and rubric triggers
        │   ├── ConceptMapView.tsx # Interactive syllabus concept visualizer
        │   ├── FormulaSheetModal.tsx # Quick formula reference drawer
        │   ├── CapstoneRubricModal.tsx # 100M capstone evaluation guide
        │   ├── PdfViewerModal.tsx # Textbook citation inspector
        │   ├── StatCard.tsx     # Dashboard metric card
        │   ├── LogoutModal.tsx  # Sign-out confirmation modal
        │   ├── LoadingSpinner.tsx # Reusable loading state
        │   └── EmptyState.tsx   # Empty state placeholder
        └── pages/
            ├── LoginPage.tsx    # Student ID login & new student registration
            ├── ForgotPasswordPage.tsx # Password recovery
            ├── ResetPasswordPage.tsx  # Reset password workflow
            ├── LogoutPage.tsx   # Logout confirmation screen
            ├── DashboardPage.tsx # Metric cards, knowledge map, quick actions, history
            ├── DocumentsPage.tsx # PDF upload and syllabus tagging
            ├── ChatPage.tsx     # RAG Conversational Tutor with citations & audio
            ├── SummariesPage.tsx # Chapter summaries, definitions, formulas & speech
            ├── ImportantQuestionsPage.tsx # 2, 5, 10-mark exam questions & print sheet
            ├── QuizzesPage.tsx  # Timed interactive quiz assessment
            ├── QuizResultsPage.tsx # Score analysis, topic breakdown & suggestions
            ├── FlashcardsPage.tsx # 3D flip card active recall
            ├── StudyHistoryPage.tsx # Action audit timeline
            └── ProfilePage.tsx  # Student registration and preferences
```

---

## 🎯 Course Curriculum Alignment (25CS301 Mini-Capstone)

| Evaluation Component | Marks | Implementation in StudyMate AI |
| :--- | :---: | :--- |
| **Problem Statement & Motivation** | **15 M** | Addresses student exam preparation fatigue and LLM hallucinations using grounded RAG. |
| **AI Concept / Algorithm Clarity** | **15 M** | PyMuPDF page chunking, vector embeddings, and top-k cosine similarity retrieval. |
| **Implementation / Execution** | **20 M** | Modular React + TypeScript frontend with 10+ student workflows and seamless simulation fallback. |
| **Results & Analysis** | **15 M** | Citations linked to exact pages, quiz grading analytics, and topic mastery percentages. |
| **Technical Competency** | **15 M** | Type-safe interfaces, persistent local storage, audio synthesis, and responsive pastel design. |
| **Innovation & Relevance** | **10 M** | Spaced repetition flashcards, interactive knowledge tree, and audio revision. |
| **Presentation & Communication** | **5 M** | Accessible UI and built-in Capstone Rubric inspection modal. |
| **Documentation & Quality** | **5 M** | Concise documentation, structured code comments, and clear run guides. |
| **Total** | **100 M** | Complete capstone readiness. |
