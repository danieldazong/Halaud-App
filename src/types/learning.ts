// Shared types for the hardcoded language-learning content system.
// Data lives in data/languages.ts, data/units.ts, data/lessons.ts.

export type LanguageCode = "es" | "fr" | "ja";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flagEmoji: string;
}

export interface Unit {
  id: string;
  languageCode: LanguageCode;
  order: number;
  title: string;
  description: string;
  lessonIds: string[];
}

export type ActivityType =
  | "vocab-intro"
  | "multiple-choice"
  | "listen-and-match"
  | "speak-and-repeat";

export interface VocabItem {
  term: string;
  translation: string;
  audioPromptText: string;
}

export interface Phrase {
  text: string;
  translation: string;
  audioPromptText: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  prompt: string;
  vocab?: VocabItem;
  phrase?: Phrase;
  options?: string[];
  correctAnswer?: string;
}

export interface AITeacherPrompt {
  systemPrompt: string;
  openingLine: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  order: number;
  title: string;
  goal: string;
  vocab: VocabItem[];
  phrases: Phrase[];
  activities: Activity[];
  aiTeacherPrompt: AITeacherPrompt;
}
