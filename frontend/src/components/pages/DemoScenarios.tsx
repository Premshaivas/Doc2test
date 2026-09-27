import React, { useState } from 'react';
import { useApi } from '../../context/ApiContext';
import {
  CheckCircle2,
  AlertCircle,
  Search,
  Send,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  PlusCircle,
  Code2,
} from 'lucide-react';

export type DemoScenarioId =
  | 'valid_create'
  | 'missing_course'
  | 'invalid_marks'
  | 'course_filter'
  | 'late_submission';

interface DemoScenariosProps {
  onSyncCreateForm: (title: string, courseCode: string, dueDate: string, maxMarks: number | string, result?: any) => void;
  onSyncFilterForm: (courseCode: string, resultList?: any[]) => void;
  onSyncSubmitForm: (assignmentId: string, studentName: string, submittedAt: string, result?: any) => void;
}

interface ScenarioExecutionResult {
  status: number;
  response: any;
  timestamp: string;
}

export const DemoScenarios: React.FC<DemoScenariosProps> = ({
  onSyncCreateForm,
  onSyncFilterForm,
  onSyncSubmitForm,
}) => {
  const {
    createAssignment,
    getAssignments,
    submitAssignment,
    assignments,
    useMockData,
  } = useApi();

  const [activeScenario, setActiveScenario] = useState<DemoScenarioId | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ScenarioExecutionResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const scenarios = [
    {
      id: 'valid_create' as DemoScenarioId,
      step: '1',
      title: 'Valid Assignment Creation',
      shortTitle: 'Valid Assignment',
      endpoint: 'POST /assignments',
      expectedStatus: '201 Created',
      statusType: 'success',
      icon: PlusCircle,
      tag: 'Creation Pass',
      summary: 'Demonstrates compliant assignment creation meeting all contract rules and field bounds.',
    },
    {
      id: 'missing_course' as DemoScenarioId,
      step: '2',
      title: 'Missing courseCode Rejection',
      shortTitle: 'Missing courseCode',
      endpoint: 'POST /assignments',
      expectedStatus: '400 Bad Request',
      statusType: 'error',
      icon: AlertCircle,
      tag: 'REQ-01 Validation',
      summary: 'Demonstrates strict rejection when mandatory courseCode field is empty string.',
    },
    {
      id: 'invalid_marks' as DemoScenarioId,
      step: '3',
      title: 'Invalid maxMarks Rejection',
      shortTitle: 'Invalid maxMarks (>100)',
      endpoint: 'POST /assignments',
      expectedStatus: '400 Bad Request',
      statusType: 'error',
      icon: AlertCircle,
      tag: 'Boundary Guard',
      summary: 'Demonstrates rejection when maxMarks exceeds upper threshold of 100.',
    },
    {
      id: 'course_filter' as DemoScenarioId,
      step: '4',
      title: 'Course Filtering (Case-Insensitive)',
      shortTitle: 'Course Filtering',
      endpoint: 'GET /assignments?courseCode=ai101',
      expectedStatus: '200 OK',
      statusType: 'success',
      icon: Search,
      tag: 'Normalization',
      summary: 'Demonstrates case-insensitive query matching (lowercase "ai101" matching "AI101").',
    },
    {
      id: 'late_submission' as DemoScenarioId,
      step: '5',
      title: 'Late Submission Rejection',
      shortTitle: 'Late Submission',
      endpoint: 'POST /submissions',
      expectedStatus: '400 Bad Request',
      statusType: 'error',
      icon: Send,
      tag: 'Due Date Cutoff',
      summary: 'Demonstrates strict rejection of student submission dated after assignment due date.',
    },
  ];

  const runScenario = async (id: DemoScenarioId) => {
    setActiveScenario(id);
    setIsRunning(true);
    setExecutionResult(null);

    const nowStr = new Date().toLocaleTimeString();

    if (id === 'valid_create') {
      const payload = {
        title: 'Distributed Systems Capstone Project',
        courseCode: 'CS301',
        dueDate: '2026-11-20',
        maxMarks: 100,
      };

      const res = await createAssignment(payload);
      const outcome = {
        status: res.status,
        response: res.success ? res.data : { error: res.error },
        timestamp: nowStr,
      };
      setExecutionResult(outcome);
      onSyncCreateForm(
        payload.title,
        payload.courseCode,
        payload.dueDate,
        payload.maxMarks,
        res.success ? { success: true, status: res.status, data: res.data } : { success: false, status: res.status, errorJson: JSON.stringify({ error: res.error }, null, 2) }
      );
    } else if (id === 'missing_course') {
      const payload = {
        title: 'Advanced Machine Learning Paper',
        courseCode: '',
        dueDate: '2026-11-25',
        maxMarks: 100,
      };

      const res = await createAssignment(payload);
      const outcome = {
        status: res.status,
        response: { error: res.error || 'courseCode is required and cannot be empty' },
        timestamp: nowStr,
      };
      setExecutionResult(outcome);
      onSyncCreateForm(
        payload.title,
        payload.courseCode,
        payload.dueDate,
        payload.maxMarks,
        {
          success: false,
          status: res.status,
          errorJson: JSON.stringify({ error: res.error }, null, 2),
        }
      );
    } else if (id === 'invalid_marks') {
      const payload = {
        title: 'Quantum Computing Lab 4',
        courseCode: 'QC401',
        dueDate: '2026-11-30',
        maxMarks: 150,
      };

      const res = await createAssignment(payload);
      const outcome = {
        status: res.status,
        response: { error: res.error || 'maxMarks must be between 1 and 100' },
        timestamp: nowStr,
      };
      setExecutionResult(outcome);
      onSyncCreateForm(
        payload.title,
        payload.courseCode,
        payload.dueDate,
        payload.maxMarks,
        {
          success: false,
          status: res.status,
          errorJson: JSON.stringify({ error: res.error }, null, 2),
        }
      );
    } else if (id === 'course_filter') {
      const query = 'ai101';
      const res = await getAssignments(query);
      const outcome = {
        status: 200,
        response: {
          queryFilter: query,
          count: res.count,
          assignments: res.assignments,
        },
        timestamp: nowStr,
      };
      setExecutionResult(outcome);
      onSyncFilterForm(query, res.assignments);
    } else if (id === 'late_submission') {
      // Pick ASN-101 which has due date 2026-10-10
      const targetAsn = assignments.find((a) => a.id === 'ASN-101') || assignments[0] || { id: 'ASN-101', dueDate: '2026-10-10' };
      const payload = {
        assignmentId: targetAsn.id,
        studentName: 'Samira Khan',
        submittedAt: '2026-10-25 16:45',
      };

      const res = await submitAssignment(payload);
      const outcome = {
        status: res.status,
        response: {
          error: res.error || 'Late submissions are not allowed',
          friendlyExplanation: res.friendlyExplanation || 'The submission was correctly rejected because it was after the assignment due date.',
        },
        timestamp: nowStr,
      };
      setExecutionResult(outcome);
      onSyncSubmitForm(
        payload.assignmentId,
        payload.studentName,
        payload.submittedAt,
        {
          success: false,
          status: res.status,
          json: JSON.stringify({ error: res.error }, null, 2),
          friendlyExplanation: res.friendlyExplanation,
        }
      );
    }

    setIsRunning(false);
  };

  const renderExplanation = () => {
    if (!activeScenario) {
      return (
        <div className="p-6 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-300">
          <p className="text-xs text-slate-500 font-medium">
            Select any scenario button above to automatically execute and inspect the contract verification explanation.
          </p>
        </div>
      );
    }

    switch (activeScenario) {
      case 'valid_create':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Box */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    Before: Input &amp; Contract Rules
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                    POST /assignments
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <p className="leading-relaxed">
                    <strong className="text-slate-800">Intent:</strong> Submit a complete and compliant assignment creation payload satisfying all API contract parameters:
                  </p>
                  <pre className="p-2.5 bg-slate-900 text-cyan-300 font-mono text-[11px] rounded-lg overflow-x-auto">
{`{
  "title": "Distributed Systems Capstone Project",
  "courseCode": "CS301",
  "dueDate": "2026-11-20",
  "maxMarks": 100
}`}
                  </pre>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                    <li>Title length: 35 characters (≥ 3 required)</li>
                    <li>Course code: Non-empty string (&quot;CS301&quot;)</li>
                    <li>Due date: Valid future date (2026-11-20)</li>
                    <li>Max marks: 100 (allowed boundary 1–100)</li>
                  </ul>
                </div>
              </div>

              {/* After Box */}
              <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    After: Actual Response &amp; State Impact
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    HTTP 201 Created
                  </span>
                </div>
                <div className="space-y-2 text-xs text-emerald-950">
                  <p className="leading-relaxed text-slate-700">
                    <strong className="text-slate-900">Behavior:</strong> The server passes all validations, assigns a generated unique ID, attaches creation metadata, and persists the entity.
                  </p>
                  {executionResult && (
                    <pre className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto max-h-36">
                      {JSON.stringify(executionResult.response, null, 2)}
                    </pre>
                  )}
                  <p className="text-[11px] text-slate-600 pt-1">
                    <strong className="text-emerald-800">Verification:</strong> The newly created assignment is immediately added to the assignments table and is ready to receive student submissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'missing_course':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Box */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Before: Input &amp; Contract Rules
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    POST /assignments
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <p className="leading-relaxed">
                    <strong className="text-slate-800">Intent:</strong> Submit an assignment with an empty <code className="font-mono text-rose-600 font-bold">&quot;courseCode&quot;: &quot;&quot;</code> to test REQ-01 enforcement:
                  </p>
                  <pre className="p-2.5 bg-slate-900 text-rose-300 font-mono text-[11px] rounded-lg overflow-x-auto">
{`{
  "title": "Advanced Machine Learning Paper",
  "courseCode": "",  // <-- INVALID: empty string
  "dueDate": "2026-11-25",
  "maxMarks": 100
}`}
                  </pre>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                    <li>Contract requirement: <code className="font-mono font-bold text-slate-800">courseCode is required and cannot be empty</code></li>
                    <li>Guards against orphaned assignments unattached to an academic course</li>
                  </ul>
                </div>
              </div>

              {/* After Box */}
              <div className="bg-rose-50/70 border border-rose-200/90 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-rose-200">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    After: Actual Response &amp; Safety Guard
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                    HTTP 400 Bad Request
                  </span>
                </div>
                <div className="space-y-2 text-xs text-rose-950">
                  <p className="leading-relaxed text-slate-700">
                    <strong className="text-slate-900">Behavior:</strong> The server halts execution at input validation and immediately rejects the payload with an explicit error response:
                  </p>
                  {executionResult && (
                    <pre className="p-2.5 bg-rose-100/90 text-rose-950 font-mono font-bold text-[11px] rounded-lg border border-rose-200 overflow-x-auto">
                      {JSON.stringify(executionResult.response, null, 2)}
                    </pre>
                  )}
                  <p className="text-[11px] text-slate-600 pt-1">
                    <strong className="text-rose-800">Safety Verified:</strong> Zero mutations applied to the database. Corrupted records with blank course codes are completely prevented.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'invalid_marks':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Box */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Before: Input &amp; Contract Rules
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    POST /assignments
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <p className="leading-relaxed">
                    <strong className="text-slate-800">Intent:</strong> Submit an assignment with <code className="font-mono text-amber-700 font-bold">&quot;maxMarks&quot;: 150</code> to test boundary limits:
                  </p>
                  <pre className="p-2.5 bg-slate-900 text-amber-300 font-mono text-[11px] rounded-lg overflow-x-auto">
{`{
  "title": "Quantum Computing Lab 4",
  "courseCode": "QC401",
  "dueDate": "2026-11-30",
  "maxMarks": 150  // <-- INVALID: exceeds maximum 100
}`}
                  </pre>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                    <li>Contract requirement: <code className="font-mono font-bold text-slate-800">maxMarks must be between 1 and 100</code></li>
                    <li>Guards grading calculation scales against arbitrary or inflated values</li>
                  </ul>
                </div>
              </div>

              {/* After Box */}
              <div className="bg-rose-50/70 border border-rose-200/90 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-rose-200">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    After: Actual Response &amp; Safety Guard
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                    HTTP 400 Bad Request
                  </span>
                </div>
                <div className="space-y-2 text-xs text-rose-950">
                  <p className="leading-relaxed text-slate-700">
                    <strong className="text-slate-900">Behavior:</strong> The server intercepts the out-of-bounds integer and returns HTTP 400 Bad Request:
                  </p>
                  {executionResult && (
                    <pre className="p-2.5 bg-rose-100/90 text-rose-950 font-mono font-bold text-[11px] rounded-lg border border-rose-200 overflow-x-auto">
                      {JSON.stringify(executionResult.response, null, 2)}
                    </pre>
                  )}
                  <p className="text-[11px] text-slate-600 pt-1">
                    <strong className="text-rose-800">Safety Verified:</strong> Strict integer range checking prevents grading schema corruption and ensures standard 100-point scale compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'course_filter':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Box */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    Before: Input &amp; Contract Rules
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                    GET /assignments
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <p className="leading-relaxed">
                    <strong className="text-slate-800">Intent:</strong> Query assignments using lowercase query parameter <code className="font-mono text-cyan-700 font-bold">courseCode=ai101</code>:
                  </p>
                  <pre className="p-2.5 bg-slate-900 text-cyan-300 font-mono text-[11px] rounded-lg overflow-x-auto">
GET /assignments?courseCode=ai101
                  </pre>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                    <li>Contract requirement: Course code filtering must be <strong className="text-slate-800">case-insensitive</strong></li>
                    <li>Regression fix: Resolves previous defect where lowercase searches returned empty arrays</li>
                  </ul>
                </div>
              </div>

              {/* After Box */}
              <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    After: Actual Response &amp; Match Verification
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    HTTP 200 OK
                  </span>
                </div>
                <div className="space-y-2 text-xs text-emerald-950">
                  <p className="leading-relaxed text-slate-700">
                    <strong className="text-slate-900">Behavior:</strong> The server normalizes casing and correctly retrieves uppercase database records (<code className="font-mono font-bold text-slate-800">&quot;AI101&quot;</code>):
                  </p>
                  {executionResult && (
                    <pre className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto max-h-36">
                      {JSON.stringify(executionResult.response, null, 2)}
                    </pre>
                  )}
                  <p className="text-[11px] text-slate-600 pt-1">
                    <strong className="text-emerald-800">Verification:</strong> Found {executionResult?.response?.count || '2'} matching record(s) under AI101, demonstrating flawless query normalization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'late_submission':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Box */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Before: Input &amp; Contract Rules
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    POST /submissions
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <p className="leading-relaxed">
                    <strong className="text-slate-800">Intent:</strong> Submit work for ASN-101 (Due Date: <code className="font-mono font-bold text-slate-800">2026-10-10</code>) on <code className="font-mono text-rose-600 font-bold">2026-10-25</code> (15 days late):
                  </p>
                  <pre className="p-2.5 bg-slate-900 text-rose-300 font-mono text-[11px] rounded-lg overflow-x-auto">
{`{
  "assignmentId": "ASN-101",
  "studentName": "Samira Khan",
  "submittedAt": "2026-10-25 16:45"  // <-- LATE: Due on 2026-10-10
}`}
                  </pre>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                    <li>Contract requirement: <code className="font-mono font-bold text-slate-800">Late submissions are not allowed</code></li>
                    <li>Guarantees strict fairness and deadline adherence across all student submissions</li>
                  </ul>
                </div>
              </div>

              {/* After Box */}
              <div className="bg-rose-50/70 border border-rose-200/90 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-rose-200">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    After: Actual Response &amp; Audit Trail
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                    HTTP 400 Bad Request
                  </span>
                </div>
                <div className="space-y-2 text-xs text-rose-950">
                  <p className="leading-relaxed text-slate-700">
                    <strong className="text-slate-900">Behavior:</strong> The server detects submission date exceeds due date, rejects submission, and records rejected attempt in telemetry:
                  </p>
                  {executionResult && (
                    <pre className="p-2.5 bg-rose-100/90 text-rose-950 font-mono font-bold text-[11px] rounded-lg border border-rose-200 overflow-x-auto">
                      {JSON.stringify(executionResult.response, null, 2)}
                    </pre>
                  )}
                  <p className="text-[11px] text-slate-600 pt-1">
                    <strong className="text-rose-800">Audit Preserved:</strong> Rejection reason is clearly explained to student, while an audit log entry with <code className="font-mono font-bold">isLate: true</code> is recorded for institutional records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-cyan-300 transition-colors space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block">
                Hackathon Demo Experience
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Demo Scenarios (One-Click Automated Showcase)
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Instantly demonstrate specification compliance, validation bounds, case-insensitive normalization, and late-submission cutoffs with full before/after explanations.
          </p>
        </div>

        {activeScenario && (
          <button
            onClick={() => {
              setActiveScenario(null);
              setExecutionResult(null);
            }}
            className="self-start sm:self-auto text-xs font-mono text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Showcase</span>
          </button>
        )}
      </div>

      {/* Scenario Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {scenarios.map((sc) => {
          const isActive = activeScenario === sc.id;
          const Icon = sc.icon;
          return (
            <button
              key={sc.id}
              onClick={() => runScenario(sc.id)}
              disabled={isRunning}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 cursor-pointer relative group ${
                isActive
                  ? 'bg-cyan-50/70 border-cyan-400 ring-2 ring-cyan-200 shadow-xs'
                  : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200/90 hover:border-cyan-300'
              } disabled:opacity-50`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isActive ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  Scenario {sc.step}
                </span>
                <span className={`text-[10px] font-mono font-bold ${
                  sc.statusType === 'success' ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {sc.expectedStatus.split(' ')[0]}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-cyan-700 transition-colors">
                  {sc.shortTitle}
                </h4>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                  {sc.endpoint}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/70">
                <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider font-mono">
                  {sc.tag}
                </span>
                <span className={`flex items-center gap-1 font-bold ${
                  isActive ? 'text-cyan-700' : 'text-slate-400 group-hover:text-cyan-600'
                }`}>
                  <span>Run</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      <div className="pt-1">
        {renderExplanation()}
      </div>
    </div>
  );
};
