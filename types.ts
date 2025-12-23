
export enum StudentLevel {
  MIDDLE_SCHOOL = 'Middle School',
  HIGH_SCHOOL = 'High School',
  COLLEGE = 'College'
}

export enum AskMode {
  SIMPLE = 'Simple',
  EXAM = 'Exam',
  DEEP = 'Deep'
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  duration: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface NoteDocument {
  id: string;
  name: string;
  content: string;
  type: 'pdf' | 'text' | 'image';
  uploadedAt: string;
}

export interface AIResponse {
  steps: string[];
  explanation: string;
  whyItMatters: string;
  alternativeMethod?: string;
}

export interface AnalyticsData {
  masteryPoints: number;
  studyHours: number;
  tasksCompleted: number;
  subjectProgress: { name: string; value: number; color: string }[];
}
