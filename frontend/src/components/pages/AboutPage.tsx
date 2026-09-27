import React from 'react';
import { useApi } from '../../context/ApiContext';
import { AGENT_WORKFLOW_STEPS, REAL_WORLD_USE_CASES } from '../../data/initialData';
import {
  Workflow,
  Sparkles,
  Bot,
  FileSearch,
  Code2,
  TestTube2,
  Wrench,
  FileCheck,
  GraduationCap,
  Landmark,
  ShoppingCart,
  HeartPulse,
  Radio,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActivePage } = useApi();

  const stepIcons = [FileSearch, Code2, TestTube2, Wrench, FileCheck];
  const useCaseIcons = [GraduationCap, Landmark, ShoppingCart, HeartPulse, Radio];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-semibold mb-2">
          <Bot className="w-3.5 h-3.5 text-cyan-600" />
          Autonomous Agentic Architecture
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          About the Doc2Test Guardian Workflow
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          How our specialized IBM Bob agent workflow closes requirements gaps, fortifies test suites, and enforces behavioral integrity.
        </p>
      </div>

      {/* Problem & Solution Cards in Presentation Format */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <div className="bg-white border border-rose-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-rose-400 transition-colors space-y-3.5">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" />
            <span className="font-mono uppercase tracking-wider text-xs font-bold">The Core Problem</span>
          </div>
          <p className="text-base sm:text-lg text-slate-900 font-bold leading-snug">
            “Manual requirements reviews can miss business rules and edge cases.”
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
            Human code reviewers typically check happy paths and syntactic formatting, but rarely stress-test edge boundary cases (e.g. empty strings, case-insensitivity, date boundary checks).
          </p>
        </div>

        <div className="bg-white border border-emerald-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-emerald-400 transition-colors space-y-3.5">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
            <span className="font-mono uppercase tracking-wider text-xs font-bold">The Automated Solution</span>
          </div>
          <p className="text-base sm:text-lg text-slate-900 font-bold leading-snug">
            “Doc2Test Guardian connects written requirements to code behavior, regression tests, bug findings, fixes, and final compliance evidence.”
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
            By orchestrating specialized agents, Doc2Test Guardian converts static markdown documents into executable pytest suites and attestation reports automatically.
          </p>
        </div>
      </div>

      {/* Agent Workflow Cards (IBM Bob Agent Workflow) */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">The IBM Bob Agent Workflow</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Five coordinated autonomous roles operating in sequence to audit and fortify software behavior.
            </p>
          </div>
          <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-800 border border-cyan-200 self-start sm:self-auto">
            Multi-Agent Orchestration
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {AGENT_WORKFLOW_STEPS.map((agent, idx) => {
            const Icon = stepIcons[idx] || Bot;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-400 hover:shadow-xs transition-all group shadow-2xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-cyan-900 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      {agent.badge}
                    </span>
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 transition-colors" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">{agent.role}</h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {agent.description}
                  </p>
                </div>

                <div className="pt-3.5 mt-4 border-t border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5 font-bold">Output:</span>
                  <p className="text-[11px] text-cyan-800 font-mono leading-tight font-semibold">{agent.output}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-World Use Cases */}
      <div className="space-y-5">
        <div className="pb-3 border-b border-slate-200">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Real-World Enterprise Use Cases</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Doc2Test Guardian applies to any industry where business requirements must strictly govern software execution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {REAL_WORLD_USE_CASES.map((uc, i) => {
            const Icon = useCaseIcons[i] || Zap;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 flex items-start gap-4 hover:border-cyan-300 hover:shadow-xs transition-all shadow-2xs"
              >
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-cyan-700 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-800 uppercase tracking-wider">
                      {uc.domain}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{uc.rule}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed pt-0.5">{uc.impact}</p>
                </div>
              </div>
            );
          })}

          {/* Bonus Industry Card: Cloud Infrastructure */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 flex items-start gap-4 hover:border-cyan-300 hover:shadow-xs transition-all shadow-2xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <span className="font-mono text-xs font-bold text-emerald-800 uppercase tracking-wider">
                DevOps &amp; Cloud
              </span>
              <h4 className="text-sm font-bold text-slate-900">Zero-Trust API Invariants</h4>
              <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                Guarantees CI/CD deployment gates automatically block builds that fail requirement specifications.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Highlighted Final Project Pitch Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-50 via-white to-cyan-50/70 border-2 border-cyan-400 p-8 sm:p-12 shadow-xs text-center space-y-5 hover:border-cyan-500 transition-colors">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/80 border border-cyan-300 text-cyan-950 text-xs font-mono font-bold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
          The Final Project Pitch
        </div>

        <blockquote className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-relaxed">
          “Doc2Test Guardian transforms written API requirements into tested, traceable, and verified software behavior.”
        </blockquote>

        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
          Built for software teams, QA engineers, hackathon judges, and educators who demand verifiable confidence in API contracts.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setActivePage('playground')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 active:scale-98 font-bold text-sm sm:text-base transition-all shadow-sm shadow-cyan-600/25"
          >
            <span>Try the Interactive Playground</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
