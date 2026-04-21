import type {
  DashboardSummary,
  DocumentAnalysis,
  EvidenceMatch,
  Project,
  Requirement,
  RiskFactor,
  SubmissionReadiness,
  TenderFlowRepository,
} from '../domain/tenderflow';
import {createApiClient} from './apiClient';

export function getTenderFlowApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || 'http://localhost:4000';
}

export function createTenderFlowApiRepository(options?: {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}): TenderFlowRepository {
  const client = createApiClient({
    baseUrl: options?.baseUrl ?? getTenderFlowApiBaseUrl(),
    fetchImpl: options?.fetchImpl,
  });

  return {
    getDashboardSummary: () => client.get<DashboardSummary>('/api/dashboard'),
    listProjects: () => client.get<Project[]>('/api/projects'),
    getProject: (projectId) => client.get<Project>(`/api/projects/${projectId}`),
    getDocumentAnalysis: (projectId) => client.get<DocumentAnalysis>(`/api/projects/${projectId}/analysis`),
    listRequirements: (projectId) => client.get<Requirement[]>(`/api/projects/${projectId}/requirements`),
    listEvidenceMatches: (projectId) => client.get<EvidenceMatch[]>(`/api/projects/${projectId}/matches`),
    listRisks: (projectId) => client.get<RiskFactor[]>(`/api/projects/${projectId}/risks`),
    getSubmissionReadiness: (projectId) => client.get<SubmissionReadiness>(`/api/projects/${projectId}/export-readiness`),
  };
}

