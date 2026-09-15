import {
  BrandInfo,
  HealthResponse,
  EvaluationSummary,
  FailureMode,
  EngineeringDecision,
  GoldenSetItem,
  RecentDecisionItem,
  AgentAnalysisResponse
} from '../types/api';

export const DEMO_BRAND: BrandInfo = {
  brand_id: 'AppleSupport',
  brand_name: 'Apple Support',
  handle: '@AppleSupport',
  domain: 'Consumer Hardware, iOS & Services',
  total_conversations: 106123,
  reconstructed_dialogues: 84200,
  intents_count: 12,
  avg_first_response_time: '11m 42s',
  top_intents: [
    'battery_drain_issue',
    'icloud_storage_billing',
    'update_installation_error',
    'bluetooth_pairing_failure',
    'refund_not_received',
    'apple_id_lockout'
  ]
};

export const DEMO_HEALTH: HealthResponse = {
  status: 'ok',
  backend: 'Python FastAPI v0.111.0 (Demo Mode Active)',
  version: '1.2.0-takehome',
  groq_status: 'mock',
  groq_model: 'llama-3.3-70b-versatile (via Groq)',
  retrieval_engine: 'FAISS / ChromaDB (all-MiniLM-L6-v2 embeddings)',
  vector_index_size: 84200,
  database: 'Kaggle Twitter Customer Support Corpus (reconstructed)',
  timestamp: new Date().toISOString(),
  is_demo: true
};

export const DEMO_RECENT_DECISIONS: RecentDecisionItem[] = [
  {
    id: 'dec-1094',
    timestamp: '2 mins ago',
    customer_message: '@AppleSupport iPhone 13 battery dropped 40% overnight on iOS 17.4 with low power mode on.',
    intent: 'battery_drain_issue',
    decision: 'AUTO_HANDLE',
    confidence: 0.94,
    risk_level: 'LOW',
    human_status: 'APPROVED'
  },
  {
    id: 'dec-1093',
    timestamp: '7 mins ago',
    customer_message: 'Charged twice for 200GB iCloud plan this morning! I need an immediate reversal or I dispute with bank.',
    intent: 'icloud_storage_billing',
    decision: 'HUMAN_ESCALATION',
    confidence: 0.78,
    risk_level: 'HIGH',
    human_status: 'ESCALATED'
  },
  {
    id: 'dec-1092',
    timestamp: '14 mins ago',
    customer_message: 'AirPods Pro left bud not connecting after reset. Case shows blinking amber.',
    intent: 'bluetooth_pairing_failure',
    decision: 'AUTO_HANDLE',
    confidence: 0.91,
    risk_level: 'LOW',
    human_status: 'APPROVED'
  },
  {
    id: 'dec-1091',
    timestamp: '22 mins ago',
    customer_message: 'Someone in Russia just accessed my Apple ID and locked me out of two-factor verification!!',
    intent: 'apple_id_lockout',
    decision: 'HUMAN_ESCALATION',
    confidence: 0.89,
    risk_level: 'CRITICAL',
    human_status: 'ESCALATED'
  },
  {
    id: 'dec-1090',
    timestamp: '35 mins ago',
    customer_message: 'Update 17.5 stuck on Preparing Update for 4 hours on iPhone 15 Pro. Help please.',
    intent: 'update_installation_error',
    decision: 'AUTO_HANDLE',
    confidence: 0.88,
    risk_level: 'LOW',
    human_status: 'APPROVED'
  },
  {
    id: 'dec-1089',
    timestamp: '49 mins ago',
    customer_message: 'I returned my trade-in kit 3 weeks ago tracking says delivered but credit not applied to invoice.',
    intent: 'refund_not_received',
    decision: 'HUMAN_ESCALATION',
    confidence: 0.73,
    risk_level: 'MEDIUM',
    human_status: 'PENDING'
  }
];

