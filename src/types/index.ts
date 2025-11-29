export enum ProficiencyLevel {
  A1 = 'A1 (Beginner)',
  A2 = 'A2 (Elementary)',
  B1 = 'B1 (Intermediate)',
  B2 = 'B2 (Upper Intermediate)',
  C1 = 'C1 (Advanced)',
  C2 = 'C2 (Mastery)',
}

export interface VocabularyItem {
  word: string;
  translation: string;
  type: string;
  contextSentence: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningMaterial {
  title: string;
  frenchText: string;
  englishTranslation: string;
  vocabulary: VocabularyItem[];
  quiz: QuizQuestion[];
}

export enum AppState {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  LEARNING = 'LEARNING',
  ERROR = 'ERROR'
}

export type Tab = 'read' | 'vocab' | 'quiz';