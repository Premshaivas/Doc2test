export type PageId =
  | 'home'
  | 'playground'
  | 'compliance'
  | 'requirements'
  | 'evidence'
  | 'reports'
  | 'about';

export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  dueDate: string; // YYYY-MM-DD
  maxMarks: number;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseCode: string;
  studentName: string;
  submittedAt: string; // YYYY-MM-DD HH:mm
  dueDate: string;
  isLate: boolean;
  status: 'Accepted' | 'Rejected';
  rejectionReason?: string;
}

export interface TraceabilityItem {
  id: string;
  requirement: string;
  category: 'Validation' | 'Functional behavior' | 'Business rule' | 'Error handling' | 'API contract';
  endpoint: string;
  evidence: string;
  status: 'Compliant';
}

export interface TestScenario {
  id: string;
  scenario: string;
  category: string;
  endpoint: string;
  testFunction: string;
  status: 'Passed';
  durationMs: number;
  isRegressionGap: boolean;
}

export interface ApiErrorResponse {
  error: string;
}