export const DEMO_PRESET_SCENARIOS: {
  label: string;
  category: string;
  message: string;
  analysis: AgentAnalysisResponse;
}[] = [
  {
    label: 'Standard Troubleshooting (Safe Auto-Handle)',
    category: 'Auto-Handle Safe',
    message: 'My iPhone 14 battery is suddenly draining in 3 hours after updating to iOS 17.4. Background app refresh is already turned off.',
    analysis: {
      conversation_id: 'conv-sim-8812',
      message: 'My iPhone 14 battery is suddenly draining in 3 hours after updating to iOS 17.4. Background app refresh is already turned off.',
      intent: 'battery_drain_issue',
      intent_confidence: 0.94,
      retrieved_cases: [
        {
          conversation_id: 'tw-118294',
          customer_message: '@AppleSupport update to iOS 17 crushed my battery life, dropping 20% every hour.',
          brand_response: 'Thanks for reaching out. After a major iOS update, indexing photos and system assets can cause temporary battery drain for 48-72 hours. Check Settings > Battery to see top app consumers, or DM us your iOS build.',
          resolution: 'temporary_post_update_indexing_guidance',
          similarity: 0.91,
          created_at: '2023-10-18T16:20:00Z',
          channel: 'Twitter Public Mention'
        },
        {
          conversation_id: 'tw-094182',
          customer_message: '@AppleSupport iPhone battery draining super fast even with low power mode on.',
          brand_response: 'We want to help check your battery health! Head over to Settings > Battery > Battery Health & Charging. What Maximum Capacity percentage do you see? Send us a DM so we can look closer.',
          resolution: 'battery_health_diagnostic_request',
          similarity: 0.86,
          created_at: '2023-09-24T11:05:00Z',
          channel: 'Twitter Direct Message'
        },
        {
          conversation_id: 'tw-142055',
          customer_message: '@AppleSupport high battery drain on iOS 17.1 background refresh disabled.',
          brand_response: 'We hear you. Try restarting your iPhone and ensuring all third-party apps are updated in the App Store, as outdated apps can consume background cycles. DM us if it persists.',
          resolution: 'restart_and_app_update_workaround',
          similarity: 0.83,
          created_at: '2023-11-02T19:44:00Z',
          channel: 'Twitter Public Mention'
        }
      ],
      draft_reply: "We're here to help with your battery performance! Following an iOS update, background system re-indexing commonly causes temporary higher battery usage for 48–72 hours. To check deeper, head to Settings > Battery > Battery Health & Charging—what percentage do you see for Maximum Capacity? Also check Settings > Battery to inspect the top 24-hour battery consumers.",
      decision: 'AUTO_HANDLE',
      decision_reason: 'High intent confidence (94%), strong historical resolution consensus (3 corroborated cases, similarity >= 0.83), and zero sensitive financial/account safety triggers.',
      risk_level: 'LOW',
      llm_proposed_action: 'RESPOND_DIRECTLY',
      policy_rules: [
        { rule_id: 'R1', name: 'Intent Confidence Threshold', passed: true, score: 0.94, threshold: 0.85, description: 'Model confidence must exceed 85% for autonomous response' },
        { rule_id: 'R2', name: 'Historical Grounding Density', passed: true, score: 0.91, threshold: 0.80, description: 'Top retrieved case similarity must be >= 0.80' },
        { rule_id: 'R3', name: 'Corroboration Consensus', passed: true, description: 'At least 2 retrieved resolutions must recommend congruent customer paths' },
        { rule_id: 'R4', name: 'PII & Security Filter', passed: true, description: 'Zero credentials, payment details, or account takeover keywords detected' },
        { rule_id: 'R5', name: 'Customer Sentiment Risk', passed: true, description: 'No legal escalation or churn threats present' }
      ],
      policy_verdict: 'APPROVED_FOR_AUTO_SEND',
      processing_time_ms: 312,
      brand_id: 'AppleSupport',
      created_at: new Date().toISOString(),
      is_demo: true
    }
  },
  {
    label: 'Billing / Disputed Charge (Human Escalation Required)',
    category: 'Escalation - Financial Risk',
    message: 'You guys charged me $14.99 three times for the same Family Sharing iCloud plan this morning! Refund my card immediately or I am reporting this as fraud.',
    analysis: {
      conversation_id: 'conv-sim-8813',
      message: 'You guys charged me $14.99 three times for the same Family Sharing iCloud plan this morning! Refund my card immediately or I am reporting this as fraud.',
      intent: 'icloud_storage_billing',
      intent_confidence: 0.89,
      retrieved_cases: [
        {
          conversation_id: 'tw-201944',
          customer_message: '@AppleSupport duplicate charges for iCloud subscription on my credit card statement.',
          brand_response: 'We understand your concern regarding unauthorized charges. Please visit reportaproblem.apple.com to review your purchase history and request a refund directly with our billing team.',
          resolution: 'redirect_to_reportaproblem_portal',
          similarity: 0.84,
          created_at: '2023-08-14T09:12:00Z',
          channel: 'Twitter Direct Message'
        },
        {
          conversation_id: 'tw-188301',
          customer_message: '@AppleSupport charged twice for monthly subscription, dispute opened.',
          brand_response: 'We want to ensure this gets resolved. Please DM us your Apple ID and purchase date so a senior billing specialist can review your transaction records securely.',
          resolution: 'human_billing_specialist_dm_escalation',
          similarity: 0.79,
          created_at: '2023-07-29T14:40:00Z',
          channel: 'Twitter Direct Message'
        }
      ],
      draft_reply: "We understand your frustration regarding duplicate charges and want to get this resolved for you immediately. To protect your financial security, our team does not process payment reversals over public social channels. You can review and dispute recent line items directly at reportaproblem.apple.com, or I can escalate you to our Dedicated Billing Care queue right away.",
      decision: 'HUMAN_ESCALATION',
      decision_reason: 'Sensitive request: Multiple duplicate credit charges detected with explicit fraud dispute threat. Policy Engine forbids autonomous closure for financial disputes over $0.',
      risk_level: 'HIGH',
      llm_proposed_action: 'RESPOND_DIRECTLY',
      policy_rules: [
        { rule_id: 'R1', name: 'Intent Confidence Threshold', passed: true, score: 0.89, threshold: 0.85, description: 'Model confidence passed threshold' },
        { rule_id: 'R2', name: 'Historical Grounding Density', passed: true, score: 0.84, threshold: 0.80, description: 'Top case grounding score meets criteria' },
        { rule_id: 'R3', name: 'Financial Transaction Constraint', passed: false, description: 'VIOLATION: Policy Engine hard-veto on direct financial refund promises' },
        { rule_id: 'R4', name: 'Threat / Legal Escalation Guardrail', passed: false, description: 'VIOLATION: Churn/fraud keywords detected; requires Tier-2 human agent' }
      ],
      policy_verdict: 'POLICY_OVERRIDE_TO_ESCALATION',
      processing_time_ms: 289,
      brand_id: 'AppleSupport',
      created_at: new Date().toISOString(),
      is_demo: true
    }
  },
  {
    label: 'Ambiguous / Low-Confidence Query (Human Escalation Required)',
    category: 'Escalation - Ambiguous Intent',
    message: 'It stopped working again like last Tuesday after the light flashed red.',
    analysis: {
      conversation_id: 'conv-sim-8814',
      message: 'It stopped working again like last Tuesday after the light flashed red.',
      intent: 'hardware_diagnostic_unclear',
      intent_confidence: 0.47,
      retrieved_cases: [
        {
          conversation_id: 'tw-044192',
          customer_message: '@AppleSupport flashing light on my device.',
          brand_response: 'Which Apple device are you referring to (e.g. Apple TV, Beats, Magic Mouse)? Let us know so we can share specific indicator guides.',
          resolution: 'clarification_device_type',
          similarity: 0.62,
          created_at: '2023-05-10T12:00:00Z',
          channel: 'Twitter Public Mention'
        },
        {
          conversation_id: 'tw-109381',
          customer_message: '@AppleSupport red light blinking on my charger adapter.',
          brand_response: 'Safety first! Please unplug the adapter from the wall outlet and DM us the exact model number printed on the casing.',
          resolution: 'safety_inspection_request',
          similarity: 0.58,
          created_at: '2023-06-18T15:22:00Z',
          channel: 'Twitter Direct Message'
        }
      ],
      draft_reply: "We would be glad to help figure out what happened. Could you please specify which device you are referring to and which light flashed red? With the model details, we can provide the exact diagnostic steps.",
      decision: 'HUMAN_ESCALATION',
      decision_reason: 'Low intent confidence (47% < 85% minimum threshold) and weak historical evidence (similarity 0.62 < 0.80). Device context is missing.',
      risk_level: 'MEDIUM',
      llm_proposed_action: 'REQUEST_MORE_INFO',
      policy_rules: [
        { rule_id: 'R1', name: 'Intent Confidence Threshold', passed: false, score: 0.47, threshold: 0.85, description: 'FAILED: Confidence 47% is below the required 85% safety gate' },
        { rule_id: 'R2', name: 'Historical Grounding Density', passed: false, score: 0.62, threshold: 0.80, description: 'FAILED: Top case similarity 0.62 is insufficient for auto-handling' }
      ],
      policy_verdict: 'ROUTED_TO_TRIAGE_INBOX',
      processing_time_ms: 245,
      brand_id: 'AppleSupport',
      created_at: new Date().toISOString(),
      is_demo: true
    }
  },
  {
    label: 'Critical Account Lockout (Human Escalation Required)',
    category: 'Escalation - Security Risk',
    message: 'URGENT: Received notification that my password was reset from an unknown device in St Petersburg. Two-factor codes are not reaching my phone.',
    analysis: {
      conversation_id: 'conv-sim-8815',
      message: 'URGENT: Received notification that my password was reset from an unknown device in St Petersburg. Two-factor codes are not reaching my phone.',
      intent: 'apple_id_lockout',
      intent_confidence: 0.96,
      retrieved_cases: [
        {
          conversation_id: 'tw-399014',
          customer_message: '@AppleSupport unauthorized account password reset email from overseas.',
          brand_response: 'Account security is our highest priority. Please immediately visit iforgot.apple.com from a trusted browser to initiate account recovery, or join our Apple Support phone line.',
          resolution: 'urgent_account_recovery_protocol',
          similarity: 0.89,
          created_at: '2023-11-20T08:14:00Z',
          channel: 'Twitter Direct Message'
        }
      ],
      draft_reply: "This requires immediate account security verification. Please open iforgot.apple.com on a known trusted device immediately to start account recovery. We have alerted our Security Escalation Team to block further session tokens.",
      decision: 'HUMAN_ESCALATION',
      decision_reason: 'High-risk security threat: Account takeover / compromised credentials indicators triggered. Auto-handling prohibited under enterprise safety charter.',
      risk_level: 'CRITICAL',
      llm_proposed_action: 'RESPOND_DIRECTLY',
      policy_rules: [
        { rule_id: 'R1', name: 'Intent Confidence Threshold', passed: true, score: 0.96, threshold: 0.85, description: 'Passed' },
        { rule_id: 'R2', name: 'Security Breach Policy Intercept', passed: false, description: 'VIOLATION: Autonomous agent cannot close or confirm credential recovery' }
      ],
      policy_verdict: 'IMMEDIATE_SECURITY_ROUTING',
      processing_time_ms: 220,
      brand_id: 'AppleSupport',
      created_at: new Date().toISOString(),
      is_demo: true
    }
  }
];

