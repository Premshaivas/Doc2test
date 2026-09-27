import React, { useState } from 'react';
import { TRACEABILITY_MATRIX } from '../../data/initialData';
import {
  ShieldCheck,
  CheckCircle2,
  Bug,
  GitBranch,
  CheckCheck,
  Filter,
  FileSpreadsheet,
  Download,
} from 'lucide-react';

export const CompliancePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'all',
    'Validation',
    'Functional behavior',
    'Business rule',
    'Error handling',
    'API contract',
  ];

  const filteredMatrix = TRACEABILITY_MATRIX.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.evidence.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleExportCsv = () => {
    const headers = 'ID,Requirement,Category,Related Endpoint,Test Evidence,Final Status\n';
    const rows = TRACEABILITY_MATRIX.map(
      (r) => `"${r.id}","${r.requirement}","${r.category}","${r.endpoint}","${r.evidence}","${r.status}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'doc2test_compliance_matrix.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verification Protocol: 100% Attested
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Compliance &amp; Traceability Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
            Deterministic mapping between formal written requirements, test evidence probes, and API endpoints.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-900 border border-slate-300/90 rounded-xl text-xs font-bold font-mono transition-all self-start sm:self-auto shadow-xs hover:border-cyan-400 cursor-pointer min-h-[40px]"
        >
          <Download className="w-3.5 h-3.5 text-cyan-600" />
          <span>Export Traceability (CSV)</span>
        </button>
      </div>

      {/* Four Impact Metric Cards */}
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
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold tabular-nums">
              Remediated
            </span>
          </div>
          <div className="text-xs text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">Original Defects Tracked</span>
            Isolated from initial buggy codebase
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:border-cyan-400 hover:shadow-cyan-500/5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-bold">Synthesized Probes</span>
            <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200/80 text-cyan-600">
              <GitBranch className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2.5">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-cyan-700 tabular-nums">3</span>
            <span className="text-xs font-mono text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200 font-bold tabular-nums">
              Edge Cases
            </span>
          </div>
          <div className="text-xs text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">Regression Tests Added</span>
            Covering empty inputs &amp; case sensitivity
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:border-cyan-400 hover:shadow-cyan-500/5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-bold">Test Suite Volume</span>
            <div className="p-2 rounded-lg bg-sky-50 border border-sky-200/80 text-sky-600">
              <CheckCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2.5">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums">18</span>
            <span className="text-xs font-mono text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 font-bold tabular-nums">
              18/18 Executed
            </span>
          </div>
          <div className="text-xs text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">Final Automated Tests</span>
            Complete invariant test coverage
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:border-emerald-400 hover:shadow-emerald-500/5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-bold">Verdict</span>
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2.5">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-600 tabular-nums">All Passed</span>
          </div>
          <div className="text-xs text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">Final Test Status</span>
            100% Pass Rate across all endpoints
          </div>
        </div>
      </div>

      {/* Before / After Comparison Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-cyan-300 transition-colors space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block mb-1">Comparative Analysis</span>
            <h2 className="text-lg font-bold text-slate-900">Before vs. After Workflow Comparison</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Direct impact of the Doc2Test Guardian automated audit and test synthesis workflow.
            </p>
          </div>
          <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200 self-start sm:self-auto">
            Validation Delta
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 font-mono text-xs uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3 px-4">Metric</th>
                <th className="py-3 px-4">Before Workflow</th>
                <th className="py-3 px-4">After Workflow</th>
                <th className="py-3 px-4 text-right">Verification Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-mono text-xs">
              <tr className="hover:bg-cyan-50/20 transition-colors">
                <td className="py-3.5 px-4 font-sans font-bold text-slate-900">Existing Tests</td>
                <td className="py-3.5 px-4 text-slate-600 tabular-nums">15</td>
                <td className="py-3.5 px-4 text-cyan-700 font-bold tabular-nums">18</td>
                <td className="py-3.5 px-4 text-right text-emerald-700 font-bold tabular-nums">+3 regression tests</td>
              </tr>
              <tr className="hover:bg-cyan-50/20 transition-colors">
                <td className="py-3.5 px-4 font-sans font-bold text-slate-900">Missing Coverage</td>
                <td className="py-3.5 px-4 text-rose-600 font-bold">3 gaps</td>
                <td className="py-3.5 px-4 text-emerald-700 font-bold">0 gaps</td>
                <td className="py-3.5 px-4 text-right text-emerald-700 font-bold">100% gap closure</td>
              </tr>
              <tr className="hover:bg-cyan-50/20 transition-colors">
                <td className="py-3.5 px-4 font-sans font-bold text-slate-900">Requirement Review</td>
                <td className="py-3.5 px-4 text-slate-500 font-sans">Manual (Ad-hoc)</td>
                <td className="py-3.5 px-4 text-cyan-700 font-bold font-sans">Automated</td>
                <td className="py-3.5 px-4 text-right text-cyan-700 font-bold">Continuous auditing</td>
              </tr>
              <tr className="hover:bg-cyan-50/20 transition-colors">
                <td className="py-3.5 px-4 font-sans font-bold text-slate-900">Compliance Evidence</td>
                <td className="py-3.5 px-4 text-slate-500 font-sans">Incomplete</td>
                <td className="py-3.5 px-4 text-emerald-700 font-bold font-sans">Before/after reports</td>
                <td className="py-3.5 px-4 text-right text-emerald-700 font-bold">Attestation ready</td>
              </tr>
              <tr className="hover:bg-cyan-50/20 transition-colors bg-emerald-50/30">
                <td className="py-3.5 px-4 font-sans font-bold text-slate-900">Final Test Status</td>
                <td className="py-3.5 px-4 text-slate-600 tabular-nums">15/15 baseline passed</td>
                <td className="py-3.5 px-4 text-emerald-700 font-bold tabular-nums">18/18 passed</td>
                <td className="py-3.5 px-4 text-right text-emerald-700 font-bold">Zero regressions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Requirements Traceability Matrix Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-cyan-300 transition-colors space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block">Traceability Specification</span>
                <h2 className="text-lg font-bold text-slate-900">Requirements Traceability Matrix</h2>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Live mapping of clauses, validation rules, endpoints, and regression test evidence.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Category filter pills */}
            <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
              <Filter className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1 shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-600 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search filter input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requirement clause, endpoint, or evidence..."
            className="w-full sm:max-w-md px-3.5 py-2 rounded-xl bg-white border border-slate-300/90 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
          />
          <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200 shrink-0 self-start sm:self-auto tabular-nums">
            Showing {filteredMatrix.length} of {TRACEABILITY_MATRIX.length} clauses
          </span>
        </div>

        {/* Traceability Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left text-sm min-w-[760px]">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 font-mono text-xs uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="py-3.5 px-4.5">Requirement</th>
                <th className="py-3.5 px-4.5">Category</th>
                <th className="py-3.5 px-4.5">Related Endpoint</th>
                <th className="py-3.5 px-4.5">Test Evidence</th>
                <th className="py-3.5 px-4.5 text-right">Final Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-mono text-xs">
              {filteredMatrix.map((item) => (
                <tr key={item.id} className="hover:bg-cyan-50/20 transition-colors">
                  <td className="py-4 px-4.5 font-sans text-sm text-slate-900 font-bold">
                    <div className="space-y-1">
                      <div>{item.requirement}</div>
                      <div className="text-[11px] font-mono text-cyan-700 font-bold">{item.id}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4.5">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-4.5">
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-cyan-50 text-cyan-800 font-bold border border-cyan-200">
                      {item.endpoint}
                    </span>
                  </td>
                  <td className="py-4 px-4.5 text-slate-600 font-sans text-xs leading-relaxed">
                    {item.evidence}
                  </td>
                  <td className="py-4 px-4.5 text-right">
                    <span className="inline-flex items-center gap-1.5 font-bold px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs shadow-2xs">
                      <span>✓</span>
                      <span>Compliant</span>
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
