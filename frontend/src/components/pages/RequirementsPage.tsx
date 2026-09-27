import React, { useState } from 'react';
import { REQUIREMENTS_DOC_MARKDOWN } from '../../data/initialData';
import {
  FileCode,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldAlert,
  Search,
} from 'lucide-react';

export const RequirementsPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');
  const [searchClause, setSearchClause] = useState('');

  // Fixed or dynamic last loaded timestamp
  const lastLoadedTimestamp = '2026-09-26 09:41:12 UTC';

  const handleCopy = () => {
    navigator.clipboard.writeText(REQUIREMENTS_DOC_MARKDOWN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([REQUIREMENTS_DOC_MARKDOWN], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assignment_api_requirements.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header with Document Metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-semibold mb-2">
            <FileCode className="w-3.5 h-3.5 text-cyan-600" />
            Formal Specification Document
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Requirements Explorer
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Official contract specification used as the single source of truth for the Doc2Test Guardian auditor.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-mono transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy Spec'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 font-bold text-xs font-mono transition-all shadow-sm shadow-cyan-600/25"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Requirements</span>
          </button>
        </div>
      </div>

      {/* Document Meta Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono hover:border-cyan-300 transition-colors">
        <div className="flex items-center gap-2.5 text-cyan-800 font-bold">
          <div className="p-1 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-600">
            <FileCode className="w-4 h-4" />
          </div>
          <span>File: assignment_api_requirements.md</span>
        </div>
        <div className="flex items-center gap-4 text-slate-600 flex-wrap">
          <span className="flex items-center gap-1.5 tabular-nums">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Last loaded: {lastLoadedTimestamp}
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Parsed &amp; Verified
          </span>
        </div>
      </div>

      {/* View Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200 self-start">
          <button
            onClick={() => setViewMode('rendered')}
            className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
              viewMode === 'rendered' ? 'bg-cyan-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Structured Guide
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
              viewMode === 'raw' ? 'bg-cyan-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Raw Markdown
          </button>
        </div>

        {viewMode === 'rendered' && (
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchClause}
              onChange={(e) => setSearchClause(e.target.value)}
              placeholder="Filter rules or endpoints..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-300/90 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {viewMode === 'raw' ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs overflow-x-auto">
          <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre select-all">
            {REQUIREMENTS_DOC_MARKDOWN}
          </pre>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-7">
          {/* Section: Document Title */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-cyan-300 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block mb-1">Baseline Document</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Student Assignment Tracker API Requirements
            </h2>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed max-w-3xl">
              Specification defining data structures, endpoint constraints, error formats, and required validation boundaries.
            </p>
          </div>

          {/* Section 1: API Error Format */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-cyan-300 transition-colors space-y-3.5">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block">Clause 01</span>
                  <h3 className="text-base font-bold text-slate-900">API Error Format</h3>
                </div>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200">
                Global Contract
              </span>
            </div>
            <p className="text-sm text-slate-600">All errors must return a consistent JSON schema using the &quot;error&quot; key:</p>
            <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200 font-mono text-xs text-slate-900 font-semibold">
              {`{
  "error": "descriptive error message"
}`}
            </div>
          </div>

          {/* Section 2: Create Assignment */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-cyan-300 transition-colors space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block">Clause 02</span>
                  <h3 className="text-base font-bold text-slate-900">Create Assignment</h3>
                </div>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200">
                POST /assignments
              </span>
            </div>
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block">Rules &amp; Invariants:</span>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-600 font-bold">•</span>
                  <span><code className="text-cyan-800 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">title</code> is required and minimum 3 characters.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-600 font-bold">•</span>
                  <span><code className="text-cyan-800 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">courseCode</code> is required and cannot be empty.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-600 font-bold">•</span>
                  <span><code className="text-cyan-800 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">dueDate</code> must be a valid date.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-600 font-bold">•</span>
                  <span><code className="text-cyan-800 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">maxMarks</code> must be between 1 and 100.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Success response: <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">HTTP 201 Created</span>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>Validation error: <span className="font-mono font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">HTTP 400 Bad Request</span>.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: List Assignments */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-cyan-300 transition-colors space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block">Clause 03</span>
                  <h3 className="text-base font-bold text-slate-900">List Assignments</h3>
                </div>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200">
                GET /assignments
              </span>
            </div>
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block">Rules &amp; Invariants:</span>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-600 font-bold">•</span>
                  <span>Return all assignments without a filter.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-600 font-bold">•</span>
                  <span>Support optional <code className="text-cyan-800 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">courseCode</code> query filter parameter.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Filtering must be <strong className="text-emerald-800 font-bold">case-insensitive</strong> (e.g. <code className="text-cyan-800 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">&quot;ai101&quot; == &quot;AI101&quot;</code>).</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4: Get Assignment */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-cyan-300 transition-colors space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block">Clause 04</span>
                  <h3 className="text-base font-bold text-slate-900">Get Assignment</h3>
                </div>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200">
                GET /assignments/{'{assignment_id}'}
              </span>
            </div>
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block">Rules &amp; Invariants:</span>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Return assignment JSON object when available (<span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">HTTP 200</span>).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>Return <span className="font-mono font-bold text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">HTTP 404</span> when missing.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 5: Create Submission */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-cyan-300 transition-colors space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block">Clause 05</span>
                  <h3 className="text-base font-bold text-slate-900">Create Submission</h3>
                </div>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200">
                POST /submissions
              </span>
            </div>
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block">Rules &amp; Invariants:</span>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-600 font-bold">•</span>
                  <span><code className="text-cyan-800 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">assignmentId</code> must refer to an existing assignment.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-600 font-bold">•</span>
                  <span><code className="text-cyan-800 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">studentName</code> is required.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Submission on or before due date is allowed.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>Submission after due date is rejected with HTTP 400.</span>
                </li>
              </ul>
              <div className="mt-3 pt-2">
                <span className="text-xs text-slate-500 block mb-1.5 font-medium">Late submission error response:</span>
                <div className="bg-rose-50/90 rounded-xl p-3.5 border border-rose-200 font-mono text-xs text-rose-900 font-bold">
                  {`{
  "error": "Late submissions are not allowed"
}`}
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Required Test Coverage */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-cyan-300 transition-colors space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold block">Verification Matrix</span>
                  <h3 className="text-base font-bold text-slate-900">Required Test Coverage</h3>
                </div>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 tabular-nums">
                9 Mandatory Scenarios
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                'Required course code',
                'Empty course code',
                'Marks below 1',
                'Marks above 100',
                'Course filtering',
                'Case-insensitive filtering',
                'Late submission',
                'Missing assignment ID',
                'Error response format',
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 flex items-center gap-2.5 text-xs font-mono text-slate-800 font-bold hover:border-cyan-300 hover:bg-cyan-50/30 transition-all shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
