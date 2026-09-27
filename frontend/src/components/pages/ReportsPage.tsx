import React, { useState } from 'react';
import { REPORT_BEFORE_MARKDOWN, REPORT_AFTER_MARKDOWN } from '../../data/initialData';
import {
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  FileX,
  RefreshCw,
  GitCompare,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');
  const [copied, setCopied] = useState(false);
  const [simulateEmptyState, setSimulateEmptyState] = useState(false);

  const currentContent = activeTab === 'before' ? REPORT_BEFORE_MARKDOWN : REPORT_AFTER_MARKDOWN;
  const currentFilename =
    activeTab === 'before' ? 'compliance_report_before.md' : 'compliance_report_after.md';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-semibold mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-600" />
            Audit Certification Reports
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Before &amp; After Compliance Reports
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Comparative verification artifacts documenting defect remediation, gap closure, and verified API rules.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setSimulateEmptyState(!simulateEmptyState)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 shadow-xs transition-colors"
            title="Demonstrate empty-state UI handling"
          >
            {simulateEmptyState ? 'Show Reports' : 'Simulate Empty State'}
          </button>

          {!simulateEmptyState && (
            <>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-mono transition-colors shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copied' : 'Copy Report'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 font-bold text-xs font-mono transition-all shadow-sm shadow-cyan-600/25"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs Switcher: Before vs. After */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 gap-3 pb-0">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <button
            onClick={() => {
              setActiveTab('before');
              setSimulateEmptyState(false);
            }}
            className={`px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'before'
                ? 'border-rose-500 text-rose-800 bg-rose-50/60'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Before Compliance Report</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 border border-rose-200 font-bold tabular-nums">
              Baseline
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('after');
              setSimulateEmptyState(false);
            }}
            className={`px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'after'
                ? 'border-emerald-500 text-emerald-800 bg-emerald-50/60'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>After Compliance Report</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold tabular-nums">
              18/18 Verified
            </span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-slate-500 pb-2">
          <GitCompare className="w-4 h-4 text-cyan-600" />
          <span>Commit Diff: Baseline → Guardian Synthesized</span>
        </div>
      </div>

      {/* Empty State Design (Optional Toggle or Missing State) */}
      {simulateEmptyState ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 mx-auto shadow-xs">
            <FileX className="w-7 h-7 text-slate-400" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">Report Temporarily Unavailable</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No signed compliance artifact is currently cached for this view. Run the test suite or click below to reload default attestation data.
            </p>
          </div>
          <button
            onClick={() => setSimulateEmptyState(false)}
            className="px-4 py-2 bg-cyan-600 text-white hover:bg-cyan-700 font-bold text-xs rounded-lg inline-flex items-center gap-2 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore Compliance Report</span>
          </button>
        </div>
      ) : activeTab === 'before' ? (
        /* Before Compliance Report View */
        <div className="bg-white border border-rose-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-rose-400 transition-colors space-y-8 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 font-bold block mb-1">
                Pre-Remediation Baseline
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Compliance Report — Before</h2>
            </div>
            <span className="font-mono text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
              Target: student_assignment_tracker_buggy.py
            </span>
          </div>

          {/* Section 1: Baseline */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">01</span>
              <h3 className="text-lg font-bold text-slate-900">Baseline Assessment</h3>
            </div>
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-5 space-y-2.5">
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-600 font-bold">•</span>
                  <span>Existing test suite: <strong className="text-slate-900 font-mono font-bold">15/15 passed</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-cyan-600 font-bold">•</span>
                  <span>Existing happy-path coverage was present.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>Three additional coverage gaps were identified.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2: Original Requirement Violations */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">02</span>
              <h3 className="text-lg font-bold text-slate-900">Original Requirement Violations</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'courseCode was optional', impact: 'Allowed anonymous or course-less assignments' },
                { label: 'maxMarks accepted values above 100', impact: 'Violated academic grading maximum constraints' },
                { label: 'Course filtering was ignored', impact: 'Returned all assignments regardless of query parameter' },
                { label: 'Late submissions were accepted', impact: 'Permitted submissions past the deadline timestamp' },
              ].map((v, i) => (
                <div key={i} className="bg-slate-50/80 border border-rose-200 rounded-xl p-4.5 space-y-1.5 hover:border-rose-400 hover:bg-rose-50/30 transition-all">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{v.label}</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-6 leading-relaxed">{v.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Coverage Gaps Identified */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">03</span>
              <h3 className="text-lg font-bold text-slate-900">Coverage Gaps Identified</h3>
            </div>
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-5 space-y-2.5">
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Empty <code className="text-cyan-800 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">courseCode</code> rejection.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><code className="text-cyan-800 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">maxMarks</code> lower than 1 rejection.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Case-insensitive <code className="text-cyan-800 font-mono font-bold bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">courseCode</code> filtering.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* After Compliance Report View */
        <div className="bg-white border border-emerald-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-emerald-400 transition-colors space-y-8 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 font-bold mb-1.5">
                Post-Guardian Verification
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Compliance Report — After</h2>
            </div>
            <span className="font-mono text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-bold flex items-center gap-1.5 self-start sm:self-auto">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              All Requirements Attested
            </span>
          </div>

          {/* Section 1: Final Validation */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">1</span>
              <span>Final Validation</span>
            </h3>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-2 hover:border-cyan-200 transition-colors">
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Final test suite: <strong className="text-emerald-700 font-bold">18/18 passed</strong> in <span className="font-mono tabular-nums">1.24s</span>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Three regression tests were added.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>All required scenarios are covered.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2: Verified Requirements */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">2</span>
              <span>Verified Requirements</span>
            </h3>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-3 hover:border-cyan-200 transition-colors">
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><code className="text-cyan-800 font-mono text-xs bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded font-semibold">courseCode</code> is required and non-empty.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><code className="text-cyan-800 font-mono text-xs bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded font-semibold">maxMarks</code> is restricted to 1–100.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Course filtering works correctly.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Course filtering ignores uppercase/lowercase differences.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Late submissions are rejected.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>API errors use consistent schema:</span>
                </li>
              </ul>

              <div className="pl-6 pt-1">
                <div className="bg-white rounded-lg p-3 border border-slate-200 font-mono text-xs text-slate-900 font-medium shadow-2xs">
                  {`{
  "error": "message"
}`}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Impact */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">3</span>
              <span>Impact</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { title: 'Traceability', text: 'Requirement-to-test traceability improved.' },
                { title: 'Quality Assurance', text: 'Regression risk reduced.' },
                { title: 'Efficiency', text: 'Manual review effort reduced.' },
                { title: 'Attestation', text: 'Compliance evidence available for QA and reviewers.' },
              ].map((imp, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4.5 flex items-start gap-3.5 hover:border-cyan-300 transition-colors">
                  <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 border border-emerald-200">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{imp.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{imp.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
