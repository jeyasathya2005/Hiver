import {
  AgentAnalysisRequest,
  AgentAnalysisResponse,
  BrandInfo,
  HealthResponse,
  EvaluationSummary,
  IntentMetric,
  FailureMode,
  EngineeringDecision,
  GoldenSetItem
} from '../types/api';
import {
  DEMO_BRAND,
  DEMO_HEALTH,
  DEMO_PRESET_SCENARIOS,
  DEMO_EVALUATION,
  DEMO_FAILURE_MODES,
  DEMO_DECISIONS,
  DEMO_GOLDEN_SET
} from './mockData';

// Priority: localStorage override > import.meta.env > default localhost
const STORAGE_KEY_API_URL = 'hiver_python_api_base_url';
const DEFAULT_URL = ((import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL) || 'http://localhost:8000';

class ApiService {
  private baseUrl: string;
  private isConnected: boolean = false;
  private lastHealthCheck: Date | null = null;
  private connectionListeners: ((connected: boolean, url: string) => void)[] = [];

  constructor() {
    this.baseUrl = localStorage.getItem(STORAGE_KEY_API_URL) || DEFAULT_URL;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string): void {
    const cleanUrl = url.trim().replace(/\/+$/, '');
    this.baseUrl = cleanUrl;
    localStorage.setItem(STORAGE_KEY_API_URL, cleanUrl);
    this.checkHealth();
  }

  public subscribeConnection(listener: (connected: boolean, url: string) => void): () => void {
    this.connectionListeners.push(listener);
    listener(this.isConnected, this.baseUrl);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.connectionListeners.forEach(l => l(this.isConnected, this.baseUrl));
  }

  private async fetchWithTimeout(endpoint: string, options: RequestInit = {}, timeoutMs = 3000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const fullUrl = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
      const response = await fetch(fullUrl, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(options.headers || {})
        }
      });
      return response;
    } finally {
      clearTimeout(id);
    }
  }

  /**
   * GET /api/health
   */
  public async checkHealth(): Promise<HealthResponse> {
    try {
      const res = await this.fetchWithTimeout('/api/health', { method: 'GET' }, 2500);
      if (res.ok) {
        const data = await res.json();
        this.isConnected = true;
        this.lastHealthCheck = new Date();
        this.notifyListeners();
        return {
          ...data,
          is_demo: false
        };
      }
      throw new Error(`HTTP ${res.status}`);
    } catch {
      this.isConnected = false;
      this.lastHealthCheck = new Date();
      this.notifyListeners();
      return {
        ...DEMO_HEALTH,
        is_demo: true,
        timestamp: new Date().toISOString()
      };
    }
  }

  public isBackendConnected(): boolean {
    return this.isConnected;
  }

  public getLastCheckTime(): Date | null {
    return this.lastHealthCheck;
  }

  /**
   * GET /api/brand
   */
  public async getBrand(brandId = 'AppleSupport'): Promise<BrandInfo> {
    try {
      const res = await this.fetchWithTimeout(`/api/brand?brand_id=${encodeURIComponent(brandId)}`, { method: 'GET' }, 3000);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Graceful fallback to demo data
    }
    return DEMO_BRAND;
  }

  /**
   * POST /api/agent/analyze
   */
  public async analyzeMessage(req: AgentAnalysisRequest): Promise<AgentAnalysisResponse> {
    try {
      const res = await this.fetchWithTimeout('/api/agent/analyze', {
        method: 'POST',
        body: JSON.stringify(req)
      }, 7000);

      if (res.ok) {
        const data = await res.json();
        return {
          ...data,
          is_demo: false
        };
      }
    } catch {
      // Fallback: match closest scenario or synthesize grounded demo response
    }

    // Match against preset scenarios or generate safe demo response
    const queryLower = req.message.toLowerCase();
    const matched = DEMO_PRESET_SCENARIOS.find(s => 
      s.message.toLowerCase().includes(queryLower) ||
      queryLower.includes(s.analysis.intent.replace(/_/g, ' ')) ||
      (queryLower.includes('battery') && s.analysis.intent === 'battery_drain_issue') ||
      ((queryLower.includes('charge') || queryLower.includes('refund') || queryLower.includes('bill')) && s.analysis.intent === 'icloud_storage_billing') ||
      ((queryLower.includes('urgent') || queryLower.includes('hacked') || queryLower.includes('lock')) && s.analysis.intent === 'apple_id_lockout')
    );

    if (matched) {
      return {
        ...matched.analysis,
        message: req.message,
        conversation_id: req.conversation_id || `conv-demo-${Date.now().toString().slice(-4)}`,
        created_at: new Date().toISOString(),
        is_demo: true
      };
    }

    // Default fallback analysis for arbitrary custom messages in Demo Mode
    const isSensitive = /card|refund|bill|charge|lawyer|sue|hacked|password|money/i.test(req.message);
    const intent = isSensitive ? 'icloud_storage_billing' : 'battery_drain_issue';
    const decision = isSensitive ? 'HUMAN_ESCALATION' : 'AUTO_HANDLE';

    return {
      conversation_id: req.conversation_id || `conv-demo-${Date.now().toString().slice(-4)}`,
      message: req.message,
      intent,
      intent_confidence: isSensitive ? 0.74 : 0.88,
      retrieved_cases: DEMO_PRESET_SCENARIOS[0].analysis.retrieved_cases,
      draft_reply: isSensitive 
        ? "We understand your concern regarding billing and account security. To protect your privacy, please visit reportaproblem.apple.com to manage transactions, or I can transfer this directly to a billing advisor."
        : "Thanks for reaching out to Apple Support. We're glad to help troubleshoot your device. Could you let us know your current iOS version and what steps you have tried so far?",
      decision,
      decision_reason: isSensitive
        ? 'Sensitive financial / security keywords identified. Policy Engine mandates human agent review.'
        : 'High confidence match with historical resolution patterns and passed safety policy filters.',
      risk_level: isSensitive ? 'HIGH' : 'LOW',
      llm_proposed_action: isSensitive ? 'ESCALATE' : 'RESPOND_DIRECTLY',
      policy_rules: [
        { rule_id: 'R1', name: 'Intent Confidence Threshold', passed: !isSensitive, score: isSensitive ? 0.74 : 0.88, threshold: 0.85, description: 'Confidence threshold' },
        { rule_id: 'R2', name: 'Historical Grounding', passed: true, score: 0.86, threshold: 0.80, description: 'Similarity to historical Twitter resolutions' },
        { rule_id: 'R3', name: 'Policy Safety Guardrail', passed: !isSensitive, description: 'Financial / Legal hard veto check' }
      ],
      policy_verdict: isSensitive ? 'POLICY_ESCALATION_TRIGGERED' : 'APPROVED_FOR_AUTO_SEND',
      processing_time_ms: 285,
      brand_id: 'AppleSupport',
      created_at: new Date().toISOString(),
      is_demo: true
    };
  }

  /**
   * POST /api/agent/approve
   */
  public async approveReply(conversationId: string, reply: string): Promise<{ success: boolean; message: string; timestamp: string }> {
    try {
      const res = await this.fetchWithTimeout('/api/agent/approve', {
        method: 'POST',
        body: JSON.stringify({ conversation_id: conversationId, reply })
      }, 3000);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return {
      success: true,
      message: `Reply for conversation ${conversationId} dispatched successfully (Demo Mode Simulated)`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * POST /api/agent/escalate
   */
  public async escalateConversation(conversationId: string, reason: string): Promise<{ success: boolean; queue: string; timestamp: string }> {
    try {
      const res = await this.fetchWithTimeout('/api/agent/escalate', {
        method: 'POST',
        body: JSON.stringify({ conversation_id: conversationId, reason })
      }, 3000);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return {
      success: true,
      queue: 'Tier-2 Technical & Escalation Support',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * GET /api/evaluation/summary
   */
  public async getEvaluationSummary(): Promise<EvaluationSummary> {
    try {
      const res = await this.fetchWithTimeout('/api/evaluation/summary', { method: 'GET' }, 3000);
      if (res.ok) {
        const data = await res.json();
        return { ...data, is_demo: false };
      }
    } catch {
      // Fallback
    }
    return DEMO_EVALUATION;
  }

  /**
   * GET /api/evaluation/intents
   */
  public async getEvaluationIntents(): Promise<IntentMetric[]> {
    try {
      const res = await this.fetchWithTimeout('/api/evaluation/intents', { method: 'GET' }, 3000);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return DEMO_EVALUATION.intents;
  }

  /**
   * GET /api/evaluation/failures
   */
  public async getEvaluationFailures(): Promise<FailureMode[]> {
    try {
      const res = await this.fetchWithTimeout('/api/evaluation/failures', { method: 'GET' }, 3000);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return DEMO_FAILURE_MODES;
  }

  /**
   * GET /api/decisions
   */
  public async getDecisions(): Promise<EngineeringDecision[]> {
    try {
      const res = await this.fetchWithTimeout('/api/decisions', { method: 'GET' }, 3000);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return DEMO_DECISIONS;
  }

  /**
   * GET /api/golden-set
   */
  public async getGoldenSet(): Promise<GoldenSetItem[]> {
    try {
      const res = await this.fetchWithTimeout('/api/golden-set', { method: 'GET' }, 3000);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return DEMO_GOLDEN_SET;
  }
}

export const apiService = new ApiService();
