import React from 'react';
import {
  LayoutDashboard,
  Headphones,
  GitPullRequest,
  FlaskConical,
  AlertOctagon,
  FileCheck2,
  ListChecks,
  Settings,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export type PageId =
  | 'command-center'
  | 'live-agent'
  | 'evidence-explorer'
  | 'evaluation-lab'
  | 'failure-analysis'
  | 'decision-log'
  | 'golden-set'
  | 'settings';

interface SidebarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  isBackendConnected: boolean;
}

interface NavItem {
  id: PageId;
  label: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  isBackendConnected
}) => {
  const navItems: NavItem[] = [
    {
      id: 'command-center',
      label: 'Command Center',
      icon: LayoutDashboard,
      description: 'System health, KPIs & live metrics'
    },
    {
      id: 'live-agent',
      label: 'Live Support Agent',
      badge: 'Simulation',
      icon: Headphones,
      description: 'Twitter dialogue copilot & dispatch'
    },
    {
      id: 'evidence-explorer',
      label: 'Evidence Explorer',
      badge: 'Pipeline',
      icon: GitPullRequest,
      description: 'Multi-stage RAG grounding audit'
    },
    {
      id: 'evaluation-lab',
      label: 'Evaluation Lab',
      badge: 'Baselines',
      icon: FlaskConical,
      description: 'Ablations, F1 scores & benchmarks'
    },
    {
      id: 'failure-analysis',
      label: 'Failure Analysis',
      badge: 'Top 5',
      icon: AlertOctagon,
      description: 'Failure modes, root causes & fixes'
    },
    {
      id: 'decision-log',
      label: 'Decision Log',
      badge: '12 ADRs',
      icon: FileCheck2,
      description: 'Architectural decisions & trade-offs'
    },
    {
      id: 'golden-set',
      label: 'Golden Set Review',
      badge: '250 Items',
      icon: ListChecks,
      description: 'Hand-labeled test suite & judge audits'
    },
    {
      id: 'settings',
      label: 'Settings & Status',
      icon: Settings,
      description: 'FastAPI contract, Groq & vector DB'
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between border-r border-slate-800 bg-slate-950 text-slate-300 min-h-[calc(100vh-61px)]">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
          Platform Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div className="truncate">
                  <div className="text-sm font-medium leading-none">{item.label}</div>
                  <div className={`text-[11px] mt-1 truncate ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ml-2 flex-shrink-0 ${
                    isActive
                      ? 'bg-indigo-700/80 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Information Card: FastAPI Backend Contract */}
      <div className="p-3 border-t border-slate-900">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Backend Contract
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isBackendConnected
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/30'
              }`}
            >
              {isBackendConnected ? 'FastAPI Active' : 'Mock Fallback'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            REST API endpoints configured for separate Python FastAPI + Groq LLM development.
          </p>

          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>FastAPI: v0.111</span>
            <span>Groq: LLaMA-3.3</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
