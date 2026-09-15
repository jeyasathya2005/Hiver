import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { FailureMode } from '../types/api';
import { DEMO_FAILURE_MODES } from '../services/mockData';
import { DemoBadge } from '../components/common/DemoBadge';
import {
  AlertOctagon,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Wrench,
  Sparkles,
  HelpCircle,
  FileCode2,
  CheckCircle2
} from 'lucide-react';

export const FailureAnalysis: React.FC = () => {
  const [failureModes, setFailureModes] = useState<FailureMode[]>(DEMO_FAILURE_MODES);
  const [expandedId, setExpandedId] = useState<number | null>(1);

  useEffect(() => {
    async function loadFailures() {
      const data = await apiService.getEvaluationFailures();
      setFailureModes(data);
    }
    loadFailures();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const severityColors = {
    CRITICAL: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
    HIGH: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    MEDIUM: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Failure Mode Taxonomy & Root Cause Analysis
            </h1>
            <DemoBadge isDemo={true} />
          </div>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            In-depth audit of the Top 5 production failure modes identified during evaluation on reconstructed Twitter customer support threads.
            Each failure mode includes concrete customer tweet examples, underlying systemic causes, and active Policy Engine mitigation rules.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
          <AlertOctagon className="w-4 h-4 text-amber-400" />
          <span>5 Core Modes Identified</span>
        </div>
      </div>

      {/* Summary Frequency Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {failureModes.map((fm) => (
          <button
            key={fm.id}
            onClick={() => setExpandedId(fm.id)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              expandedId === fm.id
                ? 'bg-slate-800 border-indigo-500 shadow-md'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">MODE #{fm.id}</span>
              <span className="font-bold text-amber-400">{fm.frequency_percent}%</span>
            </div>
            <div className="text-xs font-bold text-white mt-1 line-clamp-2">
              {fm.title}
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-wider font-mono text-slate-400">
              {fm.category}
            </div>
          </button>
        ))}
      </div>

      {/* Detailed Failure Mode Accordions */}
      <div className="space-y-4">
        {failureModes.map((fm) => {
          const isExpanded = expandedId === fm.id;

          return (
            <div
              key={fm.id}
              className={`rounded-xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-slate-900 border-indigo-500/50 shadow-lg'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Accordion Header */}
              <div
                onClick={() => toggleExpand(fm.id)}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-indigo-400 flex-shrink-0">
                    #{fm.id}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{fm.title}</h3>
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                          severityColors[fm.severity]
                        }`}
                      >
                        {fm.severity} SEVERITY
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      Category: {fm.category} • Share of Failures: {fm.frequency_percent}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block text-xs text-indigo-400 font-medium">
                    {isExpanded ? 'Collapse Analysis' : 'Expand Deep Dive'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Accordion Expanded Content */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-800 space-y-5 text-xs">
                  {/* Real World Example Section */}
                  <div className="space-y-3 pt-4">
                    <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Concrete Reconstructed Failure Case
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Input & Actual */}
                      <div className="space-y-3">
                        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                            Incoming Customer Tweet:
                          </span>
                          <p className="text-slate-200 font-sans leading-relaxed">
                            "{fm.customer_message}"
                          </p>
                        </div>

                        <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-500/30">
                          <span className="text-[10px] font-mono text-rose-400 uppercase block mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Actual Erroneous Behavior:
                          </span>
                          <p className="text-rose-200/90 font-sans leading-relaxed">
                            {fm.actual_behavior}
                          </p>
                        </div>
                      </div>

                      {/* Right: Expected & Hypothesis */}
                      <div className="space-y-3">
                        <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                          <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Expected Support Behavior:
                          </span>
                          <p className="text-emerald-200/90 font-sans leading-relaxed">
                            {fm.expected_behavior}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-[10px] font-mono text-indigo-400 uppercase block mb-1">
                            Diagnostic Hypothesis:
                          </span>
                          <p className="text-slate-300 font-sans leading-relaxed">
                            {fm.hypothesis}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Systemic Root Cause & Proposed Fix */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-[11px] font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        Systemic Cause:
                      </span>
                      <p className="text-slate-300 leading-relaxed font-sans">
                        {fm.likely_cause}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5" />
                        Proposed Engineering Fix:
                      </span>
                      <p className="text-slate-300 leading-relaxed font-sans">
                        {fm.proposed_fix}
                      </p>
                    </div>
                  </div>

                  {/* Policy Rule Guardrail Implementation */}
                  <div className="p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
                    <FileCode2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono font-semibold text-indigo-300 text-xs">
                        Active Policy Engine Guardrail:
                      </span>
                      <p className="text-slate-300 font-mono text-[11px] mt-0.5">
                        {fm.prevention_policy_rule}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
