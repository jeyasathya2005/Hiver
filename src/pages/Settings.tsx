import React, { useState } from 'react';
import { useApiStatus } from '../hooks/useApiStatus';
import { DemoBadge } from '../components/common/DemoBadge';
import {
  Settings as SettingsIcon,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Database,
  Cpu,
  Shield,
  FileCode2,
  Copy,
  Check,
  ExternalLink,
  Flame
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { isConnected, baseUrl, healthData, isChecking, refreshStatus, updateBaseUrl } =
    useApiStatus();

  const [inputUrl, setInputUrl] = useState<string>(baseUrl);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const handleSaveUrl = () => {
    updateBaseUrl(inputUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(label);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/health',
      description: 'System health, backend runtime status, model name, and vector DB size',
      sampleResponse: `{
  "status": "ok",
  "backend": "Python FastAPI v0.111.0",
  "version": "1.2.0-takehome",
  "groq_status": "connected",
  "groq_model": "llama-3.3-70b-versatile",
  "retrieval_engine": "FAISS (all-MiniLM-L6-v2)",
  "vector_index_size": 84200
}`
    },
    {
      method: 'GET',
      path: '/api/brand',
      description: 'Brand metadata, corpus dialogue counts, and active technical intents',
      sampleResponse: `{
  "brand_id": "AppleSupport",
  "brand_name": "Apple Support",
  "handle": "@AppleSupport",
  "total_conversations": 106123,
  "reconstructed_dialogues": 84200,
  "intents_count": 12
}`
    },
    {
      method: 'POST',
      path: '/api/agent/analyze',
      description: 'Primary agent pipeline: Intent classification + RAG retrieval + Groq reply + Policy Engine verdict',
      sampleRequest: `{
  "message": "My refund has not arrived yet",
  "conversation_id": null
}`,
      sampleResponse: `{
  "conversation_id": "conv-sim-8812",
  "intent": "refund_not_received",
  "intent_confidence": 0.92,
  "retrieved_cases": [
    {
      "conversation_id": "123",
      "customer_message": "Where is my refund?",
      "brand_response": "Your refund has been processed...",
      "resolution": "refund_processed",
      "similarity": 0.87
    }
  ],
  "draft_reply": "I'm sorry for the delay...",
  "decision": "AUTO_HANDLE",
  "decision_reason": "High confidence and strong historical resolution evidence.",
  "risk_level": "LOW",
  "policy_verdict": "APPROVED_FOR_AUTO_SEND",
  "processing_time_ms": 312
}`
    },
    {
      method: 'POST',
      path: '/api/agent/approve',
      description: 'Agent dispatch confirmation: Logs human approval and marks ticket resolved',
      sampleRequest: `{
  "conversation_id": "conv-sim-8812",
  "reply": "I'm sorry for the delay..."
}`,
      sampleResponse: `{
  "success": true,
  "message": "Reply for conversation conv-sim-8812 dispatched successfully",
  "timestamp": "2026-09-15T15:30:00Z"
}`
    },
    {
      method: 'POST',
      path: '/api/agent/escalate',
      description: 'Transfers ticket to Tier-2 / Tier-3 human agent queue with audit trail',
      sampleRequest: `{
  "conversation_id": "conv-sim-8813",
  "reason": "Customer threat of legal dispute"
}`,
      sampleResponse: `{
  "success": true,
  "queue": "Tier-2 Technical & Escalation Support",
  "timestamp": "2026-09-15T15:30:00Z"
}`
    },
    {
      method: 'GET',
      path: '/api/evaluation/summary',
      description: 'Evaluation benchmarks, baseline comparisons, and ablation experiments',
      sampleResponse: `{
  "brand_id": "AppleSupport",
  "intent_accuracy": 0.884,
  "safe_automation_rate": 0.584,
  "unsafe_automation_rate": 0.016,
  "baselines": [...],
  "ablations": [...]
}`
    },
    {
      method: 'GET',
      path: '/api/decisions',
      description: '10-15 Architectural Decision Records (ADRs) with rationale and trade-offs',
      sampleResponse: `[
  {
    "id": "dec-1",
    "number": 1,
    "decision": "Single Brand Focus: Selected @AppleSupport",
    "reason": "...",
    "trade_off": "...",
    "alternative_considered": "..."
  }
]`
    },
    {
      method: 'GET',
      path: '/api/golden-set',
      description: 'Hand-labelled golden benchmark conversations for human & judge review',
      sampleResponse: `[
  {
    "id": "GS-001",
    "customer_message": "...",
    "expected_intent": "battery_drain_issue",
    "agent_decision": "AUTO_HANDLE",
    "human_rating": 5,
    "judge_rating": 5,
    "is_correct": true
  }
]`
    }
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Settings & Backend Environment Status
            </h1>
            <DemoBadge isDemo={!isConnected} />
          </div>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Configure the Python FastAPI connection endpoint, inspect active model/vector engine status, and explore the standardized REST API contracts.
          </p>
        </div>

        <button
          onClick={() => refreshStatus()}
          disabled={isChecking}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
          {isChecking ? 'Pinging /api/health...' : 'Test Backend Connection'}
        </button>
      </div>

      {/* Backend Connection Card */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Python FastAPI Backend Target</h3>
              <p className="text-xs text-slate-400">
                Environment variable: <span className="font-mono text-indigo-300">VITE_API_BASE_URL</span>
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${
              isConnected
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-950 text-amber-300 border-amber-500/30'
            }`}
          >
            {isConnected ? '● Connected to FastAPI' : '○ Offline — Running in Demo Mode'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="http://localhost:8000"
            className="flex-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSaveUrl}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            {saveSuccess ? 'Saved & Testing!' : 'Save & Reconnect'}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          When the Python backend is offline or during frontend development, the application operates in <strong>Graceful Demo Mode</strong> using pre-curated Kaggle Twitter Customer Support dialogues without throwing unhandled exceptions.
        </p>
      </div>

      {/* System Infrastructure Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Spec 1: Brand */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
          <div className="text-slate-400 font-mono text-[10px] uppercase">Selected Brand Corpus</div>
          <div className="font-bold text-white text-sm">@AppleSupport</div>
          <p className="text-slate-400 text-[11px]">
            106,123 tweets from Kaggle "Customer Support on Twitter" dataset.
          </p>
        </div>

        {/* Spec 2: LLM & Provider */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
          <div className="text-slate-400 font-mono text-[10px] uppercase">Model Provider & Name</div>
          <div className="font-bold text-indigo-300 text-sm">LLaMA-3.3-70B (Groq)</div>
          <p className="text-slate-400 text-[11px]">
            Backend-isolated Groq API. Zero client-side API key exposure.
          </p>
        </div>

        {/* Spec 3: Retrieval Engine */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
          <div className="text-slate-400 font-mono text-[10px] uppercase">Vector Retrieval Store</div>
          <div className="font-bold text-emerald-400 text-sm">FAISS / ChromaDB</div>
          <p className="text-slate-400 text-[11px]">
            all-MiniLM-L6-v2 embeddings on reconstructed dialogue turns.
          </p>
        </div>

        {/* Spec 4: Firebase / App DB */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
          <div className="text-slate-400 font-mono text-[10px] uppercase">Database / State Tier</div>
          <div className="font-bold text-amber-300 text-sm flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Operational State Only</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Application logs only. Kaggle dataset is not uploaded to Firestore.
          </p>
        </div>
      </div>

      {/* FastAPI API Contract & Schema Reference */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              Standardized Python FastAPI REST API Contracts
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">8 Endpoints Specified</span>
        </div>

        <p className="text-xs text-slate-400">
          Implement these endpoints in your FastAPI <code className="text-indigo-300">main.py</code> to connect directly with this UI. All parameters and response schemas match 1-to-1 with <code className="text-indigo-300">src/types/api.ts</code>.
        </p>

        <div className="space-y-4">
          {apiEndpoints.map((ep) => (
            <div
              key={ep.path}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                      ep.method === 'POST'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono font-bold text-slate-200">{ep.path}</span>
                </div>

                <button
                  onClick={() => copyToClipboard(ep.sampleResponse, ep.path)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 transition-colors"
                >
                  {copiedEndpoint === ep.path ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copiedEndpoint === ep.path ? 'Copied JSON' : 'Copy Sample Response'}
                </button>
              </div>

              <p className="text-slate-400 text-[11px] font-sans">{ep.description}</p>

              {ep.sampleRequest && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    Sample JSON Request Body:
                  </span>
                  <pre className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                    {ep.sampleRequest}
                  </pre>
                </div>
              )}

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Expected JSON Response Schema:
                </span>
                <pre className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300/90 overflow-x-auto">
                  {ep.sampleResponse}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
