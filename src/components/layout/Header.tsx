import React from 'react';
import { useApiStatus } from '../../hooks/useApiStatus';
import { RefreshCw, Radio, Server, Database, ChevronDown } from 'lucide-react';
import { DEMO_BRAND } from '../../services/mockData';

interface HeaderProps {
  onNavigateToSettings: () => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateToSettings,
  selectedBrand,
  onSelectBrand
}) => {
  const { isConnected, baseUrl, isChecking, refreshStatus } = useApiStatus();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md text-slate-200">
      {/* Left: Brand Identity & Kaggle Corpus Context */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-bold shadow-md shadow-indigo-950/50">
            H
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">
                Hiver Support AI Copilot
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 rounded">
                SDE Intern Take-Home
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Kaggle Twitter Customer Support</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">{DEMO_BRAND.total_conversations.toLocaleString()} Dialogues</span>
            </div>
          </div>
        </div>

        {/* Brand Selector Dropdown */}
        <div className="hidden lg:flex items-center pl-4 border-l border-slate-800">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Target Corpus:</span>
            <div className="relative inline-flex items-center">
              <select
                value={selectedBrand}
                onChange={(e) => onSelectBrand(e.target.value)}
                className="bg-transparent font-semibold text-indigo-300 cursor-pointer pr-5 appearance-none focus:outline-none"
              >
                <option value="AppleSupport">@AppleSupport (106k conversations)</option>
                <option value="AmazonHelp">@AmazonHelp (54k conversations)</option>
                <option value="Delta">@Delta (28k conversations)</option>
                <option value="Uber_Support">@Uber_Support (31k conversations)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Center: Core Architectural Principle Banner */}
      <div className="hidden xl:flex items-center px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs shadow-inner">
        <span className="text-slate-400 mr-2 font-mono text-[11px] uppercase tracking-wider">Core Principle:</span>
        <span className="text-indigo-300 font-medium">The LLM proposes;</span>
        <span className="text-slate-500 mx-1.5">|</span>
        <span className="text-emerald-400 font-semibold">the policy engine decides.</span>
      </div>

      {/* Right: API Connectivity Status & Tools */}
      <div className="flex items-center gap-3">
        {/* Python FastAPI Status Pill */}
        <div
          onClick={onNavigateToSettings}
          className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
            isConnected
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/60'
              : 'bg-amber-950/30 border-amber-500/30 text-amber-300 hover:bg-amber-950/50'
          }`}
          title={`Backend target: ${baseUrl}. Click to inspect configuration & FastAPI schema.`}
        >
          <span className="relative flex h-2 w-2">
            {isConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            )}
          </span>

          <span className="font-mono font-medium">
            {isConnected ? 'Python API Connected' : 'Python API Offline — Demo Mode'}
          </span>

          <Server className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
        </div>

        {/* Re-check Ping button */}
        <button
          onClick={() => refreshStatus()}
          disabled={isChecking}
          title="Ping backend /api/health"
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-indigo-400' : ''}`} />
        </button>
      </div>
    </header>
  );
};
