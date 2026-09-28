export type ProviderId = 'gemini' | 'openai' | 'claude' | 'perplexity' | 'copilot' | 'figma' | 'gamma';

export type ProviderCategory = 'model' | 'design' | 'presentation';

export type ProviderStatusType =
  | 'connected'
  | 'disconnected'
  | 'auth_required'
  | 'api_key_missing'
  | 'rate_limited'
  | 'unsupported';

export interface AIProviderCapabilities {
  chat: boolean;
  textGeneration: boolean;
  reasoning: boolean;
  streaming: boolean;
  webResearch: boolean;
  citations: boolean;
  imageInput: boolean;
  fileInput: boolean;
  structuredOutput: boolean;
  codeGeneration: boolean;
  documentGeneration: boolean;
  presentationGeneration: boolean;
  designContext: boolean;
  export: boolean;
}

export interface ProviderDefinition {
  id: ProviderId;
  name: string;
  category: ProviderCategory;
  model: string;
  badge: string;
  color: string;
  accentBorder: string;
  bgTint: string;
  description: string;
  capabilities: Partial<AIProviderCapabilities>;
  status: ProviderStatusType;
  requiresKey: boolean;
}

export interface NormalizedCitation {
  id: string;
  provider: ProviderId;
  title: string;
  domain: string;
  url: string;
  snippet?: string;
  date?: string;
}

export interface NormalizedAIResponse {
  provider: ProviderId;
  model: string;
  requestId: string;
  timestamp: string;
  content: string;
  citations: NormalizedCitation[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCostUsd?: number;
  };
  latencyMs: number;
  capabilities: Partial<AIProviderCapabilities>;
  error?: {
    code: string;
    message: string;
    isRetryable: boolean;
  };
}

export interface ConsensusAnalysis {
  overallAgreement: 'strong_agreement' | 'partial_agreement' | 'divergent' | 'conflicting';
  agreementScore: number; // 0 to 100
  agreements: string[];
  differences: string[];
  uniqueInsights: { provider: ProviderId; insight: string }[];
  conflicts: string[];
  recommendedVerification: string[];
  synthesizedExecutiveReport: string;
  generatedBy: string;
}

export interface TaskMode {
  id: string;
  label: string;
  iconName: string;
  description: string;
  defaultProviders: ProviderId[];
}

export interface SavedFolder {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  prompt: string;
  recommendedProviders: ProviderId[];
  tag: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  subscription: 'Creator Pro' | 'Enterprise' | 'Free';
  avatar: string;
}

// Mode Specific Artifact Definitions
export interface SlideCard {
  title: string;
  desc: string;
  iconText?: string;
}

export interface SlideData {
  title: string;
  subtitle?: string;
  bullets?: string[];
  cards?: SlideCard[];
  speakerNotes?: string;
  badge?: string;
}

export interface PresentationDeckData {
  title: string;
  subtitle: string;
  topic: string;
  theme?: 'dark' | 'cyan' | 'midnight' | 'light';
  slides: SlideData[];
}

export interface CodeFileArtifact {
  fileName: string;
  language: string;
  code: string;
  description: string;
}

export interface CodeArtifactData {
  title: string;
  description: string;
  files: CodeFileArtifact[];
  terminalOutput?: string;
  tests?: { name: string; passed: boolean; duration: string }[];
}

export interface ColorToken {
  name: string;
  hex: string;
  rgb: string;
  usage: string;
  contrastRatio: string;
}

export interface DesignArtifactData {
  title: string;
  description: string;
  colorTokens: ColorToken[];
  typography: { label: string; size: string; weight: string; sample: string }[];
  spacing: { token: string; value: string }[];
  previewComponent: {
    headline: string;
    description: string;
    tags: string[];
    ctaText: string;
    badgeText: string;
    metricLabel: string;
    metricValue: string;
  };
}

export interface CompareRow {
  dimension: string;
  optionA: string;
  optionB: string;
  analysis: string;
  advantage: 'A' | 'B' | 'Tie';
}

export interface CompareArtifactData {
  title: string;
  subjectA: string;
  subjectB: string;
  summary: string;
  scoreA: number;
  scoreB: number;
  rows: CompareRow[];
  recommendation: string;
}

export interface BrainstormIdea {
  id: string;
  title: string;
  description: string;
  category: 'moonshot' | 'quick_win' | 'high_impact' | 'foundation';
  votes: number;
  tags: string[];
}

export interface BrainstormArtifactData {
  title: string;
  prompt: string;
  ideas: BrainstormIdea[];
}

export interface ResearchDossierData {
  title: string;
  executiveSummary: string;
  methodology: string;
  keyMetrics: { label: string; value: string; trend?: string; source: string }[];
  findings: { sectionTitle: string; content: string; keyPoint: string }[];
  bibliography: { title: string; domain: string; url: string; year: string }[];
}

export interface FactCheckClaim {
  id: string;
  claim: string;
  verdict: 'verified' | 'partially_true' | 'unverified' | 'caution';
  confidenceScore: number;
  evidence: string;
  sources: string[];
}

export interface VerifyArtifactData {
  title: string;
  trustScore: number;
  claimsChecked: number;
  verifiedCount: number;
  claims: FactCheckClaim[];
  methodologyNote: string;
}

export interface SwotQuadrant {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface AnalyzeArtifactData {
  title: string;
  kpis: { label: string; value: string; subtext: string; change?: string }[];
  swot: SwotQuadrant;
  riskAssessment: { risk: string; severity: 'high' | 'medium' | 'low'; mitigation: string }[];
  strategicVerdict: string;
}

export interface SummarizeArtifactData {
  title: string;
  thirtySecPitch: string;
  bulletTakeaways: string[];
  audioScript: string;
  stats: { label: string; value: string }[];
  readingTimeMinutes: number;
}

export interface WriteArtifactData {
  title: string;
  subtitle: string;
  author: string;
  date: string;
  wordCount: number;
  readingTime: string;
  content: string;
}

