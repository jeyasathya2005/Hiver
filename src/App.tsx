import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, PageId } from './components/layout/Sidebar';
import { CommandCenter } from './pages/CommandCenter';
import { LiveAgent } from './pages/LiveAgent';
import { EvidenceExplorer } from './pages/EvidenceExplorer';
import { EvaluationLab } from './pages/EvaluationLab';
import { FailureAnalysis } from './pages/FailureAnalysis';
import { DecisionLog } from './pages/DecisionLog';
import { GoldenSet } from './pages/GoldenSet';
import { Settings } from './pages/Settings';
import { AgentAnalysisResponse } from './types/api';
import { useApiStatus } from './hooks/useApiStatus';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('command-center');
  const [selectedBrand, setSelectedBrand] = useState<string>('AppleSupport');
  const [liveAgentInitialQuery, setLiveAgentInitialQuery] = useState<string | undefined>(undefined);
  const [evidenceAnalysisData, setEvidenceAnalysisData] = useState<AgentAnalysisResponse | null>(null);

  const { isConnected } = useApiStatus();

  // Navigation callbacks
  const handleNavigateToLiveAgent = (initialQuery?: string) => {
    setLiveAgentInitialQuery(initialQuery);
    setActivePage('live-agent');
  };

  const handleNavigateToEvidence = () => {
    setActivePage('evidence-explorer');
  };

  const handleNavigateToEvidenceWithData = (analysis: AgentAnalysisResponse) => {
    setEvidenceAnalysisData(analysis);
    setActivePage('evidence-explorer');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Header
        onNavigateToSettings={() => setActivePage('settings')}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
      />

      {/* Main App Body with Fixed Sidebar & Fluid Scrollable Content */}
      <div className="flex-1 flex flex-row overflow-hidden">
        <Sidebar
          activePage={activePage}
          onSelectPage={setActivePage}
          isBackendConnected={isConnected}
        />

        <main className="flex-1 overflow-y-auto bg-slate-950 min-h-[calc(100vh-61px)]">
          {activePage === 'command-center' && (
            <CommandCenter
              onNavigateToAgent={handleNavigateToLiveAgent}
              onNavigateToEvidence={handleNavigateToEvidence}
            />
          )}

          {activePage === 'live-agent' && (
            <LiveAgent
              initialMessage={liveAgentInitialQuery}
              onNavigateToEvidenceWithData={handleNavigateToEvidenceWithData}
            />
          )}

          {activePage === 'evidence-explorer' && (
            <EvidenceExplorer currentAnalysis={evidenceAnalysisData} />
          )}

          {activePage === 'evaluation-lab' && <EvaluationLab />}

          {activePage === 'failure-analysis' && <FailureAnalysis />}

          {activePage === 'decision-log' && <DecisionLog />}

          {activePage === 'golden-set' && <GoldenSet />}

          {activePage === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}
