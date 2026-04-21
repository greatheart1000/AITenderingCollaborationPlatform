import type {
  DashboardSummary,
  DocumentAnalysis,
  EvidenceMatch,
  Project,
  Requirement,
  RiskFactor,
  SubmissionReadiness,
} from '@tenderflow/shared';
import {MatchStatus, ProjectStatus, RequirementStatus, RiskImpact, RiskStatus, WorkflowStage, type AuditActorType, type AssetType} from '@prisma/client';

export function mapProjectStatus(status: ProjectStatus): Project['status'] {
  return status.toLowerCase() as Project['status'];
}

export function mapWorkflowStage(stage: WorkflowStage): Project['stage'] {
  return stage.toLowerCase() as Project['stage'];
}

export function mapRiskImpact(impact: RiskImpact): RiskFactor['impact'] {
  return impact.toLowerCase() as RiskFactor['impact'];
}

export function mapRiskStatus(status: RiskStatus): RiskFactor['status'] {
  return status.toLowerCase() as RiskFactor['status'];
}

export function mapRequirementStatus(status: RequirementStatus): Requirement['status'] {
  return status.toLowerCase() as Requirement['status'];
}

export function mapMatchStatus(status: MatchStatus): EvidenceMatch['status'] {
  return status.toLowerCase() as EvidenceMatch['status'];
}

export function mapAssetType(type: AssetType): EvidenceMatch['type'] {
  return type.toLowerCase() as EvidenceMatch['type'];
}

export function mapAuditActorType(type: AuditActorType): Project['activityLog'][number]['type'] {
  return type.toLowerCase() as Project['activityLog'][number]['type'];
}

export function toProject(project: any): Project {
  return {
    id: project.id,
    code: project.code,
    title: project.title,
    issuer: project.issuer,
    deadline: project.deadline.toISOString().slice(0, 10),
    status: mapProjectStatus(project.status),
    value: project.valueDisplay,
    riskScore: project.riskScore,
    category: project.category,
    owner: project.owner.name,
    stage: mapWorkflowStage(project.stage),
    completeness: project.completeness,
    nextAction: project.nextAction,
    blockers: project.blockers.map((blocker: any) => ({
      id: blocker.id,
      title: blocker.title,
      severity: mapRiskImpact(blocker.severity),
      owner: blocker.owner,
      status: blocker.status as 'active' | 'resolved',
    })),
    activityLog: project.auditLogs.map((log: any) => ({
      id: log.id,
      actor: log.actor,
      action: log.action,
      timestamp: log.occurredAt.toISOString(),
      type: mapAuditActorType(log.actorType),
    })),
  };
}

export function toRequirement(item: any): Requirement {
  return {
    id: item.id,
    projectId: item.projectId,
    title: item.title,
    requirement: item.requirement,
    status: mapRequirementStatus(item.status),
    priority: mapRiskImpact(item.priority),
    sourceText: item.sourceText,
    sourceDoc: item.sourceDoc,
    isHighRisk: item.isHighRisk,
    confidence: item.confidence,
  };
}

export function toRisk(item: any): RiskFactor {
  return {
    id: item.id,
    projectId: item.projectId,
    category: item.category,
    factor: item.factor,
    impact: mapRiskImpact(item.impact),
    mitigation: item.mitigation,
    affectedSection: item.affectedSection,
    status: mapRiskStatus(item.status),
    owner: item.owner,
  };
}

export function toMatch(item: any): EvidenceMatch {
  return {
    id: item.id,
    projectId: item.projectId,
    requirementId: item.requirementId,
    name: item.name,
    type: mapAssetType(item.type),
    status: mapMatchStatus(item.status),
    requiredBy: item.requiredBy,
    evidence: item.evidence ?? undefined,
    expirationDate: item.expirationDate ? item.expirationDate.toISOString().slice(0, 10) : undefined,
    confidence: item.confidence,
    recommendation: item.recommendation,
  };
}

export function toDashboardSummary(payload: any): DashboardSummary {
  return {
    metrics: [
      {id: 'm-1', label: 'Active Bids', value: '12', note: '本周 +2', tone: 'blue'},
      {id: 'm-2', label: 'Readiness Avg.', value: '74%', note: '同比 +8%', tone: 'green'},
      {id: 'm-3', label: 'Pipeline Value', value: '￥42.1M', note: '8 个在办项', tone: 'ink'},
      {id: 'm-4', label: 'Critical Risks', value: '5', note: '需要复核', tone: 'red'},
    ],
    pipeline: payload.projects.map(toProject),
    criticalAlerts: payload.risks.map(toRisk),
    upcomingDeadlines: payload.deadlines.map((item: any) => ({
      id: item.id,
      projectId: item.projectId,
      label: item.label,
      dueAt: item.dueAt,
    })),
  };
}

export function toDocumentAnalysis(project: any): DocumentAnalysis {
  return {
    projectId: project.id,
    executiveSummary: project.executiveSummary ?? '',
    suggestedStrategy: project.suggestedStrategy ?? '',
    parseConfidence: project.parseConfidence ?? 0,
    extractedAt: project.extractedAt?.toISOString() ?? '',
    sourceDocument: {
      name: project.sourceDocumentName ?? '',
      pages: project.sourceDocumentPages ?? 0,
      version: project.sourceDocumentVersion ?? '',
    },
    keyFacts: project.keyFacts.map((fact: any) => ({
      label: fact.label,
      value: fact.value,
      tone: fact.tone ?? undefined,
    })),
    requirements: project.requirements.map(toRequirement),
    risks: project.riskItems.map(toRisk),
    matches: project.assetMatches.map(toMatch),
  };
}

export function toSubmissionReadiness(projectId: string, exportJobs: any[]): SubmissionReadiness | null {
  const currentJob = exportJobs.find((job) => job.isCurrent);
  if (!currentJob) return null;

  return {
    projectId,
    readiness: currentJob.readiness ?? 0,
    checks: currentJob.checks.map((check: any) => ({
      id: check.id,
      label: check.label,
      status: check.status as 'pass' | 'warning' | 'fail',
      owner: check.owner,
      message: check.message ?? undefined,
    })),
    versions: exportJobs.map((job) => ({
      id: job.id,
      label: job.label,
      createdAt: job.createdAt.toISOString(),
      createdBy: job.createdBy,
      isCurrent: job.isCurrent,
    })),
  };
}

