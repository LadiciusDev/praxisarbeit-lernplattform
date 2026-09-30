import type { SupportedLanguage } from './execution';
export type { SupportedLanguage };

export interface Lesson {
  id: string;
  title: string;
  shortDesc: string;
  language: SupportedLanguage;
  explanation: string;
  initialCode: string;
  tips?: string[];
  expectedOutput?: string;
}

export interface LanguageMeta {
  id: SupportedLanguage;
  name: string;
  version: string;
  color: string;
  accentClass: string;
  borderClass: string;
  bgClass: string;
  description: string;
  lessons: Lesson[];
}
