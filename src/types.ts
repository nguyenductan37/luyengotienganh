export type LessonLevel = 'basic' | 'intermediate' | 'advanced';

export type LessonCategory = 
  | 'home_row' 
  | 'all_rows' 
  | 'tech' 
  | 'business' 
  | 'medical' 
  | 'sentences' 
  | 'custom';

export interface WordItem {
  id: string;
  word: string;         // The exact English word/phrase to type
  ipa?: string;          // International Phonetic Alphabet (e.g. /dɪˈvel.ə.pər/)
  meaning: string;      // Vietnamese translation
  partOfSpeech?: string; // e.g. noun, verb, adj
  example?: string;     // Short illustrative sentence or context
  exampleMeaning?: string; // Meaning of the example
}

export interface Lesson {
  id: string;
  name: string;
  category: LessonCategory;
  level: LessonLevel;
  description: string;
  items: WordItem[];    // Words/phrases contained in this lesson
  displayText: string;  // Flattened string constructed from items space-separated for typing
}

export interface PracticeSessionResult {
  id: string;
  lessonId: string;
  lessonName: string;
  category: LessonCategory;
  wpm: number;
  accuracy: number;
  errors: number;
  timeSpent: number; // in seconds
  timestamp: string; // ISO date
}

export interface FingerMap {
  [key: string]: {
    hand: 'left' | 'right';
    finger: 'pinky' | 'ring' | 'middle' | 'index' | 'thumb';
    color: string;
    label: string;
  };
}
