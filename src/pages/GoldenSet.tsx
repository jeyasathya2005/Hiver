import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { GoldenSetItem, DecisionType } from '../types/api';
import { DEMO_GOLDEN_SET } from '../services/mockData';
import { DecisionBadge } from '../components/common/DecisionBadge';
import { DemoBadge } from '../components/common/DemoBadge';
import {
  ListChecks,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Star,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Eye,
  Hash
} from 'lucide-react';

export const GoldenSet: React.FC = () => {
  const [items, setItems] = useState<GoldenSetItem[]>(DEMO_GOLDEN_SET);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [intentFilter, setIntentFilter] = useState<string>('ALL');
  const [correctnessFilter, setCorrectnessFilter] = useState<string>('ALL');
  const [escalationFilter, setEscalationFilter] = useState<string>('ALL');
  const [ratingFilter, setRatingFilter] = useState<string>('ALL');
  const [failureModeFilter, setFailureModeFilter] = useState<string>('ALL');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  useEffect(() => {
    async function loadGoldenSet() {
      const data = await apiService.getGoldenSet();
      setItems(data);
    }
    loadGoldenSet();
  }, []);

  // Filter options
  const uniqueIntents = Array.from(new Set(items.map((i) => i.expected_intent)));
  const uniqueFailures = Array.from(new Set(items.map((i) => i.failure_mode).filter(Boolean)));

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.customer_message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.generated_reply.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIntent = intentFilter === 'ALL' || item.expected_intent === intentFilter;
    const matchesCorrectness =
      correctnessFilter === 'ALL' ||
      (correctnessFilter === 'CORRECT' && item.is_correct) ||
      (correctnessFilter === 'INCORRECT' && !item.is_correct);

    const matchesEscalation =
      escalationFilter === 'ALL' ||
      (escalationFilter === 'AUTO_HANDLE' && item.agent_decision === 'AUTO_HANDLE') ||
      (escalationFilter === 'HUMAN_ESCALATION' && item.agent_decision === 'HUMAN_ESCALATION');

    const matchesRating =
      ratingFilter === 'ALL' ||
      (ratingFilter === '5' && item.human_rating === 5) ||
      (ratingFilter === '4' && item.human_rating === 4) ||
      (ratingFilter === 'LOW' && item.human_rating <= 3);

    const matchesFailure =
      failureModeFilter === 'ALL' || item.failure_mode === failureModeFilter;

    return (
      matchesSearch &&
      matchesIntent &&
      matchesCorrectness &&
      matchesEscalation &&
      matchesRating &&
      matchesFailure
    );
  });

  const correctCount = items.filter((i) => i.is_correct).length;
  const accuracyPct = Math.round((correctCount / items.length) * 100);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Golden Set & Human Review Audit Suite
            </h1>
            <DemoBadge isDemo={true} />
          </div>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Inspect the hand-labelled benchmark conversations separated strictly from the RAG retrieval index.
            Compare human annotator ratings vs LLM-as-a-judge scores, intent predictions, and policy escalation alignment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Golden Corpus:</span>{' '}
            <span className="text-indigo-400 font-bold">250 Reconstructed Dialogues</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <span>Overall Accuracy:</span>{' '}
            <span className="font-bold">{accuracyPct}%</span>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search golden set customer tweets, response texts, or IDs..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
          {/* Intent Filter */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
              Intent
            </label>
            <select
              value={intentFilter}
              onChange={(e) => setIntentFilter(e.target.value)}
              className="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All Intents ({uniqueIntents.length})</option>
              {uniqueIntents.map((intent) => (
                <option key={intent} value={intent}>
                  {intent}
                </option>
              ))}
            </select>
          </div>

          {/* Correctness Filter */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
              Outcome
            </label>
            <select
              value={correctnessFilter}
              onChange={(e) => setCorrectnessFilter(e.target.value)}
              className="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All Outcomes</option>
              <option value="CORRECT">Correct (Matches Human)</option>
              <option value="INCORRECT">Incorrect (Failure Flagged)</option>
            </select>
          </div>

          {/* Escalation Filter */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
              Agent Decision
            </label>
            <select
              value={escalationFilter}
              onChange={(e) => setEscalationFilter(e.target.value)}
              className="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All Decisions</option>
              <option value="AUTO_HANDLE">AUTO-HANDLE</option>
              <option value="HUMAN_ESCALATION">HUMAN ESCALATION</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
              Human Rating
            </label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All Ratings</option>
              <option value="5">5 Stars (Flawless)</option>
              <option value="4">4 Stars (Acceptable)</option>
              <option value="LOW">≤ 3 Stars (Suboptimal)</option>
            </select>
          </div>

          {/* Failure Mode Filter */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
              Failure Mode
            </label>
            <select
              value={failureModeFilter}
              onChange={(e) => setFailureModeFilter(e.target.value)}
              className="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All Cases</option>
              {uniqueFailures.map((fm) => (
                <option key={fm as string} value={fm as string}>
                  {fm}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Golden Set Table / Card Grid */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
          <span>Showing {filteredItems.length} of {items.length} test conversations</span>
          <span className="font-mono">Separated from Retrieval Index (Zero Data Leakage)</span>
        </div>

        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isExpanded = expandedItemId === item.id;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border text-xs transition-all ${
                  item.is_correct
                    ? 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-indigo-400">
                      #{item.id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
                        item.is_correct
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {item.is_correct ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {item.is_correct ? 'CORRECT' : 'FAILURE'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Human & Judge Ratings */}
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className="flex items-center text-amber-400 gap-0.5" title="Human Annotator Rating">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>H: {item.human_rating}/5</span>
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="flex items-center text-indigo-300 gap-0.5" title="LLM-as-a-Judge Rating">
                        <Star className="w-3 h-3 fill-indigo-400" />
                        <span>J: {item.judge_rating}/5</span>
                      </span>
                    </div>

                    <DecisionBadge decision={item.agent_decision} size="sm" showRisk={false} />
                  </div>
                </div>

                {/* Customer Message */}
                <div className="mt-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800/60 text-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
                    Customer Tweet:
                  </span>
                  <p className="font-sans leading-relaxed">"{item.customer_message}"</p>
                </div>

                {/* Intent & Action Comparisons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/50">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Intent Classification:
                    </span>
                    <div className="mt-1 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400">Exp:</span>{' '}
                        <span className="font-mono text-slate-300">{item.expected_intent}</span>
                      </div>
                      <span className="text-slate-500">→</span>
                      <div>
                        <span className="text-slate-400">Pred:</span>{' '}
                        <span
                          className={`font-mono font-semibold ${
                            item.intent_match ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {item.predicted_intent}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/50">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Policy Decision Action:
                    </span>
                    <div className="mt-1 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400">Exp:</span>{' '}
                        <span className="font-mono text-slate-300">{item.expected_action}</span>
                      </div>
                      <span className="text-slate-500">→</span>
                      <div>
                        <span className="text-slate-400">Act:</span>{' '}
                        <span
                          className={`font-mono font-semibold ${
                            item.action_match ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {item.agent_decision}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expand Toggle */}
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-900">
                  {item.failure_mode ? (
                    <span className="text-[11px] text-rose-400 font-mono flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Failure: {item.failure_mode}
                    </span>
                  ) : (
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Grounding Verified (IDs: {item.grounding_evidence_ids.join(', ')})
                    </span>
                  )}

                  <button
                    onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    {isExpanded ? 'Hide Generated Reply' : 'Inspect Generated Reply'}
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* Expanded Reply & Notes */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Generated Support Reply:
                      </span>
                      <p className="font-sans leading-relaxed">"{item.generated_reply}"</p>
                    </div>

                    {item.notes && (
                      <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200">
                        <span className="font-bold">Annotator Audit Note: </span>
                        {item.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