export const DEMO_EVALUATION: EvaluationSummary = {
  brand_id: 'AppleSupport',
  total_eval_samples: 250,
  intent_accuracy: 0.884,
  intent_macro_f1: 0.862,
  reply_correctness: 0.896,
  reply_grounding: 0.918,
  reply_brand_consistency: 0.942,
  reply_helpfulness: 0.880,
  reply_safety: 0.988,
  escalation_precision: 0.892,
  escalation_recall: 0.934,
  escalation_f1: 0.912,
  safe_automation_rate: 0.584,
  unsafe_automation_rate: 0.016,
  avg_confidence: 0.871,
  auto_handle_rate: 0.600,
  human_escalation_rate: 0.400,
  baselines: [
    {
      model_name: 'Baseline 1: Majority-Class Classifier',
      description: 'Always predicts the most frequent class (battery_drain_issue) and unconditionally auto-handles.',
      intent_accuracy: 0.228,
      macro_f1: 0.038,
      safe_auto_rate: 0.212,
      unsafe_auto_rate: 0.488,
      hallucination_rate: 0.620,
      avg_latency_ms: 2,
      cost_per_1k: 0.00
    },
    {
      model_name: 'Baseline 2: TF-IDF + Logistic Regression',
      description: 'Standard statistical baseline trained on reconstructed Kaggle Twitter dialogues with rule-based heuristics.',
      intent_accuracy: 0.744,
      macro_f1: 0.718,
      safe_auto_rate: 0.420,
      unsafe_auto_rate: 0.142,
      hallucination_rate: 0.000,
      avg_latency_ms: 18,
      cost_per_1k: 0.01
    },
    {
      model_name: 'System: LLM + Retrieval + Risk/Policy Engine',
      description: 'Production system: Dense retrieval over reconstructed brand resolutions + Groq LLaMA-3.3-70B + Deterministic Safety Policy Engine.',
      intent_accuracy: 0.884,
      macro_f1: 0.862,
      safe_auto_rate: 0.584,
      unsafe_auto_rate: 0.016,
      hallucination_rate: 0.012,
      avg_latency_ms: 312,
      cost_per_1k: 0.59
    }
  ],
  ablations: [
    {
      variant_id: 'A',
      variant_name: 'A. LLM Only (Zero-Shot Prompt)',
      components: ['LLM Generation'],
      intent_accuracy: 0.812,
      response_grounding_score: 0.418,
      safe_automation_rate: 0.380,
      unsafe_automation_rate: 0.234,
      overall_human_acceptance: 0.540
    },
    {
      variant_id: 'B',
      variant_name: 'B. LLM + Retrieval (RAG Unconstrained)',
      components: ['LLM Generation', 'Dense Vector Retrieval'],
      intent_accuracy: 0.876,
      response_grounding_score: 0.884,
      safe_automation_rate: 0.680,
      unsafe_automation_rate: 0.098,
      overall_human_acceptance: 0.724
    },
    {
      variant_id: 'C',
      variant_name: 'C. LLM + Retrieval + Risk Scoring',
      components: ['LLM Generation', 'Retrieval', 'Statistical Risk Classifier'],
      intent_accuracy: 0.880,
      response_grounding_score: 0.892,
      safe_automation_rate: 0.542,
      unsafe_automation_rate: 0.038,
      overall_human_acceptance: 0.846
    },
    {
      variant_id: 'D',
      variant_name: 'D. Full System (LLM + Retrieval + Policy Engine)',
      components: ['LLM Generation', 'Retrieval', 'Risk Model', 'Deterministic Policy Guardrails'],
      intent_accuracy: 0.884,
      response_grounding_score: 0.918,
      safe_automation_rate: 0.584,
      unsafe_automation_rate: 0.016,
      overall_human_acceptance: 0.912
    }
  ],
  intents: [
    { intent: 'battery_drain_issue', samples: 48, accuracy: 0.938, precision: 0.918, recall: 0.938, f1: 0.928, auto_handle_rate: 0.792, human_escalation_rate: 0.208 },
    { intent: 'bluetooth_pairing_failure', samples: 34, accuracy: 0.912, precision: 0.886, recall: 0.912, f1: 0.899, auto_handle_rate: 0.735, human_escalation_rate: 0.265 },
    { intent: 'update_installation_error', samples: 38, accuracy: 0.895, precision: 0.872, recall: 0.895, f1: 0.883, auto_handle_rate: 0.684, human_escalation_rate: 0.316 },
    { intent: 'icloud_storage_billing', samples: 42, accuracy: 0.881, precision: 0.860, recall: 0.881, f1: 0.870, auto_handle_rate: 0.286, human_escalation_rate: 0.714 },
    { intent: 'apple_id_lockout', samples: 32, accuracy: 0.844, precision: 0.818, recall: 0.844, f1: 0.831, auto_handle_rate: 0.125, human_escalation_rate: 0.875 },
    { intent: 'refund_not_received', samples: 26, accuracy: 0.808, precision: 0.778, recall: 0.808, f1: 0.792, auto_handle_rate: 0.231, human_escalation_rate: 0.769 },
    { intent: 'screen_touch_unresponsive', samples: 18, accuracy: 0.833, precision: 0.800, recall: 0.833, f1: 0.816, auto_handle_rate: 0.667, human_escalation_rate: 0.333 },
    { intent: 'trade_in_status_inquiry', samples: 12, accuracy: 0.833, precision: 0.769, recall: 0.833, f1: 0.800, auto_handle_rate: 0.417, human_escalation_rate: 0.583 }
  ],
  is_demo: true
};

