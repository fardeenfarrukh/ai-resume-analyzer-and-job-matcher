export interface Suggestion {
  title: string;
  description: string;
}

export interface AnalysisResult {
  jobTitle: string;
  matchScore: number;
  summary: string;
  matchingKeywords: string[];
  missingKeywords: string[];
  suggestions: Suggestion[];
  originalResumeText: string;
  improvedResumeText: string;
}

export interface UploadedFile {
  name: string;
  mimeType: string;
  data: string; // base64 encoded string
}

export interface User {
  id: string; // This will be the Firebase UID
  email: string | null;
  isAdmin?: boolean;
}

export interface SavedReport extends AnalysisResult {
  id: string; // Firestore document ID
  userId: string;
  savedAt: string; // ISO string from Firestore timestamp
}