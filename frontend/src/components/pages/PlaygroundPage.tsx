import React, { useState } from 'react';
import { useApi } from '../../context/ApiContext';
import { Assignment } from '../../types';
import { DemoScenarios } from './DemoScenarios';
import {
  Server,
  PlusCircle,
  Search,
  Send,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Copy,
  Check,
  Calendar,
  Layers,
  ArrowRightCircle,
  Hash,
  BookOpen,
} from 'lucide-react';

interface PlaygroundPageProps {
  onOpenResetModal: () => void;
}

export const PlaygroundPage: React.FC<PlaygroundPageProps> = ({ onOpenResetModal }) => {
  const {
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
  } = useApi();

  // Create Assignment Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-10-20');
  const [newMaxMarks, setNewMaxMarks] = useState<number | string>(100);
  const [createLoading, setCreateLoading] = useState(false);
  const [createResult, setCreateResult] = useState<{
    success: boolean;
    status: number;
    data?: Assignment;
    errorJson?: string;
  } | null>(null);

  // Find Assignments Filter State
  const [filterCourseCode, setFilterCourseCode] = useState('');
  const [filteredList, setFilteredList] = useState<Assignment[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  // Submit Assignment Form State
  const [subAssignmentId, setSubAssignmentId] = useState(assignments[0]?.id || 'ASN-101');
  const [subStudentName, setSubStudentName] = useState('Jordan Taylor');
  const [subSubmittedAt, setSubSubmittedAt] = useState('2026-10-09 15:30');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    status: number;
    json: string;
    friendlyExplanation?: string;
  } | null>(null);

  // View Submissions Drawer/Toggle
  const [showSubmissionsTable, setShowSubmissionsTable] = useState(false);

  // Copied helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // 1. Create Assignment Handler
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateResult(null);

    const res = await createAssignment({
      title: newTitle,
      courseCode: newCourseCode,
      dueDate: newDueDate,
      maxMarks: Number(newMaxMarks),
    });

    setCreateLoading(false);
    if (res.success && res.data) {
      setCreateResult({
        success: true,
        status: res.status,
        data: res.data,
      });
      // Reset form on success
      setNewTitle('');
      setNewCourseCode('');
    } else {
      setCreateResult({
        success: false,
        status: res.status,
        errorJson: JSON.stringify({ error: res.error || 'Validation error' }, null, 2),
      });
    }
  };

  // 2. Find Assignments Handler
  const handleSearchAssignments = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchLoading(true);
    const res = await getAssignments(filterCourseCode);
    setSearchLoading(false);
    setFilteredList(res.assignments);
    setFilterActive(Boolean(filterCourseCode.trim()));
  };

  const handleResetFilter = () => {
    setFilterCourseCode('');
    setFilteredList(null);
    setFilterActive(false);
  };

  // 3. Submit Assignment Handler
  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitResult(null);

    const res = await submitAssignment({
      assignmentId: subAssignmentId,
      studentName: subStudentName,
      submittedAt: subSubmittedAt,
    });

    setSubmitLoading(false);
    if (res.success && res.data) {
      setSubmitResult({
        success: true,
        status: 201,
        json: JSON.stringify(res.data, null, 2),
      });
    } else {
      setSubmitResult({
        success: false,
        status: res.status,
        json: JSON.stringify({ error: res.error || 'Submission error' }, null, 2),
        friendlyExplanation: res.friendlyExplanation,
      });
    }
  };

  // Current display list of assignments
  const displayAssignments = filteredList !== null ? filteredList : assignments;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Assignment Tracker API Playground
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Test business rules, create assignments, filter by course code, and verify late-submission rejections.
          </p>
        </div>

        {/* Demo Controls Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowSubmissionsTable(!showSubmissionsTable)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              showSubmissionsTable
                ? 'bg-cyan-600 text-white'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{showSubmissionsTable ? 'Hide Submissions' : 'View All Submissions'} ({submissions.length})</span>
          </button>

          <button
            onClick={onOpenResetModal}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Top Config Panel: Base URL, Mock Toggle, and Connection Badges */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-cyan-300 transition-colors space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Base URL input */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-600" />
              API Base URL:
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-lg bg-slate-50/80 border border-slate-300/90 text-sm font-mono text-slate-900 focus:outline-hidden focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100 transition-all"
              placeholder="http://127.0.0.1:8001"
            />
          </div>

          {/* Controls: Mock Data Toggle, Status Badge & Check Connection */}
          <div className="flex items-center gap-3.5 flex-wrap">
            {/* Toggle: Use mock data */}
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 select-none">
              <span className="font-mono">Use mock data</span>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useMockData}
                  onChange={(e) => setUseMockData(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 border border-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600 peer-checked:after:bg-white" />
              </div>
            </label>

            {/* Visible Connection Status Badge */}
            {connectionStatus === 'connected' && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold shadow-2xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>{useMockData ? 'Connected: Mock Engine' : 'Connected: Live FastAPI'}</span>
              </div>
            )}

            {connectionStatus === 'connecting' && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-300 text-cyan-800 text-xs font-mono font-bold shadow-2xs animate-pulse">
                <div className="w-3 h-3 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                <span>Connecting...</span>
              </div>
            )}

            {connectionStatus === 'disconnected' && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-300 text-rose-800 text-xs font-mono font-bold shadow-2xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <span>Disconnected: FastAPI Unreachable</span>
              </div>
            )}

            {/* Check API Connection button */}
            <button
              onClick={() => checkConnection()}
              disabled={connectionStatus === 'connecting'}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300/90 flex items-center gap-2 transition-all active:scale-98 shadow-xs hover:border-cyan-400 cursor-pointer disabled:opacity-50 min-h-[38px]"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected'
                    ? 'bg-emerald-500 ring-2 ring-emerald-100'
                    : connectionStatus === 'connecting'
                    ? 'bg-cyan-500 animate-spin ring-2 ring-cyan-100'
                    : 'bg-rose-500 ring-2 ring-rose-100'
                }`}
              />
              <span>Check Connection</span>
            </button>
          </div>
        </div>

        {/* Detailed Connection Message & Offline Helper */}
        {connectionStatus === 'disconnected' ? (
          <div className="p-4 rounded-xl text-xs font-mono bg-rose-50/90 border border-rose-200 text-rose-900 space-y-3 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-rose-600" />
                <div>
                  <div className="font-bold text-sm text-rose-950">FastAPI Backend Unreachable at {baseUrl}</div>
                  <p className="text-xs text-rose-800 mt-0.5 font-sans font-medium">
                    The local server cannot be reached. Mock mode remains fully functional with all 18 rules and automated test coverage.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUseMockData(true)}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-rose-300 text-rose-800 rounded-lg text-xs font-bold font-sans cursor-pointer shrink-0 transition-colors shadow-2xs flex items-center gap-1.5 self-start sm:self-auto"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Switch to Mock Mode</span>
              </button>
            </div>
            <div className="pt-2 border-t border-rose-200/70 text-slate-700">
              <p className="text-[11px] text-slate-600 mb-1.5 font-sans font-medium">
                To start your local FastAPI server in a terminal, run:
              </p>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-rose-300 select-all font-mono text-xs overflow-x-auto">
                python -m uvicorn student_assignment_tracker_buggy:app --reload --host 127.0.0.1 --port 8001
              </div>
            </div>
          </div>
        ) : connectionStatus === 'connecting' ? (
          <div className="p-3.5 rounded-xl text-xs font-mono bg-cyan-50/90 border border-cyan-200 text-cyan-800 flex items-center gap-2.5 animate-in fade-in duration-150">
            <div className="w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin shrink-0" />
            <span className="font-semibold">{connectionMessage || `Attempting connection to FastAPI at ${baseUrl}...`}</span>
          </div>
        ) : (
          connectionMessage && (
            <div className="p-3 rounded-xl text-xs font-mono bg-emerald-50/90 border border-emerald-200 text-emerald-800 flex items-center justify-between gap-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="font-semibold truncate">{connectionMessage}</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded shrink-0">
                {useMockData ? 'Sandbox Active' : 'Live Gateway Active'}
              </span>
            </div>
          )
        )}
      </div>

      {/* Hackathon Demo Scenarios Section */}
      <DemoScenarios
        onSyncCreateForm={(title, courseCode, dueDate, maxMarks, result) => {
          setNewTitle(title);
          setNewCourseCode(courseCode);
          setNewDueDate(dueDate);
          setNewMaxMarks(maxMarks);
          if (result) setCreateResult(result);
        }}
        onSyncFilterForm={(courseCode, resultList) => {
          setFilterCourseCode(courseCode);
          if (resultList) setFilteredList(resultList);
          setFilterActive(Boolean(courseCode));
        }}
        onSyncSubmitForm={(assignmentId, studentName, submittedAt, result) => {
          setSubAssignmentId(assignmentId);
          setSubStudentName(studentName);
          setSubSubmittedAt(submittedAt);
          if (result) setSubmitResult(result);
        }}
      />

      {/* Submissions Drawer / Table (Conditional) */}
      {showSubmissionsTable && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 animate-in fade-in duration-200 hover:border-cyan-300 transition-colors">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block">Telemetry Record</span>
                <h3 className="font-bold text-base text-slate-900">Recorded Assignment Submissions</h3>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-600 font-bold tabular-nums bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              Total: {submissions.length}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs font-mono min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/90 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-bold text-[11px]">
                  <th className="py-3 px-3.5">Sub ID</th>
                  <th className="py-3 px-3.5">Assignment</th>
                  <th className="py-3 px-3.5">Course</th>
                  <th className="py-3 px-3.5">Student Name</th>
                  <th className="py-3 px-3.5">Submitted At</th>
                  <th className="py-3 px-3.5">Due Date</th>
                  <th className="py-3 px-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-cyan-50/20 transition-colors">
                    <td className="py-3 px-3.5 text-cyan-700 font-bold tabular-nums">{sub.id}</td>
                    <td className="py-3 px-3.5 text-slate-900 font-semibold font-sans">{sub.assignmentTitle}</td>
                    <td className="py-3 px-3.5">
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 text-[11px]">
                        {sub.courseCode}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-700 font-sans font-medium">{sub.studentName}</td>
                    <td className="py-3 px-3.5 text-slate-500 tabular-nums">{sub.submittedAt}</td>
                    <td className="py-3 px-3.5 text-slate-500 tabular-nums">{sub.dueDate}</td>
                    <td className="py-3 px-3.5 text-right">
                      {sub.status === 'Accepted' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Accepted (On Time)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-bold text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          Rejected (Late)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid: Create Assignment & Submit Assignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
        {/* Form 1: Create Assignment */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5 hover:border-cyan-300 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block">Mutation Endpoint</span>
                  <h2 className="text-base font-bold text-slate-900">Create Assignment</h2>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200">
                POST /assignments
              </span>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Assignment Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems Final Project"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300/90 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">Rule: Minimum 3 characters required.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Course Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    placeholder="e.g. CS201"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300/90 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 uppercase transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Due Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300/90 text-sm font-mono text-slate-900 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Max Marks <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newMaxMarks}
                    onChange={(e) => setNewMaxMarks(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300/90 text-sm font-mono text-slate-900 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 active:scale-98 font-bold text-sm transition-all shadow-xs hover:shadow-cyan-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer min-h-[42px]"
                >
                  {createLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <PlusCircle className="w-4 h-4" />
                  )}
                  <span>Create Assignment</span>
                </button>
              </div>
            </form>
          </div>

          {/* Feedback Card (Success or Error JSON) */}
          {createResult && (
            <div className="pt-2">
              {createResult.success && createResult.data ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      HTTP 201 Created
                    </span>
                    <button
                      onClick={() => handleCopy(JSON.stringify(createResult.data, null, 2), 'create')}
                      className="text-xs font-mono text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'create' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono bg-slate-900 p-3 rounded-lg border border-slate-800 text-emerald-400 overflow-x-auto">
                    {JSON.stringify(createResult.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-800">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      HTTP {createResult.status} Validation Error
                    </span>
                    <button
                      onClick={() => handleCopy(createResult.errorJson || '', 'create-err')}
                      className="text-xs font-mono text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'create-err' ? <Check className="w-3.5 h-3.5 text-rose-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono bg-rose-100/80 p-3 rounded-lg border border-rose-200 text-rose-950 font-bold overflow-x-auto">
                    {createResult.errorJson}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Form 2: Submit Assignment (with late submission validation) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5 hover:border-cyan-300 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block">Submission Gateway</span>
                  <h2 className="text-base font-bold text-slate-900">Submit Assignment</h2>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200">
                POST /submissions
              </span>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Assignment Target <span className="text-rose-500">*</span>
                </label>
                <select
                  value={subAssignmentId}
                  onChange={(e) => setSubAssignmentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300/90 text-sm font-mono text-slate-900 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all cursor-pointer"
                >
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.id}: {a.title} ({a.courseCode}) — Due: {a.dueDate}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Student Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={subStudentName}
                  onChange={(e) => setSubStudentName(e.target.value)}
                  placeholder="e.g. Jordan Taylor"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300/90 text-sm text-slate-900 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Submitted At (Date &amp; Time) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="date"
                    value={subSubmittedAt.split(' ')[0]}
                    onChange={(e) => {
                      const time = subSubmittedAt.split(' ')[1] || '12:00';
                      setSubSubmittedAt(`${e.target.value} ${time}`);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300/90 text-sm font-mono text-slate-900 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const target = assignments.find((a) => a.id === subAssignmentId);
                        if (target) {
                          setSubSubmittedAt(`${target.dueDate} 11:59`);
                        }
                      }}
                      className="flex-1 py-1.5 px-2 text-[11px] font-mono rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold cursor-pointer transition-colors"
                    >
                      On Due Date
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubSubmittedAt('2026-10-30 18:00');
                      }}
                      className="flex-1 py-1.5 px-2 text-[11px] font-mono rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold cursor-pointer transition-colors"
                    >
                      Test Late (Reject)
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Try submitting on or before due date vs. after due date to test validation.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 active:scale-98 font-bold text-sm transition-all shadow-xs hover:shadow-cyan-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer min-h-[42px]"
                >
                  {submitLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Submit Assignment</span>
                </button>
              </div>
            </form>
          </div>

          {/* Submission Result Feedback */}
          {submitResult && (
            <div className="pt-2">
              {submitResult.success ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      HTTP 201 Created — Submission Accepted
                    </span>
                    <button
                      onClick={() => handleCopy(submitResult.json, 'submit')}
                      className="text-xs font-mono text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'submit' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono bg-slate-900 p-3 rounded-lg border border-slate-800 text-emerald-400 overflow-x-auto">
                    {submitResult.json}
                  </pre>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-800">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      HTTP {submitResult.status} Error Response
                    </span>
                    <button
                      onClick={() => handleCopy(submitResult.json, 'submit-err')}
                      className="text-xs font-mono text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'submit-err' ? <Check className="w-3.5 h-3.5 text-rose-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono bg-rose-100/80 p-3 rounded-lg border border-rose-200 text-rose-950 font-bold overflow-x-auto">
                    {submitResult.json}
                  </pre>
                  {submitResult.friendlyExplanation && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                      <span className="font-bold block mb-1 text-amber-950">Friendly Explanation:</span>
                      {submitResult.friendlyExplanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Find Assignments Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-cyan-300 transition-colors space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block">Query Endpoint</span>
                <h2 className="text-lg font-bold text-slate-900">Find Assignments</h2>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Case-insensitive query filter (e.g. searching <code className="text-cyan-800 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">ai101</code> matches <code className="text-cyan-800 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">AI101</code>).
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-md border border-cyan-200 self-start sm:self-auto">
            GET /assignments
          </span>
        </div>

        {/* Search Bar & Action Buttons */}
        <form onSubmit={handleSearchAssignments} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterCourseCode}
              onChange={(e) => setFilterCourseCode(e.target.value)}
              placeholder="Filter by Course Code (e.g. AI101, PY101)..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-300/90 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={searchLoading}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 font-bold text-sm transition-all shadow-xs hover:shadow-cyan-600/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer min-h-[42px]"
          >
            {searchLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Get Assignments</span>
          </button>

          {filterActive && (
            <button
              type="button"
              onClick={handleResetFilter}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold border border-slate-300 transition-colors shrink-0 cursor-pointer min-h-[42px]"
            >
              Clear Filter
            </button>
          )}
        </form>

        {/* Counter readout */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-600">
          <span className="font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200 tabular-nums">
            Found {displayAssignments.length} assignment(s)
          </span>
          {filterActive && (
            <span className="text-slate-500 hidden sm:inline">
              Filter applied: &quot;{filterCourseCode}&quot; (case-insensitive)
            </span>
          )}
        </div>

        {/* Table / Empty State */}
        {displayAssignments.length === 0 ? (
          <div className="p-10 text-center bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3.5">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 mx-auto shadow-2xs">
              <BookOpen className="w-6 h-6 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">No matching assignments found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                No assignments match the course code &quot;{filterCourseCode}&quot;. Try clearing the filter or create a new assignment above.
              </p>
            </div>
            <button
              onClick={handleResetFilter}
              className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-white hover:bg-slate-100 text-cyan-700 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/90 text-slate-600 font-mono text-xs uppercase tracking-wider border-b border-slate-200 font-bold">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Course Code</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Maximum Marks</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white font-mono text-xs">
                {displayAssignments.map((asn) => (
                  <tr key={asn.id} className="hover:bg-cyan-50/20 transition-colors group">
                    <td className="py-3.5 px-4 text-cyan-700 font-bold tabular-nums">
                      <span className="flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-slate-400" />
                        {asn.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-sm text-slate-900 font-semibold">
                      {asn.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs">
                        {asn.courseCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="flex items-center gap-1.5 tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {asn.dueDate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 font-bold tabular-nums">
                      {asn.maxMarks} pts
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSubAssignmentId(asn.id);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-cyan-700 hover:text-cyan-900 hover:bg-cyan-50/80 border border-transparent hover:border-cyan-200 font-bold cursor-pointer transition-colors"
                      >
                        <span>Select to Submit</span>
                        <ArrowRightCircle className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
