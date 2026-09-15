import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import {
  BrandInfo,
  EvaluationSummary,
  RecentDecisionItem
} from '../types/api';
import { DEMO_BRAND, DEMO_EVALUATION, DEMO_RECENT_DECISIONS } from '../services/mockData';
import { DecisionBadge } from '../components/common/DecisionBadge';
import { DemoBadge } from '../components/common/DemoBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Bot,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  Database,
  ExternalLink
} from 'lucide-react';

interface CommandCenterProps {
  onNavigateToAgent: (initialQuery?: string) => void;
  onNavigateToEvidence: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  onNavigateToAgent,
  onNavigateToEvidence
}) => {
  const [brand, setBrand] = useState<BrandInfo>(DEMO_BRAND);
  const [evaluation, setEvaluation] = useState<EvaluationSummary>(DEMO_EVALUATION);
  const [recentDecisions, setRecentDecisions] = useState<RecentDecisionItem[]>(DEMO_RECENT_DECISIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(false);
      try {
        const [brandData, evalData] = await Promise.all([
          apiService.getBrand(),
          apiService.getEvaluationSummary()
        ]);
        setBrand(brandData);
        setEvaluation(evalData);
      } catch (err) {
        console.error('Failed to load live dashboard data, using demo corpus', err);
      }
    }
    loadDashboardData();
  }, []);

  // Prepare chart data for Automation Distribution
  const automationSplitData = [
    { name: 'Safe Auto-Handle', value: Math.round(evaluation.safe_automation_rate * 100), color: '#10b981' },
    { name: 'Human Escalation', value: Math.round(evaluation.human_escalation_rate * 100), color: '#f59e0b' },
    { name: 'Unsafe Auto Risk', value: Math.round(evaluation.unsafe_automation_rate * 100), color: '#ef4444' }
  ];

  // Prepare chart data for Intent Performance
  const intentChartData = evaluation.intents.slice(0, 6).map((item) => ({
    name: item.intent.replace(/_/g, ' ').replace('issue', '').replace('error', ''),
    samples: item.samples,
    f1Score: Math.round(item.f1 * 100),
    autoRate: Math.round(item.auto_handle_rate * 100)
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Brand Overview & Core Mandate */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">
              {brand.brand_name} Support Intelligence Console
            </span>
            <span className="text-slate-400 font-mono text-sm">({brand.handle})</span>
            <DemoBadge isDemo={evaluation.is_demo} />
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Enterprise customer support automation grounded in the Kaggle Twitter Customer Support Corpus.
            Incoming customer queries are classified, matched against verified historical resolutions, and vetted by a deterministic safety policy engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToAgent()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/50 transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            Launch Live Simulation
          </button>
          <button
            onClick={onNavigateToEvidence}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            Inspect Evidence Pipeline
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Conversations */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Historical Conversations</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {brand.total_conversations.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400">tweets reconstructed</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Reconstructed Dialogues</span>
            <span className="font-mono text-slate-300 font-semibold">{brand.reconstructed_dialogues.toLocaleString()}</span>
          </div>
        </div>

        {/* Card 2: Intent Classification */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Intent Classification Perf</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {(evaluation.intent_accuracy * 100).toFixed(1)}%
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">Macro F1: {(evaluation.intent_macro_f1).toFixed(3)}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Classified Domains</span>
            <span className="font-mono text-slate-300 font-semibold">{brand.intents_count} Technical Intents</span>
          </div>
        </div>

        {/* Card 3: Safe Automation Rate */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Safe Automation Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">
              {(evaluation.safe_automation_rate * 100).toFixed(1)}%
            </span>
            <span className="text-[11px] text-slate-400">verified closed</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Auto-Handle Volume</span>
            <span className="font-mono text-emerald-400/90 font-semibold">
              {(evaluation.auto_handle_rate * 100).toFixed(1)}% of total
            </span>
          </div>
        </div>

        {/* Card 4: Unsafe Automation Risk (Critical Safety KPI) */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Unsafe Automation Rate</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400 font-mono">
              {(evaluation.unsafe_automation_rate * 100).toFixed(1)}%
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">Target: &lt; 2.0%</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Human Escalation Rate</span>
            <span className="font-mono text-amber-300 font-semibold">
              {(evaluation.human_escalation_rate * 100).toFixed(1)}% routed
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Row: Confidence & Grounded Quality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Average Confidence Score</div>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {(evaluation.avg_confidence * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Threshold for auto-action: ≥ 85%</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Historical Grounding Score</div>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {(evaluation.reply_grounding * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Historical resolution fidelity</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Brand Voice Consistency</div>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {(evaluation.reply_brand_consistency * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Compliant with @AppleSupport style</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Bot className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Charts Row: Automation Policy Distribution & Intent F1 Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Dispatch Decision Breakdown (1 col) */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Policy Dispatch Distribution
            </h3>
            <span className="text-[11px] font-mono text-slate-400">N=250 Test Dialogues</span>
          </div>

          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={automationSplitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {automationSplitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: number) => [`${val}%`, 'Proportion']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {automationSplitData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-mono font-semibold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Intent F1 & Automation Rates (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Top Intent F1 Scores & Auto-Handle Rates</h3>
              <p className="text-xs text-slate-400">Classification precision vs autonomous deflection feasibility</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
                <span className="text-slate-300">F1 Score (%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span className="text-slate-300">Auto-Handle (%)</span>
              </div>
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="f1Score" fill="#6366f1" radius={[4, 4, 0, 0]} name="Intent F1 Score" />
                <Bar dataKey="autoRate" fill="#10b981" radius={[4, 4, 0, 0]} name="Auto-Handle Rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Agent Decisions Feed */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" />
              Recent Agent Decisions
            </h3>
            <p className="text-xs text-slate-400">
              Live audit stream of incoming customer tweets and Policy Engine dispositions
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Showing last 6 dispatches</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="pb-3 pl-1">TIME</th>
                <th className="pb-3">CUSTOMER TWEET</th>
                <th className="pb-3">INTENT</th>
                <th className="pb-3">CONFIDENCE</th>
                <th className="pb-3">POLICY DECISION</th>
                <th className="pb-3 pr-1 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {recentDecisions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 pl-1 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {item.timestamp}
                  </td>
                  <td className="py-3 max-w-md font-medium text-slate-200 truncate pr-4">
                    {item.customer_message}
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                      {item.intent}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-semibold whitespace-nowrap">
                    <span className={item.confidence >= 0.85 ? 'text-emerald-400' : 'text-amber-400'}>
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <DecisionBadge decision={item.decision} riskLevel={item.risk_level} size="sm" />
                  </td>
                  <td className="py-3 pr-1 text-right whitespace-nowrap">
                    <button
                      onClick={() => onNavigateToAgent(item.customer_message)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                    >
                      Inspect in Simulator
                      <ArrowRight className="w-3 h-3" />
                    </button>
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
