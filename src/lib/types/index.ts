// ── Backend API Types ──

export interface CompanyProfile {
  title: string;
  url: string;
  summary: string;
  highlights: string[];
  text_excerpt: string;
  image: string | null;
  favicon: string | null;
}

export interface ICPBlueprint {
  company_name: string;
  company_url: string;
  offering: string;
  target_customer_summary: string;
  target_industries: string[];
  target_company_size: string;
  target_roles: string[];
  target_geography: string[];
  buying_signals: string[];
  differentiators: string[];
  exclusions: string[];
  confidence: number;
  supporting_evidence: string[];
  source_type?: string;
  is_b2b_seller?: boolean | null;
  suitability_reason?: string;
  suitability_confidence?: number;
}

export interface IngestMetadata {
  anthropic_model: string;
  anthropic_tool_name: string;
  exa_request_id: string | null;
  exa_cost_usd: number | null;
  exa_source_status: string | null;
  icp_blueprint_id: string | null;
  customer_id: string | null;
  created_at: string | null;
  persisted: boolean;
}

export interface IngestResponse {
  company_profile: CompanyProfile;
  icp_blueprint: ICPBlueprint;
  metadata: IngestMetadata;
}

export interface NormalizedCandidate {
  company_title: string;
  url: string;
  root_domain: string;
  summary: string;
  employee_count: number | null;
  headquarters: string | null;
}

export interface LeadScoreResult {
  company_title: string;
  url: string;
  fit_score: number;
  verdict: string;
  matched_signals: string[];
  missing_signals: string[];
  risk_factors: string[];
  reasoning: string;
}

export interface RankedLead {
  company_title: string;
  url: string;
  fit_score: number;
  verdict: string;
  matched_signals: string[];
  missing_signals: string[];
  risk_factors: string[];
  reasoning: string;
  tier: string;
  rank: number;
  status: string;
  rejection_reason: string | null;
  auto_approved: boolean;
}

export interface PipelineResponse {
  run_id: string;
  icp_blueprint_id: string;
  customer_id: string;
  webset_id: string;
  query_text: string;
  requested_count: number;
  requested_field_count: number;
  discovery_count: number;
  candidates: NormalizedCandidate[];
  scored_leads: LeadScoreResult[];
  ranked_leads: RankedLead[];
  overall_notes: string;
  status: string;
}

export interface PipelineAcceptedResponse {
  job_id: string;
  candidate_count: number;
  field_count: number;
}

export type PipelineJobStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export interface PipelineJobStatusResponse {
  job_id: string;
  status: PipelineJobStatus;
  source_url: string;
  run_id: string | null;
  customer_id: string | null;
  icp_blueprint_id: string | null;
  candidate_count: number;
  field_count: number;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface PipelineRunResult {
  job_id: string;
  run_id: string;
  customer_id: string;
  icp_blueprint_id: string;
}

export interface LeadRead {
  id: string;
  run_id: string;
  customer_id: string;
  icp_blueprint_id: string;
  company_title: string;
  url: string;
  root_domain: string;
  summary: string;
  fit_score: number;
  verdict: string;
  tier: string;
  rank: number | null;
  status: string;
  rejection_reason: string | null;
  matched_signals: string[];
  missing_signals: string[];
  risk_factors: string[];
  email: string | null;
  direct_email: string | null;
  ceo_name: string | null;
  employee_count: number | null;
  headquarters: string | null;
  phone: string | null;
  auto_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadDetailRead extends LeadRead {
  reasoning: string;
  enrichments: Record<string, string[]>;
}

export interface LeadListResponse {
  leads: LeadRead[];
  total: number;
  limit: number;
  offset: number;
}

export type RunStatus =
  | "pending"
  | "discovering"
  | "discovery_completed"
  | "scoring"
  | "completed"
  | "failed";

export interface RunRead {
  id: string;
  customer_id: string;
  icp_blueprint_id: string;
  status: RunStatus;
  webset_id: string | null;
  query_text: string | null;
  requested_count: number | null;
  requested_field_count: number | null;
  returned_count: number | null;
  analyzed_count: number | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  environment: string;
  exa_configured: boolean;
  anthropic_configured: boolean;
}

export interface DiscoverResponse {
  [key: string]: unknown;
}

export interface ScorePreviewResponse {
  [key: string]: unknown;
}

// ── Activity Log Types ──

export type ActivityLogType = "api" | "pipeline" | "error" | "info";

export interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  type: ActivityLogType;
  message: string;
  detail?: string;
  status?: number;
  duration?: number;
}

// ── Pipeline Step Types ──

export type PipelineStepStatus = "pending" | "active" | "completed" | "error";

export interface PipelineStep {
  id: string;
  label: string;
  description: string;
  status: PipelineStepStatus;
}
