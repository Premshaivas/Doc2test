import React, { useState } from 'react';
import { ApiProvider, useApi } from './context/ApiContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HomePage } from './components/pages/HomePage';
import { PlaygroundPage } from './components/pages/PlaygroundPage';
import { CompliancePage } from './components/pages/CompliancePage';
import { RequirementsPage } from './components/pages/RequirementsPage';
import { TestEvidencePage } from './components/pages/TestEvidencePage';
import { ReportsPage } from './components/pages/ReportsPage';
import { AboutPage } from './components/pages/AboutPage';
import { TerminalModal } from './components/common/TerminalModal';
import { ConfirmationModal } from './components/common/ConfirmationModal';

const MainContent: React.FC = () => {
  const { activePage, resetDemoData } = useApi();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleConfirmReset = () => {
    resetDemoData();
    setResetModalOpen(false);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onOpenTestModal={() => setTestModalOpen(true)} />;
      case 'playground':
        return <PlaygroundPage onOpenResetModal={() => setResetModalOpen(true)} />;
      case 'compliance':
        return <CompliancePage />;
      case 'requirements':
        return <RequirementsPage />;
      case 'evidence':
        return <TestEvidencePage onOpenTestModal={() => setTestModalOpen(true)} />;
      case 'reports':
        return <ReportsPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage onOpenTestModal={() => setTestModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-cyan-100 selection:text-cyan-900">
      {/* Left Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onOpenResetModal={() => setResetModalOpen(true)}
      />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Header
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenTestModal={() => setTestModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#F8FAFC]">
          {renderActivePage()}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Doc2Test Guardian</span>
            <span className="text-slate-300">·</span>
            <span>Transforming requirements into verified API behavior</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span>IBM Bob Workflow Protocol</span>
            <span className="text-slate-300">·</span>
            <span className="text-cyan-700 font-semibold">pytest 7.4.3</span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <TerminalModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
      />

      <ConfirmationModal
        isOpen={resetModalOpen}
        title="Reset Demo Data?"
        message="This will restore all assignments and submissions back to the initial seeded test fixtures (Machine Learning Assignment, Python Lab, AI Lab). Any newly created assignments or test submissions will be cleared."
        confirmLabel="Confirm Reset"
        onConfirm={handleConfirmReset}
        onCancel={() => setResetModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ApiProvider>
      <MainContent />
    </ApiProvider>
  );
}
