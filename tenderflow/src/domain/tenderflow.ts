export type ProjectStatus =
  | 'draft'
  | 'under_review'
  | 'analysis'
  | 'compliance_check'
  | 'material_matching'
  | 'risk_audit'
  | 'final_audit'
  | 'submitted'
  | 'awarded'
  | 'rejected';

export type WorkflowStage =
  | 'analysis'
  | 'compliance'
  | 'matching'
  | 'drafting'
  | 'audit'
  | 'export';

export type RiskImpact = 'low' | 'medium' | 'high';
export type RiskStatus = 'open' | 'mitigated' | 'resolved';
export type RequirementStatus = 'met' | 'unmet' | 'uncertain';
export type MatchStatus = 'matched' | 'missing' | 'expired' | 'review' | 'low_confidence';
export type AssetType = 'qualification' | 'personnel' | 'certificate' | 'experience' | 'financial' | 'authorization';

export interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  type: 'system' | 'user' | 'ai';
}

export interface Blocker {
  id: string;
  title: string;
  severity: RiskImpact;
  owner: string;
  status: 'active' | 'resolved';
}

export interface Project {
  id: string;
  code: string;
  title: string;
  issuer: string;
  deadline: string;
  status: ProjectStatus;
  value: string;
  riskScore: number;
  category: string;
  owner: string;
  stage: WorkflowStage;
  completeness: number;
  nextAction: string;
  blockers: Blocker[];
  activityLog: ActivityLog[];
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  note: string;
  tone: 'blue' | 'green' | 'amber' | 'red' | 'ink';
}

export interface DashboardSummary {
  metrics: DashboardMetric[];
  pipeline: Project[];
  criticalAlerts: RiskFactor[];
  upcomingDeadlines: Array<{
    id: string;
    projectId: string;
    label: string;
    dueAt: string;
  }>;
}

export interface Requirement {
  id: string;
  projectId: string;
  title: string;
  requirement: string;
  status: RequirementStatus;
  priority: RiskImpact;
  sourceText: string;
  sourceDoc: string;
  isHighRisk: boolean;
  confidence: number;
}

export interface EvidenceMatch {
  id: string;
  projectId: string;
  requirementId: string;
  name: string;
  type: AssetType;
  status: MatchStatus;
  requiredBy: string;
  evidence?: string;
  expirationDate?: string;
  confidence: number;
  recommendation: string;
}

export interface RiskFactor {
  id: string;
  projectId: string;
  category: 'legal' | 'technical' | 'commercial' | 'operational';
  factor: string;
  impact: RiskImpact;
  mitigation: string;
  affectedSection: string;
  status: RiskStatus;
  owner: string;
}

export interface DocumentAnalysis {
  projectId: string;
  executiveSummary: string;
  suggestedStrategy: string;
  parseConfidence: number;
  extractedAt: string;
  sourceDocument: {
    name: string;
    pages: number;
    version: string;
  };
  keyFacts: Array<{
    label: string;
    value: string;
    tone?: 'default' | 'warning' | 'danger' | 'success';
  }>;
  requirements: Requirement[];
  risks: RiskFactor[];
  matches: EvidenceMatch[];
}

export interface SubmissionCheck {
  id: string;
  label: string;
  status: 'pass' | 'warning' | 'fail';
  owner: string;
  message?: string;
}

export interface ExportVersion {
  id: string;
  label: string;
  createdAt: string;
  createdBy: string;
  isCurrent: boolean;
}

export interface SubmissionReadiness {
  projectId: string;
  readiness: number;
  checks: SubmissionCheck[];
  versions: ExportVersion[];
}

export interface TenderFlowRepository {
  getDashboardSummary(): Promise<DashboardSummary>;
  listProjects(): Promise<Project[]>;
  getProject(projectId: string): Promise<Project | null>;
  getDocumentAnalysis(projectId: string): Promise<DocumentAnalysis | null>;
  listRequirements(projectId: string): Promise<Requirement[]>;
  listEvidenceMatches(projectId: string): Promise<EvidenceMatch[]>;
  listRisks(projectId: string): Promise<RiskFactor[]>;
  getSubmissionReadiness(projectId: string): Promise<SubmissionReadiness | null>;
}

export const workflowStages: Array<{id: WorkflowStage; label: string; path: string}> = [
  {id: 'analysis', label: 'Document Analysis', path: 'analysis'},
  {id: 'compliance', label: 'Compliance', path: 'compliance'},
  {id: 'matching', label: 'Evidence Matching', path: 'matching'},
  {id: 'audit', label: 'Risk Audit', path: 'risk'},
  {id: 'export', label: 'Export Center', path: 'export'},
];

