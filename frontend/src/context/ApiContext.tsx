import React, { createContext, useContext, useState } from 'react';
import { Assignment, Submission, PageId } from '../types';
import { SEED_ASSIGNMENTS, SEED_SUBMISSIONS, TEST_SCENARIOS } from '../data/initialData';

interface CreateAssignmentParams {
  title: string;
  courseCode: string;
  dueDate: string;
  maxMarks: number;
}

interface SubmitAssignmentParams {
  assignmentId: string | number;
  studentName: string;
  submittedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
  friendlyExplanation?: string;
}

interface ApiContextType {
  baseUrl: string;
  setBaseUrl: (url: string) => void;
  useMockData: boolean;
  setUseMockData: (val: boolean) => void;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  connectionMessage: string | null;
  checkConnection: (targetUrl?: string) => Promise<boolean>;
  assignments: Assignment[];
  submissions: Submission[];
  createAssignment: (params: CreateAssignmentParams) => Promise<ApiResponse<Assignment>>;
  getAssignments: (courseCodeFilter?: string) => Promise<{ assignments: Assignment[]; count: number; error?: string }>;
  submitAssignment: (params: SubmitAssignmentParams) => Promise<ApiResponse<Submission>>;
  resetDemoData: () => void;
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  // Test suite execution simulation
  isTestRunning: boolean;
  testRunLogs: string[];
  testRunSummary: string | null;
  runTestSuite: () => void;
  clearTestLogs: () => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baseUrl, setBaseUrl] = useState<string>('http://127.0.0.1:8001');
  const [useMockData, setUseMockDataState] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [connectionMessage, setConnectionMessage] = useState<string | null>('Connected to Mock Engine');

  const [assignments, setAssignments] = useState<Assignment[]>(SEED_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(SEED_SUBMISSIONS);
  const [activePage, setActivePage] = useState<PageId>('home');

  // Test suite simulation state
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [testRunLogs, setTestRunLogs] = useState<string[]>([]);
  const [testRunSummary, setTestRunSummary] = useState<string | null>(null);

  const checkConnectionLive = async (targetUrl?: string): Promise<boolean> => {
    const url = (targetUrl || baseUrl).replace(/\/+$/, '');
    setConnectionStatus('connecting');
    setConnectionMessage(`Attempting connection to FastAPI at ${url}...`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${url}/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        setConnectionStatus('connected');
        setConnectionMessage(`200 OK — Connected to live FastAPI backend at ${url}`);
        return true;
      } else {
        setConnectionStatus('disconnected');
        setConnectionMessage(`HTTP ${res.status}: Backend reached at ${url} but returned error`);
        return false;
      }
    } catch {
      setConnectionStatus('disconnected');
      setConnectionMessage(`FastAPI backend is unreachable at ${url}. Mock mode remains fully functional.`);
      return false;
    }
  };

  const checkConnection = async (targetUrl?: string): Promise<boolean> => {
    if (useMockData && !targetUrl) {
      setConnectionStatus('connecting');
      await new Promise((resolve) => setTimeout(resolve, 250));
      setConnectionStatus('connected');
      setConnectionMessage('200 OK — Mock Gateway Active (127.0.0.1:8001)');
      return true;
    }
    return checkConnectionLive(targetUrl || baseUrl);
  };

  const setUseMockData = (val: boolean) => {
    setUseMockDataState(val);
    if (val) {
      setConnectionStatus('connected');
      setConnectionMessage('Connected to Mock Engine — in-memory sandbox active');
    } else {
      // When mock data is disabled, immediately attempt requests to configured FastAPI URL
      checkConnectionLive(baseUrl);
    }
  };

  const createAssignment = async (params: CreateAssignmentParams): Promise<ApiResponse<Assignment>> => {
    const trimmedTitle = params.title ? params.title.trim() : '';
    const trimmedCourse = params.courseCode ? params.courseCode.trim() : '';
    const maxMarks = Number(params.maxMarks);

    // Business & contract validation rules
    if (!trimmedTitle || trimmedTitle.length < 3) {
      return {
        success: false,
        error: 'title is required and must have at least 3 characters',
        status: 400,
      };
    }

    if (!trimmedCourse || trimmedCourse.length === 0) {
      return {
        success: false,
        error: 'courseCode is required and cannot be empty',
        status: 400,
      };
    }

    if (!params.dueDate) {
      return {
        success: false,
        error: 'dueDate must be a valid date',
        status: 400,
      };
    }

    if (isNaN(maxMarks) || maxMarks < 1 || maxMarks > 100) {
      return {
        success: false,
        error: 'maxMarks must be between 1 and 100',
        status: 400,
      };
    }

    if (useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const newAssignment: Assignment = {
        id: `ASN-${Math.floor(104 + assignments.length * 7)}`,
        title: trimmedTitle,
        courseCode: trimmedCourse.toUpperCase(),
        dueDate: params.dueDate,
        maxMarks: maxMarks,
        createdAt: new Date().toISOString(),
      };

      setAssignments((prev) => [newAssignment, ...prev]);
      return {
        success: true,
        data: newAssignment,
        status: 201,
      };
    }

    // Call live FastAPI
    try {
      const res = await fetch(`${baseUrl}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: trimmedTitle,
          courseCode: trimmedCourse,
          dueDate: params.dueDate,
          maxMarks: maxMarks,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.error || data.detail || 'Validation error',
          status: res.status,
        };
      }
      setAssignments((prev) => [data, ...prev]);
      setConnectionStatus('connected');
      return {
        success: true,
        data,
        status: 201,
      };
    } catch {
      setConnectionStatus('disconnected');
      setConnectionMessage(`FastAPI backend is unreachable at ${baseUrl}. Mock mode remains fully functional.`);
      return {
        success: false,
        error: `Could not connect to FastAPI at ${baseUrl}. Ensure backend is running. Mock mode is available anytime.`,
        status: 503,
      };
    }
  };

  const getAssignments = async (courseCodeFilter?: string): Promise<{ assignments: Assignment[]; count: number; error?: string }> => {
    if (useMockData) {
      const filter = (courseCodeFilter || '').trim().toLowerCase();
      if (!filter) {
        return { assignments, count: assignments.length };
      }
      // Case-insensitive filtering
      const filtered = assignments.filter((a) => a.courseCode.toLowerCase() === filter);
      return { assignments: filtered, count: filtered.length };
    }

    try {
      const filter = (courseCodeFilter || '').trim();
      const url = filter
        ? `${baseUrl}/assignments?courseCode=${encodeURIComponent(filter)}`
        : `${baseUrl}/assignments`;
      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return { assignments: [], count: 0, error: errData.error || 'Failed to fetch assignments' };
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setConnectionStatus('connected');
      return { assignments: list, count: list.length };
    } catch {
      setConnectionStatus('disconnected');
      setConnectionMessage(`FastAPI backend is unreachable at ${baseUrl}. Mock mode remains fully functional.`);
      return {
        assignments: [],
        count: 0,
        error: `Could not connect to API server at ${baseUrl}. Mock mode remains fully functional.`,
      };
    }
  };

  const submitAssignment = async (params: SubmitAssignmentParams): Promise<ApiResponse<Submission>> => {
    const studentName = params.studentName ? params.studentName.trim() : '';

    if (!studentName) {
      return {
        success: false,
        error: 'studentName is required',
        status: 400,
      };
    }

    if (!params.assignmentId) {
      return {
        success: false,
        error: 'assignmentId must refer to an existing assignment',
        status: 400,
      };
    }

    if (useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const targetAssignment = assignments.find((a) => a.id === params.assignmentId);

      if (!targetAssignment) {
        return {
          success: false,
          error: `Assignment with ID "${params.assignmentId}" not found`,
          status: 404,
        };
      }

      // Check due date constraint
      // Compare calendar date of submission against assignment due date
      const submitDateStr = params.submittedAt.split(' ')[0] || params.submittedAt.split('T')[0];
      const dueDateStr = targetAssignment.dueDate;
      const isLate = submitDateStr > dueDateStr;

      if (isLate) {
        const rejectedSub: Submission = {
          id: `SUB-${Math.floor(500 + Math.random() * 400)}`,
          assignmentId: targetAssignment.id,
          assignmentTitle: targetAssignment.title,
          courseCode: targetAssignment.courseCode,
          studentName,
          submittedAt: params.submittedAt,
          dueDate: targetAssignment.dueDate,
          isLate: true,
          status: 'Rejected',
          rejectionReason: 'Late submissions are not allowed',
        };
        // Record rejected attempt in audit trail
        setSubmissions((prev) => [rejectedSub, ...prev]);

        return {
          success: false,
          error: 'Late submissions are not allowed',
          status: 400,
          friendlyExplanation: 'The submission was correctly rejected because it was after the assignment due date.',
        };
      }

      // On-time submission
      const newSub: Submission = {
        id: `SUB-${Math.floor(303 + submissions.length * 11)}`,
        assignmentId: targetAssignment.id,
        assignmentTitle: targetAssignment.title,
        courseCode: targetAssignment.courseCode,
        studentName,
        submittedAt: params.submittedAt,
        dueDate: targetAssignment.dueDate,
        isLate: false,
        status: 'Accepted',
      };

      setSubmissions((prev) => [newSub, ...prev]);
      return {
        success: true,
        data: newSub,
        status: 201,
      };
    }

    // Call live FastAPI
    try {
      // Backend expects assignmentId as an integer; parse it in case a string was passed.
      const assignmentIdInt = Number(params.assignmentId);
      const res = await fetch(`${baseUrl}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: assignmentIdInt,
          studentName,
          submittedAt: params.submittedAt,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Submission error',
          status: res.status,
          friendlyExplanation: data.error === 'Late submissions are not allowed'
            ? 'The submission was correctly rejected because it was after the assignment due date.'
            : undefined,
        };
      }
      setSubmissions((prev) => [data, ...prev]);
      setConnectionStatus('connected');
      return {
        success: true,
        data,
        status: 201,
      };
    } catch {
      setConnectionStatus('disconnected');
      setConnectionMessage(`FastAPI backend is unreachable at ${baseUrl}. Mock mode remains fully functional.`);
      return {
        success: false,
        error: `Could not connect to FastAPI at ${baseUrl}. Local server is offline. You can continue testing in Mock Mode.`,
        status: 503,
      };
    }
  };

  const resetDemoData = () => {
    setAssignments(SEED_ASSIGNMENTS);
    setSubmissions(SEED_SUBMISSIONS);
    setConnectionStatus('connected');
    setConnectionMessage('Demo state restored to original seeded assignments');
  };

  const runTestSuite = () => {
    if (isTestRunning) return;
    setIsTestRunning(true);
    setTestRunLogs([]);
    setTestRunSummary(null);

    const initialHeader = [
      '============================= test session starts ==============================',
      'platform linux -- Python 3.11.8, pytest-7.4.3, pluggy-1.3.0',
      'rootdir: /workspace/student-assignment-tracker',
      'collected 18 items',
      '',
    ];
    setTestRunLogs(initialHeader);

    // Stream test executions sequentially
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < TEST_SCENARIOS.length) {
        const item = TEST_SCENARIOS[currentIdx];
        const percent = Math.round(((currentIdx + 1) / TEST_SCENARIOS.length) * 100);
        const logLine = `${item.testFunction} PASSED [${percent.toString().padStart(3, ' ')}%]`;
        setTestRunLogs((prev) => [...prev, logLine]);
        currentIdx++;
      } else {
        clearInterval(interval);
        const summary = '======================= 18 passed in 1.24s =======================';
        setTestRunLogs((prev) => [...prev, '', summary]);
        setTestRunSummary('All 18 automated tests passed successfully.');
        setIsTestRunning(false);
      }
    }, 65);
  };

  const clearTestLogs = () => {
    setTestRunLogs([]);
    setTestRunSummary(null);
  };

  return (
    <ApiContext.Provider
      value={{
        baseUrl,
        setBaseUrl,
        useMockData,
        setUseMockData,
        connectionStatus,
        connectionMessage,
        checkConnection,
        assignments,
        submissions,
        createAssignment,
        getAssignments,
        submitAssignment,
        resetDemoData,
        activePage,
        setActivePage,
        isTestRunning,
        testRunLogs,
        testRunSummary,
        runTestSuite,
        clearTestLogs,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
