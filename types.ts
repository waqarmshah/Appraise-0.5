export enum AppMode {
  GP = 'GP',
  HOSPITAL = 'HOSPITAL'
}

export interface AppraisalOutput {
  summary: string;
  capabilities: string;
  reflection: string;
  learningGoals: string;
}

export interface KeywordMapping {
  keywords: string[];
  capabilities: string[]; // Maps to capability names
}

export interface AppraisalRequest {
  mode: AppMode;
  note: string;
  isAuto: boolean;
  selectedCapabilities: string[];
}

export interface KeywordScore {
  capability: string;
  score: number;
}
