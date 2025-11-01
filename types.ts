
export interface TranslationMemoryEntry {
  source: string;
  target: string;
}

export interface Project {
  id: string;
  name: string;
  author: string;
  chapters: Chapter[];
  translationMemory: TranslationMemoryEntry[];
}

export interface Chapter {
  id: string;
  name: string;
  sourceText: string;
  translatedText: string;
}

export enum MatchType {
  Exact = 'Exact',
  CaseInsensitive = 'Case-Insensitive',
}

export type Gender = 'Male' | 'Female' | 'Neutral' | 'Không xác định';
export type MatchTypeValue = MatchType | 'Không xác định';

export interface GlossaryTerm {
  id:string;
  input: string;
  translation: string;
  gender: Gender;
  matchType: MatchTypeValue;
}

export interface TranslationSettings {
  aiProvider: 'gemini' | 'openai' | 'deepseek';
  geminiApiKey: string;
  openaiApiKey: string;
  openaiApiEndpoint: string;
  deepseekApiKey: string;
  deepseekApiEndpoint: string;
  glossary: GlossaryTerm[];
  useGlossaryAI: boolean;
  editAI: boolean;
  customInstructions: string;
  glossaryExtractionInstructions: string;
  exclusionList: string;
}