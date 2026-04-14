export type ICPDimension =
  | "industry"
  | "companySize"
  | "targetTitles"
  | "seniorityLevels"
  | "geos"
  | "painPoints"
  | "techStack"
  | "triggers"
  | "exclusions";

export interface ICP {
  id: string;
  sourceUrl: string;
  sourceCompanyName: string;
  companyDescription: string;
  valueProposition: string;
  industry: string[];
  companySize: { min: number; max: number };
  targetTitles: string[];
  seniorityLevels: string[];
  geos: string[];
  painPoints: string[];
  techStack: string[];
  triggers: string[];
  exclusions: string[];
  createdAt: string;
}

export interface FitSignal {
  label: string;
  dimension: ICPDimension;
}

export type EmailStatus = "verified" | "catch-all" | "invalid" | "unknown";

export interface Source {
  title: string;
  url: string;
  snippet: string;
}

export interface DimensionEvidence {
  dimension: ICPDimension;
  confidence: number;
  reasoning: string;
  sources: Source[];
}

export interface ProofPack {
  summary: string;
  dimensions: DimensionEvidence[];
}

export interface Lead {
  id: string;
  icpId: string;
  company: string;
  companyDomain: string;
  contactName: string;
  contactTitle: string;
  contactLinkedIn?: string;
  contactEmail?: string;
  emailStatus?: EmailStatus;
  score: number;
  scoredAt: string;
  fitSignals: FitSignal[];
  proofPack: ProofPack;
}

export type CampaignStatus = "warming" | "active" | "paused";

export interface CampaignStep {
  day: number;
  subject: string;
  body: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  icpId: string;
  leadsEnrolled: number;
  sent: number;
  opened: number;
  replied: number;
  createdAt: string;
  sequence: CampaignStep[];
}

export interface SearchHistoryEntry {
  id: string;
  icpId: string;
  sourceUrl: string;
  sourceCompanyName: string;
  leadCount: number;
  runAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface User {
  name: string;
  email: string;
  company: string;
  plan: "free" | "starter" | "growth" | "scale";
  avatarUrl?: string;
  usage: {
    leadsUsed: number;
    leadsLimit: number;
    searchesUsed: number;
    searchesLimit: number;
  };
}