export const DEMO_FAILURE_MODES: FailureMode[] = [
  {
    id: 1,
    title: 'Low-Quality Historical Evidence',
    category: 'Evidence Quality',
    frequency_percent: 34.8,
    severity: 'HIGH',
    customer_message: '@AppleSupport after updating watchOS my heart rate app keeps pausing workout without haptic tap.',
    expected_behavior: 'Retrieve exact watchOS sensor calibration steps or workout pause settings.',
    actual_behavior: 'Retrieved generic iPhone Apple Watch unpairing & re-pairing advice with 0.71 similarity.',
    hypothesis: 'The vector embedding clustered on keyword "watchOS update" and retrieved general setup resolutions instead of specific sensor telemetry configurations.',
    likely_cause: 'Dense vector retrieval relies on generic sentence embeddings without keyword boosting or intent-filtered candidate narrowing.',
    proposed_fix: 'Implement hybrid retrieval (BM25 lexical + dense vector embeddings) filtered strictly by predicted intent domain.',
    prevention_policy_rule: 'RULE_MIN_SIMILARITY_0_78: If top retrieved case similarity < 0.78, force HUMAN_ESCALATION.'
  },
  {
    id: 2,
    title: 'Ambiguous Intent with Overlapping Symptoms',
    category: 'Ambiguity',
    frequency_percent: 26.2,
    severity: 'MEDIUM',
    customer_message: 'Phone is dead black screen and warm to the touch.',
    expected_behavior: 'Recognize thermal protection shutdown vs hardware logic board short circuit and prompt clarifying diagnostic.',
    actual_behavior: 'Classified as "battery_drain_issue" with 0.58 confidence and generated routine charging guidance.',
    hypothesis: 'Multiple failure mechanisms share identical concise symptom descriptions in informal Twitter tweets.',
    likely_cause: 'Tweet brevity (140-280 chars) lacks diagnostic telemetry; single-intent softmax forces a premature classification.',
    proposed_fix: 'Implement multi-label intent ranking with an entropy threshold: if top 2 intents have entropy delta < 0.15, trigger disambiguation.',
    prevention_policy_rule: 'RULE_INTENT_ENTROPY_GATE: Route to human triage when top intent probability - second intent probability < 0.20.'
  },
  {
    id: 3,
    title: 'Conflicting Historical Brand Resolutions',
    category: 'Conflict',
    frequency_percent: 18.5,
    severity: 'HIGH',
    customer_message: 'Water got into speaker grille during swimming in saltwater, audio sounds crackly.',
    expected_behavior: 'Recommend immediate fresh-water rinse, speaker water-ejection sound vibration, and avoid heat drying.',
    actual_behavior: 'Retrieved 2 conflicting historical tweets: one suggested rice/desiccant (outdated) and one suggested water-lock feature.',
    hypothesis: 'Twitter customer support responses span multiple years where official brand protocol and hardware ratings evolved.',
    likely_cause: 'Historical corpus lacks temporal decay weighting or authoritative resolution tagging.',
    proposed_fix: 'Add temporal decay factor in vector similarity and maintain a verified resolution knowledge-base blacklist.',
    prevention_policy_rule: 'RULE_RESOLUTION_CONCORDANCE: If top 3 retrieved resolutions recommend contradictory physical actions, escalate to human.'
  },
  {
    id: 4,
    title: 'Overconfident Auto-Handling on Churn/Legal Threats',
    category: 'Overconfidence',
    frequency_percent: 12.3,
    severity: 'CRITICAL',
    customer_message: 'If my data isn’t restored by tomorrow I am taking this to the FTC and consumer tribunal.',
    expected_behavior: 'Instant escalation to specialized Tier-3 Executive Relations Team without automated boilerplate.',
    actual_behavior: 'Classified as "icloud_storage_billing" (88% confidence) and generated standard FAQ link for data backups.',
    hypothesis: 'The intent classifier matched "data restored" and missed the high-impact legal keywords.',
    likely_cause: 'Intent classification model focuses on functional domain rather than regulatory sentiment / litigation markers.',
    proposed_fix: 'Independent safety & churn classifier running in parallel as a non-negotiable policy veto before LLM draft generation.',
    prevention_policy_rule: 'RULE_LEGAL_CHURN_HARD_VETO: Any occurrence of litigation, arbitration, regulator, or fraud keywords triggers mandatory HUMAN_ESCALATION.'
  },
  {
    id: 5,
    title: 'Hallucinated or Weakly Grounded Reply',
    category: 'Hallucination',
    frequency_percent: 8.2,
    severity: 'HIGH',
    customer_message: 'How do I transfer my Apple Card balance to a Santander checking account in Madrid?',
    expected_behavior: 'State that Apple Card is only available in the United States and cannot transfer balances internationally.',
    actual_behavior: 'LLM generated plausible but completely fabricated instructions mentioning an imaginary "International Transfer" tab in Wallet app.',
    hypothesis: 'The LLM filled knowledge gaps in retrieval by synthesizing plausible-sounding UI instructions.',
    likely_cause: 'Insufficient grounding constraint in prompt template and absence of an automated NLI (Natural Language Inference) grounding check.',
    proposed_fix: 'Enforce strict citation constraint: every sentence in draft reply must be entailed by retrieved historical context via an NLI verifier.',
    prevention_policy_rule: 'RULE_NLI_GROUNDING_CHECK: Reject draft and escalate if factuality consistency score with retrieved cases is < 0.85.'
  }
];

