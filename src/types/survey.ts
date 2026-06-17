// ─── Survey ──────────────────────────────────────────────────────────────────

export interface Survey {
  id: number;
  name: string;
  description: string;
}

// ─── Question ────────────────────────────────────────────────────────────────

export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'single_choice'
  | 'multiple_choice'
  | 'file';

export interface QuestionOption {
  value: string;
  label: string;
}

export interface FileProperties {
  format: string;
  maxFileSize: number;
  maxFileSizeUnit: string;
  multiple: boolean;
}

export interface Question {
  id: number;
  name: string;
  type: QuestionType;
  text: string;
  description?: string;
  required: boolean;
  options?: {
    multiple: boolean;
    option: QuestionOption[];
  };
  fileProperties?: FileProperties;
}

// ─── Responses ───────────────────────────────────────────────────────────────

export type AnswerValue = string | string[] | FileAsset[];

export interface FileAsset {
  uri: string;
  name: string;
  mimeType: string;
  size?: number;
}

export interface SurveyAnswers {
  [questionName: string]: AnswerValue;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface LoginCredentials {
  email: string;
  password: string;
}
