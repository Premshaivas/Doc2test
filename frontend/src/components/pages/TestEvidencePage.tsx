import React, { useState } from 'react';
import { useApi } from '../../context/ApiContext';
import { TEST_SCENARIOS } from '../../data/initialData';
import {
  CheckCircle2,
  Play,
  RotateCw,
  Search,
  Filter,
  Flame,
  CheckCheck,
  AlertTriangle,
  FolderCheck,
} from 'lucide-react';

interface TestEvidencePageProps {
  onOpenTestModal: () => void;
}

export const TestEvidencePage: React.FC<TestEvidencePageProps> = ({ onOpenTestModal }) => {
  const { isTestRunning, testRunSummary } = useApi();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['all', 'Validation', 'Functional behavior', 'Business rule', 'Error handling', 'API contract'];

  const filteredTests = TEST_SCENARIOS.filter((t) => {
    const matchesCat = filterCategory === 'all' || t.category === filterCategory;
    const matchesSearch =
      t.scenario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.testFunction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold mb-2">
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            Automated Pytest Execution Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Test Evidence &amp; Verification Artifacts
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
            Complete inventory of automated verification probes, closed regression gaps, and execution timings.
          </p>
        </div>

        {/* Run Test Suite Action Button */}
        <button
          onClick={onOpenTestModal}
          disabled={isTestRunning}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 active:scale-98 font-bold text-sm transition-all shadow-xs hover:shadow-cyan-600/20 self-start sm:self-auto disabled:opacity-50 cursor-pointer min-h-[42px]"
        >
          {isTestRunning ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Simulating Pytest...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Test Suite</span>
            </>
          )}
        </button>
      </div>

      {/* Success Notification Banner if run completed */}
      {testRunSummary && (
        <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 flex items-center justify-center shrink-0 text-emerald-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-950">{testRunSummary}</p>
              <p className="text-xs text-emerald-800 font-mono mt-1 tabular-nums">
                ======================= 18 passed in 1.24s =======================
              </p>
            </div>
          </div>
          <button
            onClick={onOpenTestModal}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-cyan-800 border border-slate-300/90 text-xs font-mono font-bold transition-all shadow-xs hover:border-cyan-400 cursor-pointer self-start sm:self-auto"
          >
            View Terminal Output
          </button>
        </div>
      )}

      {/* Evidence Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:border-cyan-400 hover:shadow-cyan-500/5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-bold">Suite Volume</span>
            <div className="p-2 rounded-lg bg-sky-50 border border-sky-200/80 text-sky-600">
              <FolderCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2.5">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums">18</span>
            <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-bold tabular-nums">Total Probes</span>
          </div>
          <div className="text-xs text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">Total Tests</span>
            15 baseline + 3 regression invariants
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:border-emerald-400 hover:shadow-emerald-500/5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-bold">Passed Suite</span>
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2.5">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-600 tabular-nums">18</span>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold tabular-nums">
              100%
            </span>
          </div>
          <div className="text-xs text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">Passed Tests</span>
            All scenarios asserted cleanly
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-bold">Defect Residuals</span>
            <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2.5">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums">0</span>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold tabular-nums">
              Zero Failures
            </span>
          </div>
          <div className="text-xs text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">Failed Tests</span>
            No unhandled regressions
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:border-cyan-400 hover:shadow-cyan-500/5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-bold">Remediation</span>
            <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200/80 text-cyan-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2.5">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-cyan-700 tabular-nums">3</span>
            <span className="text-xs font-mono text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200 font-bold tabular-nums">
              Fortified
            </span>
          </div>
          <div className="text-xs text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">Coverage Gaps Closed</span>
            Empty code, marks &lt; 1, case filter
          </div>
        </div>
      </div>

      {/* Tests Table Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-cyan-300 transition-colors space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block mb-1">Execution Telemetry</span>
            <h2 className="text-lg font-bold text-slate-900">Automated Test Scenario Evidence</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Verified test scenarios demonstrating requirement compliance across all API endpoints.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
              <Filter className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1 shrink-0" />
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilterCategory(c)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    filterCategory === c
                      ? 'bg-cyan-600 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search test scenario or function name..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-300/90 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
            />
          </div>

          <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200 shrink-0 self-start sm:self-auto tabular-nums">
            {filteredTests.length} of {TEST_SCENARIOS.length} tests listed
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left text-sm min-w-[760px]">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 font-mono text-xs uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3.5 px-4.5">Test Scenario</th>
                <th className="py-3.5 px-4.5">Category</th>
                <th className="py-3.5 px-4.5">Endpoint</th>
                <th className="py-3.5 px-4.5">Test Function</th>
                <th className="py-3.5 px-4.5 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-mono text-xs">
              {filteredTests.map((test) => (
                <tr key={test.id} className="hover:bg-cyan-50/20 transition-colors">
                  <td className="py-4 px-4.5 font-sans text-sm text-slate-900 font-bold">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>{test.scenario}</span>
                      {test.isRegressionGap && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-900 border border-cyan-300 font-bold">
                          Gap Closed
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4.5">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {test.category}
                    </span>
                  </td>
                  <td className="py-4 px-4.5 text-cyan-800 font-bold">
                    <span className="px-2.5 py-1 rounded-md bg-cyan-50 border border-cyan-200">
                      {test.endpoint}
                    </span>
                  </td>
                  <td className="py-4 px-4.5 text-slate-500 font-mono text-xs truncate max-w-xs" title={test.testFunction}>
                    {test.testFunction}
                  </td>
                  <td className="py-4 px-4.5 text-right">
                    <span className="inline-flex items-center gap-1.5 font-bold px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs shadow-2xs">
                      <span>✓</span>
                      <span>Passed</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