export const DEMO_DECISIONS: EngineeringDecision[] = [
  {
    id: 'dec-1',
    number: 1,
    decision: 'Single Brand Focus: Selected @AppleSupport from Kaggle Corpus',
    category: 'Dataset & Architecture',
    reason: 'The Kaggle Twitter dataset contains dozens of diverse brands with radically differing support conventions. Focusing on @AppleSupport provides high dialogue volume (over 100k conversations), consistent multi-turn troubleshooting patterns, and well-defined technical intent categories.',
    trade_off: 'Limits immediate zero-shot generalization across airlines or telecommunications without retraining or brand-specific retrieval indexes.',
    alternative_considered: 'Training a single heterogeneous multi-brand model across Delta, Amazon, and Apple. Rejected due to conflicting brand tones, policies, and terminology dilution.',
    status: 'Adopted'
  },
  {
    id: 'dec-2',
    number: 2,
    decision: 'Conversation Reconstruction from In-Reply-To Tweet Threads',
    category: 'Dataset & Architecture',
    reason: 'Raw tweets are isolated rows. To understand customer intent and brand resolution, we must reconstruct the directed graph of in_reply_to_tweet_id into chronologically ordered customer-agent dialogues.',
    trade_off: 'Requires extensive offline preprocessing, graph traversal, and discarding incomplete dangling threads without clear resolutions.',
    alternative_considered: 'Treating individual customer tweets and responses as stateless query-response pairs. Rejected because single tweets frequently miss prerequisite diagnostic context.',
    status: 'Adopted'
  },
  {
    id: 'dec-3',
    number: 3,
    decision: 'Grounding in Historical Resolutions Rather Than Pure LLM Parametric Memory',
    category: 'Model & Retrieval',
    reason: 'LLMs hallucinate plausible but non-existent customer support procedures. Retrieving authentic historical resolutions guarantees brand-aligned terminology, established URLs, and validated diagnostic workflows.',
    trade_off: 'Introduces retrieval latency (150-250ms), vector database dependency, and potential retrieval noise when query phrasing is atypical.',
    alternative_considered: 'Fine-tuning an LLM on historical conversations without RAG. Rejected due to inability to inspect evidence, lack of instant policy updates, and high hallucination risk.',
    status: 'Enforced'
  },
  {
    id: 'dec-4',
    number: 4,
    decision: 'Strict Separation of Golden Test Set from Retrieval Corpus',
    category: 'Evaluation & Infra',
    reason: 'Preventing data leakage is paramount. If the golden test examples exist within the vector database index, retrieval will artificially inflate similarity scores to 1.0 and mask real generalization failures.',
    trade_off: 'Reduces the total volume of vector index candidates by reserving 250 curated high-complexity dialogues for evaluation.',
    alternative_considered: 'Random k-fold split without deduplication. Rejected because near-duplicate customer tweets (e.g. repetitive iOS update complaints) would leak across splits.',
    status: 'Enforced'
  },
  {
    id: 'dec-5',
    number: 5,
    decision: 'Selection of TF-IDF + Logistic Regression as Statistical Baseline',
    category: 'Evaluation & Infra',
    reason: 'A credible benchmark requires more than a strawman majority classifier. TF-IDF + Logistic Regression provides an interpretable, fast, and strong classical NLP baseline to quantify the exact marginal gain of dense embeddings and LLMs.',
    trade_off: 'Requires maintaining feature extraction pipelines alongside modern neural vector embeddings.',
    alternative_considered: 'Using only a majority-class baseline. Rejected because claiming 88% accuracy over a 22% baseline without a competitive statistical intermediary is misleading.',
    status: 'Adopted'
  },
  {
    id: 'dec-6',
    number: 6,
    decision: 'Why an LLM-Only Baseline is Insufficient for Enterprise Support',
    category: 'Model & Retrieval',
    reason: 'Zero-shot LLMs without retrieval fail brand consistency, invent fictitious warranty return windows, and lack awareness of recent service disruptions or firmware releases.',
    trade_off: 'Higher computational complexity compared to simple prompt engineering.',
    alternative_considered: 'Few-shot in-context learning with static prompt examples. Rejected because 5 static examples cannot cover 12 complex technical domains.',
    status: 'Validated'
  },
  {
    id: 'dec-7',
    number: 7,
    decision: 'The LLM Proposes; The Policy Engine Decides Principle',
    category: 'Policy & Safety',
    reason: 'Stochastic generative models cannot be trusted with final dispatch decisions. The LLM generates semantic representations and draft replies, but a deterministic, rule-based Policy Engine holds ultimate authority over AUTO-HANDLE vs HUMAN ESCALATION.',
    trade_off: 'Some safe responses may be unnecessarily escalated if policy rules are too conservative (lowering automation rate).',
    alternative_considered: 'Asking the LLM to output a boolean "should_escalate" flag in its JSON completion. Rejected because LLMs suffer from severe overconfidence and self-rationalization bias.',
    status: 'Enforced'
  },
  {
    id: 'dec-8',
    number: 8,
    decision: 'Conservative Escalation Thresholds for Low Intent Confidence (<85%)',
    category: 'Policy & Safety',
    reason: 'In customer support, an unhelpful or incorrect autonomous reply frustrates customers more than waiting briefly for a human agent. Escalating ambiguous cases preserves brand trust.',
    trade_off: 'Caps automated deflection rate around 58-62%, requiring human agent staffing for the remaining volume.',
    alternative_considered: 'Aggressive 60% confidence threshold to maximize deflection metrics. Rejected because unsafe automation rate spiked to over 11% during stress tests.',
    status: 'Enforced'
  },
  {
    id: 'dec-9',
    number: 9,
    decision: 'Backend-Only Groq API Access with Zero Browser Key Exposure',
    category: 'Policy & Safety',
    reason: 'API keys exposed to client-side browsers can be intercepted, abused, and rate-limited. Running Groq invocations strictly inside the Python FastAPI backend preserves credentials, enables request logging, and enforces rate-limiting.',
    trade_off: 'Frontend cannot function standalone without the Python backend or an explicit mock fallback.',
    alternative_considered: 'Direct client-side fetch to Groq API with user-provided keys. Rejected as a severe architectural and security violation.',
    status: 'Enforced'
  },
  {
    id: 'dec-10',
    number: 10,
    decision: 'Decoupled Storage: Kaggle Corpus Stored in Vector DB, Not Firestore',
    category: 'Dataset & Architecture',
    reason: 'Storing millions of raw Kaggle tweets in Firestore incurs immense read/write costs and provides inferior similarity search compared to dedicated vector stores (FAISS/ChromaDB). Firestore is reserved solely for application operational state.',
    trade_off: 'Requires managing two storage tiers: vector store for semantic retrieval and Firestore/Relational DB for operational tickets.',
    alternative_considered: 'Uploading entire CSV into Firestore collections with full-text search extensions. Rejected due to cost inefficiency and latency.',
    status: 'Adopted'
  },
  {
    id: 'dec-11',
    number: 11,
    decision: 'Tracking Unsafe Automation Rate as Primary Safety KPI',
    category: 'Evaluation & Infra',
    reason: 'Standard accuracy hides asymmetric costs: an incorrect auto-reply sent to an angry customer or regarding a disputed charge has far worse consequences than escalating a benign question.',
    trade_off: 'Requires auditing false auto-handles with human annotators.',
    alternative_considered: 'Relying solely on overall accuracy and macro F1. Rejected because 90% accuracy can conceal catastrophic failures in high-risk financial or account safety queries.',
    status: 'Adopted'
  },
  {
    id: 'dec-12',
    number: 12,
    decision: 'LLM-as-a-Judge Requires Systematic Human Agreement Validation',
    category: 'Evaluation & Infra',
    reason: 'Automated evaluation using secondary LLMs is fast but susceptible to position bias, verbosity bias, and leniency toward self-generated phrasing. We calibrate the judge model against a 250-sample human-labelled golden set (Cohen’s Kappa > 0.82).',
    trade_off: 'Incurs initial human annotation effort before automated continuous integration evaluation can be trusted.',
    alternative_considered: 'Unvalidated LLM-as-a-judge scoring. Rejected due to known drift and systematic overscoring of ungrounded responses.',
    status: 'Validated'
  }
];

