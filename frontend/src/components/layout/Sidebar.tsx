import React from 'react';
import { PageId } from '../../types';
import { useApi } from '../../context/ApiContext';
import {
  Home,
  Terminal,
  ShieldCheck,
  FileCode,
  CheckCircle2,
  FileSpreadsheet,
  Workflow,
  Server,
  Zap,
  RotateCcw,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResetModal: () => void;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenResetModal }) => {
  const { activePage, setActivePage, useMockData, baseUrl, connectionStatus } = useApi();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'playground', label: 'API Playground', icon: Terminal, badge: 'Interactive' },
    { id: 'compliance', label: 'Compliance Dashboard', icon: ShieldCheck, badge: '7 Rules' },
    { id: 'requirements', label: 'Requirements Explorer', icon: FileCode },
    { id: 'evidence', label: 'Test Evidence', icon: CheckCircle2, badge: '18/18' },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'about', label: 'About the Workflow', icon: Workflow },
  ];

  const handleNavClick = (pageId: PageId) => {
    setActivePage(pageId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex flex-col">
          <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-600 p-0.5 shadow-xs flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-cyan-600" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-base tracking-tight text-slate-900">
                  Doc2Test
                </span>
                <span className="font-mono text-[10px] text-cyan-700 tracking-wider uppercase font-bold">
                  Guardian Suite
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-cyan-50/90 text-cyan-950 font-bold border-l-4 border-cyan-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-cyan-700' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 tabular-nums ${
                        isActive
                          ? 'bg-cyan-200/80 text-cyan-950 border border-cyan-300/80'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Gateway & Control Panel */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 space-y-3">
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs hover:border-cyan-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-600" />
                Target Engine
              </span>
              <span
                className={`inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold border ${
                  connectionStatus === 'connected'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : connectionStatus === 'connecting'
                    ? 'bg-cyan-50 border-cyan-200 text-cyan-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    connectionStatus === 'connected'
                      ? 'bg-emerald-600 animate-pulse'
                      : connectionStatus === 'connecting'
                      ? 'bg-cyan-600 animate-spin'
                      : 'bg-rose-600'
                  }`}
                />
                {useMockData
                  ? 'Mock Mode'
                  : connectionStatus === 'connected'
                  ? 'Live API'
                  : connectionStatus === 'connecting'
                  ? 'Connecting'
                  : 'Offline'}
              </span>
            </div>
            <div className="font-mono text-[11px] text-slate-800 font-medium truncate" title={baseUrl}>
              {baseUrl}
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-cyan-600 shrink-0" />
              <span className="truncate">{useMockData ? 'Local State Activated' : 'Remote FastAPI Gateway'}</span>
            </div>
          </div>

          <button
            onClick={onOpenResetModal}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900 border border-slate-200/90 transition-colors shadow-xs cursor-pointer min-h-[40px]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </aside>
    </>
  );
};
