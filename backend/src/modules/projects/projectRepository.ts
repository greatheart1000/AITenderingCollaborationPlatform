import {prisma} from '../../lib/prisma';

const projectInclude = {
  owner: true,
  blockers: true,
  auditLogs: {orderBy: {occurredAt: 'desc' as const}},
};

export async function listProjects() {
  return prisma.project.findMany({
    include: projectInclude,
    orderBy: {deadline: 'asc'},
  });
}

export async function getProject(projectId: string) {
  return prisma.project.findUnique({
    where: {id: projectId},
    include: projectInclude,
  });
}

export async function getDashboardPayload() {
  const [projects, risks] = await Promise.all([
    prisma.project.findMany({include: projectInclude, orderBy: {deadline: 'asc'}}),
    prisma.riskItem.findMany({orderBy: {impact: 'desc'}, take: 3}),
  ]);

  const deadlines = projects.slice(0, 2).map((project) => ({
    id: `deadline-${project.id}`,
    projectId: project.id,
    label: 'Key deadline',
    dueAt: project.deadline.toISOString().slice(0, 10),
  }));

  return {projects, risks, deadlines};
}

export async function getDocumentAnalysis(projectId: string) {
  return prisma.project.findUnique({
    where: {id: projectId},
    include: {
      keyFacts: true,
      requirements: true,
      riskItems: true,
      assetMatches: true,
    },
  });
}

export async function listRequirements(projectId: string) {
  return prisma.complianceItem.findMany({
    where: {projectId},
    orderBy: [{priority: 'desc'}, {confidence: 'desc'}],
  });
}

export async function listMatches(projectId: string) {
  return prisma.evidenceMatch.findMany({
    where: {projectId},
    orderBy: {confidence: 'desc'},
  });
}

export async function listRisks(projectId: string) {
  return prisma.riskItem.findMany({
    where: {projectId},
    orderBy: [{impact: 'desc'}, {owner: 'asc'}],
  });
}

export async function getSubmissionReadiness(projectId: string) {
  return prisma.exportJob.findMany({
    where: {projectId},
    include: {checks: true},
    orderBy: {createdAt: 'desc'},
  });
}

export async function listOrganizations() {
  return prisma.organization.findMany({orderBy: {createdAt: 'asc'}});
}

export async function listUsers() {
  return prisma.user.findMany({orderBy: {createdAt: 'asc'}});
}

export async function listBidDocuments(projectId?: string) {
  return prisma.bidDocument.findMany({
    where: projectId ? {projectId} : undefined,
    orderBy: {createdAt: 'desc'},
  });
}

export async function listAssets() {
  return prisma.asset.findMany({orderBy: {name: 'asc'}});
}

export async function listExportJobs(projectId?: string) {
  return prisma.exportJob.findMany({
    where: projectId ? {projectId} : undefined,
    include: {checks: true},
    orderBy: {createdAt: 'desc'},
  });
}

export async function listAuditLogs(projectId?: string) {
  return prisma.auditLog.findMany({
    where: projectId ? {projectId} : undefined,
    orderBy: {occurredAt: 'desc'},
  });
}