export const DEMO_GOLDEN_SET: GoldenSetItem[] = [
  {
    id: 'GS-001',
    customer_message: 'My iPhone 14 battery dropped 35% in two hours after iOS 17.4 update with zero apps running.',
    expected_intent: 'battery_drain_issue',
    predicted_intent: 'battery_drain_issue',
    expected_action: 'AUTO_HANDLE',
    agent_decision: 'AUTO_HANDLE',
    generated_reply: "We understand your concern with battery life following an update. After updating iOS, background indexing can cause elevated consumption for 48 hours. Check Settings > Battery > Battery Health to review maximum capacity.",
    human_rating: 5,
    judge_rating: 5,
    is_correct: true,
    intent_match: true,
    action_match: true,
    grounding_evidence_ids: ['tw-118294', 'tw-094182']
  },
  {
    id: 'GS-002',
    customer_message: 'Duplicate charge of $9.99 for Apple Music on my bank statement. Need a refund.',
    expected_intent: 'icloud_storage_billing',
    predicted_intent: 'icloud_storage_billing',
    expected_action: 'HUMAN_ESCALATION',
    agent_decision: 'HUMAN_ESCALATION',
    generated_reply: "We can help guide you to the billing team. To review and request refunds securely, visit reportaproblem.apple.com, or I can route this to our billing specialist team immediately.",
    human_rating: 5,
    judge_rating: 4,
    is_correct: true,
    intent_match: true,
    action_match: true,
    grounding_evidence_ids: ['tw-201944']
  },
  {
    id: 'GS-003',
    customer_message: 'Help my screen is completely frozen black screen.',
    expected_intent: 'screen_touch_unresponsive',
    predicted_intent: 'battery_drain_issue',
    expected_action: 'HUMAN_ESCALATION',
    agent_decision: 'AUTO_HANDLE',
    generated_reply: "Please check your battery charging cable and leave it plugged in for 30 minutes.",
    human_rating: 1,
    judge_rating: 2,
    is_correct: false,
    intent_match: false,
    action_match: false,
    failure_mode: 'Ambiguous intent with overlapping symptoms',
    grounding_evidence_ids: ['tw-044192'],
    notes: 'Failed to diagnose frozen screen; policy engine should have caught ambiguous low confidence'
  },
  {
    id: 'GS-004',
    customer_message: 'URGENT: Someone in another country reset my Apple ID password and locked my devices.',
    expected_intent: 'apple_id_lockout',
    predicted_intent: 'apple_id_lockout',
    expected_action: 'HUMAN_ESCALATION',
    agent_decision: 'HUMAN_ESCALATION',
    generated_reply: "Account security is our top priority. Please go to iforgot.apple.com immediately from a trusted device. We are escalating this case to Apple Security Support.",
    human_rating: 5,
    judge_rating: 5,
    is_correct: true,
    intent_match: true,
    action_match: true,
    grounding_evidence_ids: ['tw-399014']
  },
  {
    id: 'GS-005',
    customer_message: 'AirPods Pro 2 crackling noise in transparency mode after the latest firmware.',
    expected_intent: 'bluetooth_pairing_failure',
    predicted_intent: 'bluetooth_pairing_failure',
    expected_action: 'AUTO_HANDLE',
    agent_decision: 'AUTO_HANDLE',
    generated_reply: "Try cleaning the mesh with a dry lint-free cloth and reset your AirPods by holding the setup button on the back for 15 seconds until the status light flashes amber then white.",
    human_rating: 4,
    judge_rating: 4,
    is_correct: true,
    intent_match: true,
    action_match: true,
    grounding_evidence_ids: ['tw-094182']
  },
  {
    id: 'GS-006',
    customer_message: 'Update stuck on Preparing Update for 6 hours on iPhone 15 Pro.',
    expected_intent: 'update_installation_error',
    predicted_intent: 'update_installation_error',
    expected_action: 'AUTO_HANDLE',
    agent_decision: 'AUTO_HANDLE',
    generated_reply: "If preparing the update is stuck, go to Settings > General > iPhone Storage, locate the iOS update file and tap Delete Update, then restart your device and try downloading again over reliable Wi-Fi.",
    human_rating: 5,
    judge_rating: 5,
    is_correct: true,
    intent_match: true,
    action_match: true,
    grounding_evidence_ids: ['tw-142055']
  },
  {
    id: 'GS-007',
    customer_message: 'Returned my trade-in kit over 3 weeks ago FedEx tracking says signed for, but no credit.',
    expected_intent: 'trade_in_status_inquiry',
    predicted_intent: 'trade_in_status_inquiry',
    expected_action: 'HUMAN_ESCALATION',
    agent_decision: 'HUMAN_ESCALATION',
    generated_reply: "Trade-in inspections generally take 3-5 business days after delivery. Please DM us your Trade-in Quote ID or Order number so a specialist can check the warehouse processing status.",
    human_rating: 5,
    judge_rating: 4,
    is_correct: true,
    intent_match: true,
    action_match: true,
    grounding_evidence_ids: ['tw-188301']
  },
  {
    id: 'GS-008',
    customer_message: 'I dropped my iPhone in ocean saltwater, what should I put it in?',
    expected_intent: 'hardware_diagnostic_unclear',
    predicted_intent: 'battery_drain_issue',
    expected_action: 'HUMAN_ESCALATION',
    agent_decision: 'AUTO_HANDLE',
    generated_reply: "Place the phone in a container of uncooked dry rice for 24 hours to absorb moisture.",
    human_rating: 1,
    judge_rating: 1,
    is_correct: false,
    intent_match: false,
    action_match: false,
    failure_mode: 'Conflicting historical brand resolutions',
    grounding_evidence_ids: ['tw-044192'],
    notes: 'Outdated conflicting advice: Apple officially warns against putting phones in rice due to particle damage.'
  },
  {
    id: 'GS-009',
    customer_message: 'How do I add a boarding pass to Apple Wallet from an email?',
    expected_intent: 'general_service_guidance',
    predicted_intent: 'general_service_guidance',
    expected_action: 'AUTO_HANDLE',
    agent_decision: 'AUTO_HANDLE',
    generated_reply: "In Mail, open the attachment or tap 'Add to Apple Wallet' in the email. You can also add it via your airline app. Tap Add in the upper right corner to save it to your Wallet app.",
    human_rating: 5,
    judge_rating: 5,
    is_correct: true,
    intent_match: true,
    action_match: true,
    grounding_evidence_ids: ['tw-118294']
  },
  {
    id: 'GS-010',
    customer_message: 'My iPhone 12 speaker is muffled and buzzing during calls.',
    expected_intent: 'hardware_diagnostic_unclear',
    predicted_intent: 'hardware_diagnostic_unclear',
    expected_action: 'HUMAN_ESCALATION',
    agent_decision: 'HUMAN_ESCALATION',
    generated_reply: "We can help you inspect receiver audio. There is a known service program for iPhone 12 receiver issues. Let us connect you to an Apple Authorized Service Provider or senior advisor to verify eligibility.",
    human_rating: 5,
    judge_rating: 4,
    is_correct: true,
    intent_match: true,
    action_match: true,
    grounding_evidence_ids: ['tw-188301']
  },
  {
    id: 'GS-011',
    customer_message: 'Charged $2.99 for an in-app purchase I never made. My 8yo son has screen time on.',
    expected_intent: 'icloud_storage_billing',
    predicted_intent: 'icloud_storage_billing',
    expected_action: 'HUMAN_ESCALATION',
    agent_decision: 'HUMAN_ESCALATION',
    generated_reply: "You can request a refund for accidental child purchases at reportaproblem.apple.com and enable 'Ask to Buy' under Family Sharing settings. Escalating to our family billing team.",
    human_rating: 4,
    judge_rating: 4,
    is_correct: true,
    intent_match: true,
    action_match: true,
    grounding_evidence_ids: ['tw-201944']
  },
  {
    id: 'GS-012',
    customer_message: 'Can I transfer Apple Card cash back to my Santander bank account in Spain?',
    expected_intent: 'general_service_guidance',
    predicted_intent: 'general_service_guidance',
    expected_action: 'AUTO_HANDLE',
    agent_decision: 'AUTO_HANDLE',
    generated_reply: "Open Wallet, tap Apple Card, tap Daily Cash, select International Transfer to send to Santander in Madrid.",
    human_rating: 1,
    judge_rating: 1,
    is_correct: false,
    intent_match: true,
    action_match: false,
    failure_mode: 'Hallucinated or weakly grounded reply',
    grounding_evidence_ids: [],
    notes: 'Severe hallucination: Apple Card does not operate in Spain nor allow international balance transfers.'
  },
  {
    id: 'GS-013',
    customer_message: 'MacBook Pro M2 trackpad click not working after liquid spill.',
    expected_intent: 'hardware_diagnostic_unclear',
    predicted_intent: 'hardware_diagnostic_unclear',
    expected_action: 'HUMAN_ESCALATION',
    agent_decision: 'HUMAN_ESCALATION',
    generated_reply: "Liquid damage requires hardware inspection. Please power down your MacBook immediately and schedule a Genius Bar reservation via getsupport.apple.com.",
    human_rating: 5,
    judge_rating: 5,
    is_correct: true,
    intent_match: true,
    action_match: true,
    grounding_evidence_ids: ['tw-399014']
  },
  {
    id: 'GS-014',
    customer_message: 'Bluetooth keeps dropping connection with my car stereo after iOS 17 update.',
    expected_intent: 'bluetooth_pairing_failure',
    predicted_intent: 'bluetooth_pairing_failure',
    expected_action: 'AUTO_HANDLE',
    agent_decision: 'AUTO_HANDLE',
    generated_reply: "Go to Settings > Bluetooth, tap the (i) icon next to your car stereo and tap 'Forget This Device'. Then reset your car's infotainment Bluetooth pairing and reconnect.",
    human_rating: 5,
    judge_rating: 4,
    is_correct: true,
    intent_match: true,
    action_match: true,
    grounding_evidence_ids: ['tw-094182']
  },
  {
    id: 'GS-015',
    customer_message: 'How do I cancel my Apple TV+ subscription on a Windows PC?',
    expected_intent: 'icloud_storage_billing',
    predicted_intent: 'icloud_storage_billing',
    expected_action: 'AUTO_HANDLE',
    agent_decision: 'AUTO_HANDLE',
    generated_reply: "Visit tv.apple.com in your web browser, sign in with your Apple ID, click your profile icon in the top right, go to Settings, scroll to Subscriptions and select Manage > Cancel Subscription.",
    human_rating: 5,
    judge_rating: 5,
    is_correct: true,
    intent_match: true,
    action_match: true,
    grounding_evidence_ids: ['tw-201944']
  }
];
