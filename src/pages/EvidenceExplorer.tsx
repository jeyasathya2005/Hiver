import React, { useState } from 'react';
import { AgentAnalysisResponse, RetrievedCase } from '../types/api';
import { DEMO_PRESET_SCENARIOS } from '../services/mockData';
import { DecisionBadge } from '../components/common/DecisionBadge';
import { DemoBadge } from '../components/common/DemoBadge';
import {
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  Layers,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Bot,
  User,
  Calendar,
  Hash,
  Activity,
  FileText,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface EvidenceExplorerProps {
  currentAnalysis?: AgentAnalysisResponse | null;
}

export const EvidenceExplorer: React.FC<EvidenceExplorerProps> = ({
  currentAnalysis
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const activeData: AgentAnalysisResponse =
    currentAnalysis || DEMO_PRESET_SCENARIOS[selectedScenarioIndex].analysis;

  const steps = [
    { num: 1, title: 'Customer Message', desc: 'Raw Twitter Support Tweet' },
    { num: 2, title: 'Predicted Intent', desc: 'Classified Category & Confidence' },
    { num: 3, title: 'Retrieved Conversations', desc: 'Dense Vector Similarity Search' },
    { num: 4, title: 'Resolution Pattern', desc: 'Synthesized Brand Protocol' },
    { num: 5, title: 'Generated Reply', desc: 'Grounded LLM Support Draft' },
    { num: 6, title: 'Risk Assessment', desc: 'Safety Guardrails & Policy Checks' },
    { num: 7, title: 'Final Decision', desc: 'Policy Engine Autonomous vs Human' }
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Evidence & Grounding Explorer
            </h1>
            <DemoBadge isDemo={activeData.is_demo} />
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Audit the step-by-step causal chain explaining <span className="text-indigo-300 font-semibold">WHY</span> the system proposed a response and <span className="text-emerald-300 font-semibold">HOW</span> the Policy Engine decided between auto-handling and escalation.
          </p>
        </div>

        {/* Preset Selector if not viewing an injected live query */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Select Test Dialogue:</span>
          <select
            value={selectedScenarioIndex}
            onChange={(e) => setSelectedScenarioIndex(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {DEMO_PRESET_SCENARIOS.map((sc, idx) => (
              <option key={sc.label} value={idx}>
                {sc.label} ({sc.analysis.decision})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Horizontal Pipeline Steps Overview */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[760px] relative">
          {steps.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className="flex flex-col items-center text-center space-y-1 z-10">
                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-indigo-500/60 text-indigo-300 flex items-center justify-center font-mono text-xs font-bold shadow-md">
                  {step.num}
                </div>
                <div className="text-xs font-semibold text-slate-200">{step.title}</div>
                <div className="text-[10px] text-slate-400 max-w-[100px]">{step.desc}</div>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gradient-to-r from-indigo-500/40 to-slate-700 mx-2 mb-6" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Deep Step-by-Step Breakdown Cards */}
      <div className="space-y-6">
        {/* Step 1: Customer Message */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold">
                1
              </span>
              <h3 className="text-sm font-bold text-white">Stage 1: Incoming Customer Message</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Length: {activeData.message.length} chars</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-200 text-xs leading-relaxed font-sans">
            <span className="text-slate-400 font-mono text-[11px] block mb-1">RAW INCOMING TWEET:</span>
            "{activeData.message}"
          </div>
        </div>

        <div className="flex justify-center -my-3">
          <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-700 z-10 shadow">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Step 2: Predicted Intent */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold">
                2
              </span>
              <h3 className="text-sm font-bold text-white">Stage 2: Intent Classification & Entropy Check</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">
              Confidence: {(activeData.intent_confidence * 100).toFixed(1)}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 text-[11px]">PREDICTED INTENT LABEL</span>
              <div className="text-base font-bold font-mono text-indigo-300">
                {activeData.intent}
              </div>
              <p className="text-[11px] text-slate-400">
                Mapped to technical domain in reconstructed @AppleSupport ontology.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">CONFIDENCE VS ESCALATION THRESHOLD (85%)</span>
                <span className={`font-mono font-bold ${activeData.intent_confidence >= 0.85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {(activeData.intent_confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${activeData.intent_confidence >= 0.85 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, activeData.intent_confidence * 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>0%</span>
                <span className="text-slate-300 font-mono">Safety Gate: 85%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center -my-3">
          <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-700 z-10 shadow">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Step 3: Retrieved Historical Conversations */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold">
                3
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Stage 3: Retrieved Historical Conversations (Kaggle Twitter Corpus)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Dense embedding vector search filtered by brand and semantic context
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
              k = {activeData.retrieved_cases.length} nearest neighbors
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {activeData.retrieved_cases.map((cs, idx) => (
              <div
                key={cs.conversation_id || idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-indigo-400 flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {cs.conversation_id}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {cs.created_at ? new Date(cs.created_at).toLocaleDateString() : 'Historical'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      Category: {cs.resolution}
                    </span>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      Similarity: {(cs.similarity * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400">
                      Historical Customer Tweet:
                    </span>
                    <p className="text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed font-sans">
                      "{cs.customer_message}"
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono text-emerald-400">
                      Verified Historical @AppleSupport Resolution:
                    </span>
                    <p className="text-emerald-200/90 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/20 leading-relaxed font-sans">
                      "{cs.brand_response}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center -my-3">
          <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-700 z-10 shadow">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Step 4: Resolution Pattern */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold">
                4
              </span>
              <h3 className="text-sm font-bold text-white">Stage 4: Resolution Pattern Extraction</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Consensus Strategy</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="text-slate-300 leading-relaxed font-sans">
              <span className="font-semibold text-indigo-300">Identified Resolution Archetype: </span>
              {activeData.retrieved_cases.map(c => c.resolution).join(' → ')}
            </div>
            <p className="text-slate-400 text-[11px]">
              Extracts the verified steps taken by official human agents in historical dialogues (e.g. diagnostic inspection of Settings &gt; Battery, directing to official Apple self-service portal, or initiating private DM for account checks).
            </p>
          </div>
        </div>

        <div className="flex justify-center -my-3">
          <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-700 z-10 shadow">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Step 5: Generated Reply */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold">
                5
              </span>
              <h3 className="text-sm font-bold text-white">Stage 5: LLM Proposed Reply (Groq LLaMA-3.3-70B)</h3>
            </div>
            <span className="text-[11px] font-mono text-indigo-300">LLM Proposes</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2">
            <span className="text-slate-400 font-mono text-[11px] block">PROPOSED AGENT DRAFT:</span>
            <p className="text-slate-200 leading-relaxed font-sans">
              "{activeData.draft_reply}"
            </p>
          </div>
        </div>

        <div className="flex justify-center -my-3">
          <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-700 z-10 shadow">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Step 6: Risk Assessment */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold">
                6
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Stage 6: Policy Engine Risk & Safety Audit</h3>
                <p className="text-[11px] text-slate-400">Non-negotiable deterministic validation rules</p>
              </div>
            </div>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
              activeData.risk_level === 'LOW'
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-950/80 text-amber-400 border-amber-500/30'
            }`}>
              Assessed Risk: {activeData.risk_level}
            </span>
          </div>

          <div className="space-y-2">
            {activeData.policy_rules?.map((rule) => (
              <div
                key={rule.rule_id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  {rule.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold text-slate-200">{rule.name}</span>
                    <span className="text-slate-400 text-[11px] ml-2 font-sans">{rule.description}</span>
                  </div>
                </div>

                <div className="font-mono text-[11px]">
                  {rule.passed ? (
                    <span className="text-emerald-400 font-medium">PASSED</span>
                  ) : (
                    <span className="text-amber-400 font-bold">VIOLATION / ESCALATION</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center -my-3">
          <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-700 z-10 shadow">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Step 7: Final Decision */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold">
                7
              </span>
              <h3 className="text-base font-bold text-white">Stage 7: Final Policy Engine Decision</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400">The Policy Engine Decides</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Final Action Directive</span>
              <div>
                <DecisionBadge
                  decision={activeData.decision}
                  riskLevel={activeData.risk_level}
                  size="lg"
                />
              </div>
            </div>

            <div className="sm:max-w-md text-xs space-y-1">
              <span className="text-slate-400 font-medium">Grounding Rationale:</span>
              <p className="text-slate-300 leading-relaxed font-sans">
                {activeData.decision_reason}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
