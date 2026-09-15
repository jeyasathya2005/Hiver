export type DecisionType = 'AUTO_HANDLE' | 'HUMAN_ESCALATION';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ActionStatus = 'PENDING' | 'APPROVED' | 'ESCALATED' | 'REJECTED';

export interface RetrievedCase {
  conversation_id: string;
  customer_message: string;
  brand_response: string;
  resolution: string;
  similarity: number;
  created_at?: string;
  channel?: string;
}

export interface AgentAnalysisRequest {
  message: string;
  conversation_id?: string | null;
  brand_id?: string;
}

export interface PolicyRuleResult {
  rule_id: string;
  name: string;
  passed: boolean;
  score?: number;
  threshold?: number;
  description: string;
}

export interface AgentAnalysisResponse {
  conversation_id: string;
  message: string;
  intent: string;
  intent_confidence: number;
  retrieved_cases: RetrievedCase[];
  draft_reply: string;
  decision: DecisionType;
  decision_reason: string;
  risk_level: RiskLevel;
  llm_proposed_action: 'RESPOND_DIRECTLY' | 'REQUEST_MORE_INFO' | 'ESCALATE';
  policy_rules: PolicyRuleResult[];
  policy_verdict: string;
  processing_time_ms: number;
  brand_id: string;
  created_at: string;
  is_demo?: boolean;
}

export interface BrandInfo {
  brand_id: string;
  brand_name: string;
  handle: string;
  domain: string;
  total_conversations: number;
  reconstructed_dialogues: number;
  intents_count: number;
  avg_first_response_time: string;
  top_intents: string[];
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'offline';
  backend: string;
  version: string;
  groq_status: 'connected' | 'mock' | 'unconfigured';
  groq_model: string;
  retrieval_engine: string;
  vector_index_size: number;
  database: string;
  timestamp: string;
  is_demo?: boolean;
}

export interface MetricCardData {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  helperText?: string;
  isDemo?: boolean;
}

export interface IntentMetric {
  intent: string;
  samples: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  auto_handle_rate: number;
  human_escalation_rate: number;
}

export interface BaselineComparison {
  model_name: string;
  description: string;
  intent_accuracy: number;
  macro_f1: number;
  safe_auto_rate: number;
  unsafe_auto_rate: number;
  hallucination_rate: number;
  avg_latency_ms: number;
  cost_per_1k: number;
}

export interface AblationStudyRow {
  variant_id: string;
  variant_name: string;
  components: string[];
  intent_accuracy: number;
  response_grounding_score: number;
  safe_automation_rate: number;
  unsafe_automation_rate: number;
  overall_human_acceptance: number;
}

export interface EvaluationSummary {
  brand_id: string;
  total_eval_samples: number;
  intent_accuracy: number;
  intent_macro_f1: number;
  reply_correctness: number;
  reply_grounding: number;
  reply_brand_consistency: number;
  reply_helpfulness: number;
  reply_safety: number;
  escalation_precision: number;
  escalation_recall: number;
  escalation_f1: number;
  safe_automation_rate: number;
  unsafe_automation_rate: number;
  avg_confidence: number;
  auto_handle_rate: number;
  human_escalation_rate: number;
  baselines: BaselineComparison[];
  ablations: AblationStudyRow[];
  intents: IntentMetric[];
  is_demo?: boolean;
}

export interface FailureMode {
  id: number;
  title: string;
  category: 'Evidence Quality' | 'Ambiguity' | 'Conflict' | 'Overconfidence' | 'Hallucination';
  frequency_percent: number;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  customer_message: string;
  expected_behavior: string;
  actual_behavior: string;
  hypothesis: string;
  likely_cause: string;
  proposed_fix: string;
  prevention_policy_rule: string;
}

export interface EngineeringDecision {
  id: string;
  number: number;
  decision: string;
  category: 'Dataset & Architecture' | 'Model & Retrieval' | 'Policy & Safety' | 'Evaluation & Infra';
  reason: string;
  trade_off: string;
  alternative_considered: string;
  status: 'Adopted' | 'Enforced' | 'Validated';
}

export interface GoldenSetItem {
  id: string;
  customer_message: string;
  expected_intent: string;
  predicted_intent: string;
  expected_action: DecisionType;
  agent_decision: DecisionType;
  generated_reply: string;
  human_rating: number; // 1 to 5
  judge_rating: number; // 1 to 5
  is_correct: boolean;
  intent_match: boolean;
  action_match: boolean;
  failure_mode?: string;
  grounding_evidence_ids: string[];
  notes?: string;
}

export interface RecentDecisionItem {
  id: string;
  timestamp: string;
  customer_message: string;
  intent: string;
  decision: DecisionType;
  confidence: number;
  risk_level: RiskLevel;
  human_status: ActionStatus;
}
