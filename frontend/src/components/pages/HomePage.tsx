import React from 'react';
import { useApi } from '../../context/ApiContext';
import {
  ShieldAlert,
  ShieldCheck,
  Bug,
  GitPullRequest,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  FileCode,
  Search,
  Cpu,
  Terminal,
  FileCheck,
  Play,
} from 'lucide-react';

interface HomePageProps {
  onOpenTestModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenTestModal }) => {
  const { setActivePage } = useApi();

  const workflowSteps = [
    {
      title: 'Requirements Document',
      desc: 'Parses written specification markdown and formal constraint clauses.',
      icon: FileCode,
      code: 'assignment_api_requirements.md',
    },
    {
      title: 'Requirements Analyst',
      desc: 'Extracts endpoints, field rules, validation limits, and business logic.',
      icon: Search,
      code: 'AST & Criteria Extraction',
    },
    {
      title: 'Code Auditor + Test Engineer',
      desc: 'Compares implemented API routes against documented expectations.',
      icon: Cpu,
      code: 'Behavioral Discrepancy Audit',
    },
    {
      title: 'Regression Tests',
      desc: 'Synthesizes missing edge cases, empty values, and boundary assertions.',
      icon: GitPullRequest,
      code: '3 Invariants Synthesized',
    },
    {
      title: 'pytest Validation',
      desc: 'Executes automated suite against runtime endpoints with full assertions.',
      icon: Terminal,
      code: '18/18 Passed in 1.24s',
    },
    {
      title: 'Compliance Reports',
      desc: 'Generates traceable before-and-after audit reports and signed verification proofs.',
      icon: FileCheck,
      code: 'Audit Sign-Off Ready',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50 to-cyan-50/50 p-6 sm:p-10 border border-slate-200/90 shadow-xs hover:border-cyan-300 transition-colors">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-50 border border-cyan-200/90 text-cyan-800 text-xs font-mono font-bold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
            Hackathon Developer Suite &amp; Compliance Engine
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
            Doc2Test <span className="text-cyan-600">Guardian</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl text-balance">
            Transform requirements into tested, traceable, and verified API behavior.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => setActivePage('playground')}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 active:scale-98 font-bold text-sm sm:text-base transition-all shadow-xs hover:shadow-cyan-600/20 cursor-pointer"
            >
              <span>Open API Playground</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenTestModal}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-800 hover:text-slate-900 hover:bg-slate-50 border border-slate-300/90 font-semibold text-sm transition-all shadow-xs hover:border-cyan-400 cursor-pointer"
            >
              <Play className="w-4 h-4 text-cyan-600 fill-current" />
              <span>Simulate Pytest Run</span>
            </button>

            <button
              onClick={() => setActivePage('compliance')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-800 hover:text-slate-900 hover:bg-slate-50 border border-slate-300/90 font-semibold text-sm transition-all shadow-xs hover:border-cyan-400 cursor-pointer"
            >
              <span>View Compliance Matrix</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 bottom-4 opacity-5 hidden lg:block pointer-events-none">
          <ShieldCheck className="w-64 h-64 text-cyan-600" />
        </div>
      </div>

      {/* Problem & Solution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Card */}
        <div className="bg-white border border-rose-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-rose-400 transition-colors">
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-rose-600 font-bold block">Defect Risk</span>
                <h2 className="text-lg font-bold text-slate-900">The Problem</h2>
              </div>
            </div>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              “Developers often manually compare business requirements, source code, and tests. This is slow and can miss validation rules, business logic, and edge cases.”
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-100" />
            <span>Legacy bottleneck: Undetected contract drift &amp; manual review errors</span>
          </div>
        </div>

        {/* Solution Card */}
        <div className="bg-white border border-emerald-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-emerald-400 transition-colors">
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold block">Automated Invariants</span>
                <h2 className="text-lg font-bold text-slate-900">The Solution</h2>
              </div>
            </div>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              “Doc2Test Guardian uses an agentic workflow to extract requirements, audit implementation behavior, identify missing tests, validate fixes, and create compliance evidence.”
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <span>Continuous verification: Traceable, reproducible, and verifiable</span>
          </div>
        </div>
      </div>

      {/* Four Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:border-cyan-400 hover:shadow-cyan-500/5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-bold">Defect Baseline</span>
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-500">
              <Bug className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2.5">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums">4</span>
            <span className="text-xs font-mono text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 font-bold tabular-nums">
              Isolated
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Original Bugs Tracked</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Found in initial buggy baseline code</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:border-cyan-400 hover:shadow-cyan-500/5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-bold">Synthesis Delta</span>
            <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200/80 text-cyan-600">
              <GitPullRequest className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2.5">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-cyan-700 tabular-nums">3</span>
            <span className="text-xs font-mono text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200 font-bold tabular-nums">
              +20% Coverage
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Coverage Gaps Closed</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Automated regression tests injected</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:border-emerald-400 hover:shadow-emerald-500/5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-bold">Deterministic Health</span>
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2.5">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-600 tabular-nums">18/18</span>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold tabular-nums">
              100% Green
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Tests Passed</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Automated pytest suite clean</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:border-cyan-400 hover:shadow-cyan-500/5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-bold">Specification Scope</span>
            <div className="p-2 rounded-lg bg-sky-50 border border-sky-200/80 text-sky-600">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2.5">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums">9</span>
            <span className="text-xs font-mono text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 font-bold tabular-nums">
              Verified
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Required Scenarios Covered</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">End-to-end API specification rules</p>
          </div>
        </div>
      </div>

      {/* Visual Workflow Timeline */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-cyan-300 transition-colors space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 font-bold block mb-1">Architecture Pipeline</span>
            <h2 className="text-xl font-bold text-slate-900">Visual Workflow Timeline</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              From unformatted business requirements to automated regression testing and compliance sign-off
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200 self-start sm:self-auto">
            Autonomous Pipeline
          </span>
        </div>

        {/* Interactive Steps Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 sm:p-4.5 flex flex-col justify-between hover:border-cyan-400 hover:bg-cyan-50/30 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] font-bold text-cyan-800 bg-cyan-100/70 px-2 py-0.5 rounded border border-cyan-200 tabular-nums">
                      STEP {idx + 1}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug mb-1.5">{step.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{step.desc}</p>
                </div>
                <div className="pt-2.5 border-t border-slate-200">
                  <span className="font-mono text-[10px] text-slate-500 block truncate" title={step.code}>
                    {step.code}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Launch Callout */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs hover:border-cyan-300 transition-colors">
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 font-bold block">Developer Console</span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">Ready to test live operations?</h3>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Interact with the Student Assignment Tracker API, create assignments, filter courses, and test late-submission validation.
          </p>
        </div>
        <button
          onClick={() => setActivePage('playground')}
          className="px-6 py-3 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 font-bold text-sm whitespace-nowrap transition-all shadow-xs hover:shadow-cyan-600/20 cursor-pointer shrink-0"
        >
          Open API Playground
        </button>
      </div>
    </div>
  );
};
