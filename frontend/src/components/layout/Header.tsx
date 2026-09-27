import React from 'react';
import { useApi } from '../../context/ApiContext';
import { Menu, Play, CheckCircle2, Database, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  onOpenTestModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar, onOpenTestModal }) => {
  const { activePage, useMockData, connectionStatus, isTestRunning } = useApi();

  const getPageTitle = () => {
    switch (activePage) {
      case 'home':
        return 'Overview & Architecture';
      case 'playground':
        return 'API Playground';
      case 'compliance':
        return 'Compliance Dashboard';
      case 'requirements':
        return 'Requirements Explorer';
      case 'evidence':
        return 'Test Evidence';
      case 'reports':
        return 'Compliance Reports';
      case 'about':
        return 'Agent Workflow & Use Cases';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 md:px-8 flex items-center justify-between shadow-xs transition-colors">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-500"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-500 font-mono font-medium shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
            <span>Doc2Test Guardian</span>
          </div>
          <span className="text-slate-300 hidden sm:inline" aria-hidden="true">/</span>
          <span className="font-extrabold text-slate-900 tracking-tight truncate">
            {getPageTitle()}
          </span>
        </div>
      </div>

      {/* Right: Actions and Status Badges */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mock/Live status badge */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 border border-slate-200/90 text-xs font-mono">
          <Database className="w-3.5 h-3.5 text-cyan-600" />
          <span className="text-slate-700 font-semibold">
            {useMockData
              ? 'Mock Mode'
              : connectionStatus === 'connected'
              ? 'FastAPI Connected'
              : connectionStatus === 'connecting'
              ? 'Connecting...'
              : 'FastAPI Offline'}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              useMockData || connectionStatus === 'connected'
                ? 'bg-emerald-500 ring-2 ring-emerald-100'
                : connectionStatus === 'connecting'
                ? 'bg-cyan-500 animate-spin ring-2 ring-cyan-100'
                : 'bg-rose-500 ring-2 ring-rose-100'
            }`}
          />
        </div>

        {/* Global Run Test Suite CTA */}
        <button
          onClick={onOpenTestModal}
          disabled={isTestRunning}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-700 active:scale-98 transition-all shadow-xs hover:shadow-cyan-600/20 border border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
        >
          {isTestRunning ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Tests</span>
            </>
          )}
        </button>

        {/* Clear status badge */}
        <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold tabular-nums">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>18/18 Tests Green</span>
        </div>
      </div>
    </header>
  );
};
