export type Character = {
  id: string;
  name: string;
  period: string;
  books: string[];
  themes: string[];
  tone: string;
  mentorFrame: string;
  imagePath: string;
};

export type ChatRequest = {
  characterId: string;
  message: string;
};

export type ChatResponse = {
  answer: string;
};

export type StudyTrailStep = {
  id: string;
  title: string;
  period: string;
  mentorId: string;
  summary: string;
  readings: string[];
};
