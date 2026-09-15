import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { EngineeringDecision } from '../types/api';
import { DEMO_DECISIONS } from '../services/mockData';
import {
  FileCheck2,
  Filter,
  Search,
  CheckCircle2,
  Shield,
  Layers,
  Sparkles,
  HelpCircle,
  Cpu
} from 'lucide-react';

export const DecisionLog: React.FC = () => {
  const [decisions, setDecisions] = useState<EngineeringDecision[]>(DEMO_DECISIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function fetchDecisions() {
      const data = await apiService.getDecisions();
      setDecisions(data);
    }
    fetchDecisions();
  }, []);

  const categories = ['ALL', 'Dataset & Architecture', 'Model & Retrieval', 'Policy & Safety', 'Evaluation & Infra'];

  const filteredDecisions = decisions.filter((d) => {
    const matchesCategory = selectedCategory === 'ALL' || d.category === selectedCategory;
    const matchesSearch =
      d.decision.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.trade_off.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.alternative_considered.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Architectural Decision Records (ADRs)
            </h1>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
              12 Engineering Decisions
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Formal documentation of key architectural trade-offs, rationale, and rejected alternatives across dataset curation, RAG retrieval, Groq backend isolation, and the Policy Engine.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>Standard:</span>
          <span className="text-slate-200 font-bold">RFC / ADR Format</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search decisions or keywords..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Decisions List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDecisions.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3.5 shadow-sm"
          >
            {/* Top row: Number, Title, Category, Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-start sm:items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-indigo-400 flex-shrink-0">
                  #{item.number}
                </span>
                <h3 className="text-sm font-bold text-white">
                  {item.decision}
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold">
                  {item.status}
                </span>
              </div>
            </div>

            {/* Content: Reason, Trade-off, Alternative Considered */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Reason */}
              <div className="space-y-1.5 p-3.5 rounded-lg bg-slate-950 border border-slate-800/60">
                <div className="font-mono text-[10px] text-indigo-400 uppercase font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Decision Rationale
                </div>
                <p className="text-slate-300 font-sans leading-relaxed">
                  {item.reason}
                </p>
              </div>

              {/* Trade-off */}
              <div className="space-y-1.5 p-3.5 rounded-lg bg-slate-950 border border-slate-800/60">
                <div className="font-mono text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  Engineering Trade-off
                </div>
                <p className="text-slate-300 font-sans leading-relaxed">
                  {item.trade_off}
                </p>
              </div>

              {/* Alternative Considered */}
              <div className="space-y-1.5 p-3.5 rounded-lg bg-slate-950 border border-slate-800/60">
                <div className="font-mono text-[10px] text-rose-400 uppercase font-bold flex items-center gap-1.5">
                  <Layers className="w-3 h-3" />
                  Alternative Considered & Rejected
                </div>
                <p className="text-slate-300 font-sans leading-relaxed">
                  {item.alternative_considered}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
