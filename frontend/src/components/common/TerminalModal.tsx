import React, { useEffect, useRef, useState } from 'react';
import { useApi } from '../../context/ApiContext';
import { CheckCircle2, Copy, Check, RotateCw, X, Terminal as TerminalIcon } from 'lucide-react';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose }) => {
  const { isTestRunning, testRunLogs, testRunSummary, runTestSuite } = useApi();
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && testRunLogs.length === 0 && !isTestRunning) {
      runTestSuite();
    }
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [testRunLogs]);

  if (!isOpen) return null;

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(testRunLogs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-3xl w-full flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh]">
        {/* Terminal Header */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-300 text-xs font-mono text-slate-700 font-medium">
              <TerminalIcon className="w-3.5 h-3.5 text-cyan-600" />
              <span>pytest — pytest -v --tb=short tests/</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLogs}
              disabled={testRunLogs.length === 0}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-200 transition-colors text-xs flex items-center gap-1 font-mono"
              title="Copy Output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => runTestSuite()}
              disabled={isTestRunning}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-200 transition-colors text-xs flex items-center gap-1 font-mono disabled:opacity-50"
              title="Re-run Test Suite"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isTestRunning ? 'animate-spin text-cyan-600' : ''}`} />
              <span className="hidden sm:inline">Re-run</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-200 transition-colors"
              title="Close Terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 bg-slate-950 font-mono text-xs text-slate-200 overflow-y-auto flex-1 space-y-1 min-h-[300px] max-h-[480px]">
          {testRunLogs.map((log, index) => {
            const isPassed = log.includes('PASSED');
            const isSummaryLine = log.includes('passed in 1.24s');
            const isHeader = log.startsWith('===') || log.startsWith('platform');

            return (
              <div
                key={index}
                className={`leading-relaxed ${
                  isPassed
                    ? 'text-slate-300'
                    : isSummaryLine
                    ? 'text-emerald-400 font-bold text-sm my-2'
                    : isHeader
                    ? 'text-slate-400'
                    : 'text-slate-300'
                }`}
              >
                {isPassed ? (
                  <div className="flex items-center justify-between hover:bg-slate-900 px-1 py-0.5 rounded">
                    <span className="truncate pr-2">
                      <span className="text-slate-400">{log.split('::')[0]}::</span>
                      <span className="text-cyan-300">{log.split('::')[1]?.split(' ')[0]}</span>
                    </span>
                    <span className="text-emerald-400 font-bold shrink-0">
                      PASSED {log.match(/\[\s*\d+%\]/)?.[0] || ''}
                    </span>
                  </div>
                ) : (
                  log
                )}
              </div>
            );
          })}
          {isTestRunning && (
            <div className="flex items-center gap-2 text-cyan-300 pt-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Executing automated regression & contract fixtures...</span>
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>

        {/* Bottom Banner (Success Notification) */}
        {testRunSummary && (
          <div className="bg-emerald-50 border-t border-emerald-200 px-5 py-3.5 flex items-center justify-between gap-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">{testRunSummary}</p>
                <p className="text-xs text-emerald-700">
                  All 12 business rules and 3 discovered regression gaps verified against AST specifications.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs rounded-lg shadow-xs transition-colors shrink-0"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
