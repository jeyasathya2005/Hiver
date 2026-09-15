import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import {
  AgentAnalysisResponse,
  DecisionType,
  RetrievedCase
} from '../types/api';
import { DEMO_PRESET_SCENARIOS } from '../services/mockData';
import { DecisionBadge } from '../components/common/DecisionBadge';
import { DemoBadge } from '../components/common/DemoBadge';
import {
  Send,
  Sparkles,
  Bot,
  User,
  History,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  ArrowUpRight,
  RefreshCw,
  Layers,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

interface LiveAgentProps {
  initialMessage?: string;
  onNavigateToEvidenceWithData: (analysis: AgentAnalysisResponse) => void;
}

interface MessageHistoryItem {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  text: string;
  timestamp: string;
  status?: string;
}

export const LiveAgent: React.FC<LiveAgentProps> = ({
  initialMessage,
  onNavigateToEvidenceWithData
}) => {
  const [inputText, setInputText] = useState<string>(
    initialMessage || DEMO_PRESET_SCENARIOS[0].message
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AgentAnalysisResponse | null>(
    DEMO_PRESET_SCENARIOS[0].analysis
  );
  const [isEditingReply, setIsEditingReply] = useState<boolean>(false);
  const [editedReply, setEditedReply] = useState<string>(
    DEMO_PRESET_SCENARIOS[0].analysis.draft_reply
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Simulated Conversation History Feed
  const [history, setHistory] = useState<MessageHistoryItem[]>([
    {
      id: 'm1',
      sender: 'customer',
      text: initialMessage || DEMO_PRESET_SCENARIOS[0].message,
      timestamp: '10:42 AM'
    }
  ]);

  useEffect(() => {
    if (initialMessage && initialMessage !== inputText) {
      setInputText(initialMessage);
      handleAnalyze(initialMessage);
    }
  }, [initialMessage]);

  const handleAnalyze = async (messageToAnalyze = inputText) => {
    if (!messageToAnalyze.trim()) return;
    setIsAnalyzing(true);
    setFeedbackMessage(null);
    try {
      const result = await apiService.analyzeMessage({
        message: messageToAnalyze
      });
      setAnalysis(result);
      setEditedReply(result.draft_reply);
      setIsEditingReply(false);

      // Add to conversation history
      setHistory((prev) => [
        ...prev,
        {
          id: `cust-${Date.now()}`,
          sender: 'customer',
          text: messageToAnalyze,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (scenario: typeof DEMO_PRESET_SCENARIOS[0]) => {
    setInputText(scenario.message);
    setAnalysis(scenario.analysis);
    setEditedReply(scenario.analysis.draft_reply);
    setIsEditingReply(false);
    setFeedbackMessage(null);
    setHistory((prev) => [
      ...prev,
      {
        id: `preset-${Date.now()}`,
        sender: 'customer',
        text: scenario.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleApproveAndSend = async () => {
    if (!analysis) return;
    const finalContent = isEditingReply ? editedReply : analysis.draft_reply;
    const res = await apiService.approveReply(analysis.conversation_id, finalContent);
    setFeedbackMessage(`✓ Approved & Sent: Reply dispatched to customer channel.`);
    setHistory((prev) => [
      ...prev,
      {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: finalContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Sent via Twitter Support API'
      }
    ]);
  };

  const handleManualEscalate = async () => {
    if (!analysis) return;
    const res = await apiService.escalateConversation(
      analysis.conversation_id,
      'Agent manual override for human triage'
    );
    setFeedbackMessage(`⚠️ Manually Escalated: Case transferred to ${res.queue}.`);
    setHistory((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: `Transferred to ${res.queue}. Priority SLA active.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'ESCALATED'
      }
    ]);
  };

  const handleCopy = () => {
    const textToCopy = isEditingReply ? editedReply : (analysis?.draft_reply || '');
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Title & Operational Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Live Support Agent Copilot
            </h1>
            <DemoBadge isDemo={analysis?.is_demo} />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate incoming Twitter customer queries with real-time intent classification, RAG retrieval, and Policy Engine veto.
          </p>
        </div>

        {analysis && (
          <button
            onClick={() => onNavigateToEvidenceWithData(analysis)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60 text-xs font-semibold transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            Inspect Grounding Pipeline for this Query
          </button>
        )}
      </div>

      {/* Preset Scenarios Chips */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
          Sample Kaggle Twitter Inquiries (Click to Load):
        </div>
        <div className="flex flex-wrap gap-2">
          {DEMO_PRESET_SCENARIOS.map((scenario) => (
            <button
              key={scenario.label}
              onClick={() => handleSelectPreset(scenario)}
              className="px-3 py-1.5 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-left flex items-center gap-2"
            >
              <span className={`w-2 h-2 rounded-full ${scenario.analysis.decision === 'AUTO_HANDLE' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="font-medium">{scenario.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid: Left = Customer Message & Thread; Right = Copilot Decision & Reply */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Input & Conversation Simulation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                Customer Tweet Input
              </span>
              <span className="text-[11px] font-mono text-slate-400">@AppleSupport mention</span>
            </div>

            <div className="space-y-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste an incoming Twitter support message..."
                rows={4}
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors resize-none font-sans"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  {inputText.length} chars (Twitter length limit: 280)
                </span>
                <button
                  onClick={() => handleAnalyze()}
                  disabled={isAnalyzing || !inputText.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-950/50 transition-all cursor-pointer"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  {isAnalyzing ? 'Analyzing via Policy Engine...' : 'Run Agent Analysis'}
                </button>
              </div>
            </div>
          </div>

          {/* Conversation Thread Simulation */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-400" />
                Simulated Thread Session
              </span>
              <span className="font-mono text-[11px]">{history.length} items</span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {history.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg text-xs space-y-1 ${
                    msg.sender === 'customer'
                      ? 'bg-slate-950 border border-slate-800/80 text-slate-200'
                      : msg.sender === 'agent'
                      ? 'bg-indigo-950/40 border border-indigo-500/30 text-indigo-100 ml-4'
                      : 'bg-amber-950/40 border border-amber-500/30 text-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="font-semibold text-slate-300 uppercase">
                      {msg.sender === 'customer' ? 'Customer Tweet' : msg.sender === 'agent' ? '@AppleSupport Agent' : 'System Action'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                  {msg.status && (
                    <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {msg.status}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Analysis, Historical Evidence & Policy Decision */}
        <div className="lg:col-span-7 space-y-4">
          {feedbackMessage && (
            <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
              <span>{feedbackMessage}</span>
              <button
                onClick={() => setFeedbackMessage(null)}
                className="text-emerald-400 hover:text-emerald-200 text-sm font-bold"
              >
                ×
              </button>
            </div>
          )}

          {analysis ? (
            <div className="space-y-4">
              {/* Decision Hero Card: The LLM proposes; the policy engine decides */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      Policy Engine Disposition
                    </span>
                    <div>
                      <DecisionBadge
                        decision={analysis.decision}
                        riskLevel={analysis.risk_level}
                        size="lg"
                      />
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
                    <div className="text-[11px] text-slate-400">Policy Verdict:</div>
                    <div className="font-mono text-xs font-semibold text-indigo-300">
                      {analysis.policy_verdict}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Latency: {analysis.processing_time_ms}ms
                    </div>
                  </div>
                </div>

                {/* Reason Explanation */}
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs space-y-1">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    {analysis.decision === 'AUTO_HANDLE' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>Decision Rationale:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed pl-5 font-sans">
                    {analysis.decision_reason}
                  </p>
                </div>

                {/* Intent & Confidence Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-400 text-[11px]">CLASSIFIED INTENT</span>
                    <div className="font-mono font-bold text-white text-sm mt-0.5">
                      {analysis.intent}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>INTENT CONFIDENCE</span>
                      <span className="font-mono font-bold text-indigo-300">
                        {Math.round(analysis.intent_confidence * 100)}%
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${
                          analysis.intent_confidence >= 0.85
                            ? 'bg-emerald-500'
                            : analysis.intent_confidence >= 0.70
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.round(analysis.intent_confidence * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Historical Evidence Section (RAG Context) */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-white">Historical Resolution Evidence</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {analysis.retrieved_cases.length} Grounding Cases Retrieved
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">FAISS Dense Retrieval</span>
                </div>

                <div className="space-y-2.5">
                  {analysis.retrieved_cases.map((cs, idx) => (
                    <div
                      key={cs.conversation_id || idx}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-indigo-400 font-medium">
                          ID: #{cs.conversation_id}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[10px]">
                            Resolution: <span className="text-slate-300 font-mono">{cs.resolution}</span>
                          </span>
                          <span className="font-mono font-semibold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                            Similarity: {(cs.similarity * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-slate-900 text-slate-300">
                        <div className="text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-300">Hist. Customer:</span> "{cs.customer_message}"
                        </div>
                        <div className="text-[11px] text-emerald-300/90 bg-emerald-950/20 p-2 rounded border border-emerald-500/20">
                          <span className="font-semibold text-emerald-400">Hist. Brand Reply:</span> "{cs.brand_response}"
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Reply Section */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">Suggested Support Response</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {isCopied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={() => setIsEditingReply(!isEditingReply)}
                      className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-indigo-950/60 border border-indigo-500/30 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      {isEditingReply ? 'Done Editing' : 'Edit Reply'}
                    </button>
                  </div>
                </div>

                {isEditingReply ? (
                  <textarea
                    value={editedReply}
                    onChange={(e) => setEditedReply(e.target.value)}
                    rows={4}
                    className="w-full p-3 rounded-lg bg-slate-950 border border-indigo-500 text-slate-200 text-xs focus:outline-none leading-relaxed font-sans"
                  />
                ) : (
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs leading-relaxed font-sans shadow-inner">
                    {editedReply}
                  </div>
                )}

                {/* Dispatch & Escalation Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleApproveAndSend}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/50 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Approve & Send
                    </button>

                    <button
                      onClick={handleManualEscalate}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      Escalate to Human
                    </button>
                  </div>

                  <button
                    onClick={() => handleAnalyze()}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400">
              <Bot className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">Select a scenario or enter a customer message to see the AI agent analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
