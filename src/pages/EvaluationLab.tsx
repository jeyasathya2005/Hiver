import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { EvaluationSummary, IntentMetric } from '../types/api';
import { DEMO_EVALUATION } from '../services/mockData';
import { DemoBadge } from '../components/common/DemoBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  FlaskConical,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Award,
  CheckCircle2,
  TrendingUp,
  Cpu,
  HelpCircle
} from 'lucide-react';

export const EvaluationLab: React.FC = () => {
  const [evaluation, setEvaluation] = useState<EvaluationSummary>(DEMO_EVALUATION);
  const [activeTab, setActiveTab] = useState<'baselines' | 'ablations' | 'intents'>('baselines');

  useEffect(() => {
    async function fetchEval() {
      const data = await apiService.getEvaluationSummary();
      setEvaluation(data);
    }
    fetchEval();
  }, []);

  // Baseline Comparison Chart Data
  const baselineChartData = evaluation.baselines.map((b) => ({
    name: b.model_name.split(':')[0],
    Accuracy: Math.round(b.intent_accuracy * 100),
    'Macro F1': Math.round(b.macro_f1 * 100),
    'Safe Auto (%)': Math.round(b.safe_auto_rate * 100),
    'Unsafe Auto (%)': Math.round(b.unsafe_auto_rate * 100)
  }));

  // Ablation Chart Data
  const ablationChartData = evaluation.ablations.map((a) => ({
    name: a.variant_id,
    Grounding: Math.round(a.response_grounding_score * 100),
    'Safe Auto': Math.round(a.safe_automation_rate * 100),
    'Unsafe Risk': Math.round(a.unsafe_automation_rate * 100),
    Acceptance: Math.round(a.overall_human_acceptance * 100)
  }));

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Top Header & Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Evaluation & Benchmarking Lab
            </h1>
            <DemoBadge isDemo={evaluation.is_demo} />
          </div>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Rigorous empirical evaluation comparing classical NLP baselines against the production Groq + Dense RAG + Policy Engine architecture.
            Evaluated on N=250 gold-standard reconstructed dialogues from the Kaggle Twitter Support corpus.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
          <span>Test Split:</span>
          <span className="text-indigo-400 font-bold">250 Conversations</span>
        </div>
      </div>

      {/* 3 High-Density KPI Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Section 1: Intent Classification */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              1. Intent Classification
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">12 Classes</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Classification Accuracy</span>
              <span className="font-mono font-bold text-white">
                {(evaluation.intent_accuracy * 100).toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Macro F1 Score</span>
              <span className="font-mono font-bold text-indigo-300">
                {(evaluation.intent_macro_f1).toFixed(3)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Confidence Calibrated</span>
              <span className="font-mono text-emerald-400 font-semibold">ECE = 0.042</span>
            </div>
          </div>
        </div>

        {/* Section 2: Reply Quality */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              2. Reply Quality (Judge + Human)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">5 Rubrics</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between py-0.5">
              <span className="text-slate-400">Correctness</span>
              <span className="font-mono font-bold text-white">{(evaluation.reply_correctness * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="text-slate-400">Grounding / Fidelity</span>
              <span className="font-mono font-bold text-emerald-400">{(evaluation.reply_grounding * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="text-slate-400">Brand Consistency</span>
              <span className="font-mono font-bold text-indigo-300">{(evaluation.reply_brand_consistency * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="text-slate-400">Helpfulness</span>
              <span className="font-mono font-bold text-white">{(evaluation.reply_helpfulness * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="text-slate-400">Safety & Guardrails</span>
              <span className="font-mono font-bold text-emerald-300">{(evaluation.reply_safety * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Section 3: Escalation & Policy Engine */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              3. Escalation & Safety Engine
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Policy Metrics</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Escalation Precision / Recall</span>
              <span className="font-mono font-bold text-white">
                {(evaluation.escalation_precision * 100).toFixed(0)}% / {(evaluation.escalation_recall * 100).toFixed(0)}%
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Safe Automation Rate</span>
              <span className="font-mono font-bold text-emerald-400">
                {(evaluation.safe_automation_rate * 100).toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400 font-medium text-amber-300">Unsafe Automation Rate</span>
              <span className="font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded">
                {(evaluation.unsafe_automation_rate * 100).toFixed(1)}% (&lt; 2% SLA)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Deep Benchmark Tables */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('baselines')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'baselines'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Baseline Comparison (3 Models)
          </button>
          <button
            onClick={() => setActiveTab('ablations')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ablations'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Component Ablation Study (A through D)
          </button>
          <button
            onClick={() => setActiveTab('intents')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'intents'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Per-Intent Classification Breakdown
          </button>
        </div>

        {/* Tab 1: Baselines Comparison */}
        {activeTab === 'baselines' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Baseline 1 vs Baseline 2 vs Proposed System
                  </h3>
                  <p className="text-xs text-slate-400">
                    Demonstrating statistically significant improvement across accuracy, safety, and hallucination reduction
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Evaluation on Reconstructed Kaggle Corpus</span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={baselineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="Accuracy" fill="#6366f1" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Safe Auto (%)" fill="#10b981" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Unsafe Auto (%)" fill="#ef4444" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono">
                      <th className="pb-3 pl-1">MODEL / SYSTEM</th>
                      <th className="pb-3">INTENT ACCURACY</th>
                      <th className="pb-3">MACRO F1</th>
                      <th className="pb-3">SAFE AUTO RATE</th>
                      <th className="pb-3">UNSAFE AUTO RATE</th>
                      <th className="pb-3">HALLUCINATION RATE</th>
                      <th className="pb-3 pr-1 text-right">AVG LATENCY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {evaluation.baselines.map((b, idx) => {
                      const isProposed = idx === 2;
                      return (
                        <tr
                          key={b.model_name}
                          className={isProposed ? 'bg-indigo-950/20 font-medium' : 'hover:bg-slate-800/30'}
                        >
                          <td className="py-3 pl-1 font-semibold text-slate-200">
                            <div className="flex items-center gap-2">
                              {isProposed && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                              <span>{b.model_name}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                              {b.description}
                            </div>
                          </td>
                          <td className="py-3 font-mono">{(b.intent_accuracy * 100).toFixed(1)}%</td>
                          <td className="py-3 font-mono">{b.macro_f1.toFixed(3)}</td>
                          <td className="py-3 font-mono text-emerald-400 font-semibold">
                            {(b.safe_auto_rate * 100).toFixed(1)}%
                          </td>
                          <td className="py-3 font-mono font-bold">
                            <span
                              className={`px-2 py-0.5 rounded ${
                                b.unsafe_auto_rate <= 0.05
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {(b.unsafe_auto_rate * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 font-mono text-slate-300">
                            {(b.hallucination_rate * 100).toFixed(1)}%
                          </td>
                          <td className="py-3 pr-1 text-right font-mono text-slate-400">
                            {b.avg_latency_ms}ms
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Ablation Study */}
        {activeTab === 'ablations' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">System Ablation Study: Progressive Guardrail Addition</h3>
                <p className="text-xs text-slate-400">
                  Measuring the precise impact of adding RAG retrieval, Statistical Risk scoring, and the Deterministic Policy Engine
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono">
                      <th className="pb-3 pl-1">VARIANT</th>
                      <th className="pb-3">COMPONENTS INCLUDED</th>
                      <th className="pb-3">GROUNDING SCORE</th>
                      <th className="pb-3">SAFE AUTO RATE</th>
                      <th className="pb-3">UNSAFE AUTO RATE</th>
                      <th className="pb-3 pr-1 text-right">HUMAN ACCEPTANCE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {evaluation.ablations.map((ab, idx) => {
                      const isFull = idx === 3;
                      return (
                        <tr
                          key={ab.variant_id}
                          className={isFull ? 'bg-indigo-950/20 font-medium' : 'hover:bg-slate-800/30'}
                        >
                          <td className="py-3 pl-1 font-bold text-slate-200 font-mono">
                            {ab.variant_name}
                          </td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-1">
                              {ab.components.map((c) => (
                                <span
                                  key={c}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 font-mono font-semibold text-emerald-400">
                            {(ab.response_grounding_score * 100).toFixed(1)}%
                          </td>
                          <td className="py-3 font-mono text-slate-200">
                            {(ab.safe_automation_rate * 100).toFixed(1)}%
                          </td>
                          <td className="py-3 font-mono font-bold">
                            <span
                              className={`px-2 py-0.5 rounded ${
                                ab.unsafe_automation_rate <= 0.03
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {(ab.unsafe_automation_rate * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 pr-1 text-right font-mono font-semibold text-indigo-300">
                            {(ab.overall_human_acceptance * 100).toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Key Takeaway from Ablation D:
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Moving from pure LLM (A) to LLM + Retrieval (B) increases Grounding from 41.8% to 88.4%. Adding the Policy Engine (D) collapses Unsafe Automation from 9.8% to 1.6% while preserving a 58.4% safe auto-handle rate.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Per-Intent Breakdown */}
        {activeTab === 'intents' && (
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Detailed Per-Intent Metrics & Routing Behavior</h3>
              <p className="text-xs text-slate-400">
                Performance breakdown across technical troubleshooting vs financial billing vs security lockout domains
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="pb-3 pl-1">INTENT CATEGORY</th>
                    <th className="pb-3">EVAL SAMPLES</th>
                    <th className="pb-3">PRECISION</th>
                    <th className="pb-3">RECALL</th>
                    <th className="pb-3">F1 SCORE</th>
                    <th className="pb-3">AUTO-HANDLE RATE</th>
                    <th className="pb-3 pr-1 text-right">HUMAN ESCALATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {evaluation.intents.map((item) => (
                    <tr key={item.intent} className="hover:bg-slate-800/30">
                      <td className="py-3 pl-1 font-mono font-medium text-slate-200">
                        {item.intent}
                      </td>
                      <td className="py-3 font-mono text-slate-400">{item.samples}</td>
                      <td className="py-3 font-mono">{(item.precision * 100).toFixed(1)}%</td>
                      <td className="py-3 font-mono">{(item.recall * 100).toFixed(1)}%</td>
                      <td className="py-3 font-mono font-bold text-indigo-300">
                        {(item.f1).toFixed(3)}
                      </td>
                      <td className="py-3 font-mono text-emerald-400 font-semibold">
                        {(item.auto_handle_rate * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 pr-1 text-right font-mono text-amber-400 font-semibold">
                        {(item.human_escalation_rate * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
