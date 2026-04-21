CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'BID_MANAGER', 'REVIEWER');
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'ANALYSIS', 'COMPLIANCE_CHECK', 'MATERIAL_MATCHING', 'RISK_AUDIT', 'FINAL_AUDIT', 'SUBMITTED', 'AWARDED', 'REJECTED');
CREATE TYPE "WorkflowStage" AS ENUM ('ANALYSIS', 'COMPLIANCE', 'MATCHING', 'DRAFTING', 'AUDIT', 'EXPORT');
CREATE TYPE "RequirementStatus" AS ENUM ('MET', 'UNMET', 'UNCERTAIN');
CREATE TYPE "RiskImpact" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "RiskStatus" AS ENUM ('OPEN', 'MITIGATED', 'RESOLVED');
CREATE TYPE "AssetType" AS ENUM ('QUALIFICATION', 'PERSONNEL', 'CERTIFICATE', 'EXPERIENCE', 'FINANCIAL', 'AUTHORIZATION');
CREATE TYPE "MatchStatus" AS ENUM ('MATCHED', 'MISSING', 'EXPIRED', 'REVIEW', 'LOW_CONFIDENCE');
CREATE TYPE "BidDocumentStatus" AS ENUM ('UPLOADED', 'PARSED', 'REVIEWED');
CREATE TYPE "ExportJobStatus" AS ENUM ('READY', 'PENDING', 'FAILED');
CREATE TYPE "AuditActorType" AS ENUM ('SYSTEM', 'USER', 'AI');

CREATE TABLE "Organization" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "industry" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "role" "UserRole" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Project" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "code" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "issuer" TEXT NOT NULL,
  "deadline" TIMESTAMP(3) NOT NULL,
  "status" "ProjectStatus" NOT NULL,
  "valueDisplay" TEXT NOT NULL,
  "riskScore" INTEGER NOT NULL,
  "category" TEXT NOT NULL,
  "stage" "WorkflowStage" NOT NULL,
  "completeness" INTEGER NOT NULL,
  "nextAction" TEXT NOT NULL,
  "executiveSummary" TEXT,
  "suggestedStrategy" TEXT,
  "parseConfidence" DOUBLE PRECISION,
  "extractedAt" TIMESTAMP(3),
  "sourceDocumentName" TEXT,
  "sourceDocumentPages" INTEGER,
  "sourceDocumentVersion" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "ProjectBlocker" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "severity" "RiskImpact" NOT NULL,
  "owner" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  CONSTRAINT "ProjectBlocker_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "userId" TEXT,
  "actor" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "actorType" "AuditActorType" NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AuditLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "BidDocument" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "version" TEXT NOT NULL,
  "pageCount" INTEGER NOT NULL,
  "status" "BidDocumentStatus" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BidDocument_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Requirement" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "requirement" TEXT NOT NULL,
  "status" "RequirementStatus" NOT NULL,
  "priority" "RiskImpact" NOT NULL,
  "sourceText" TEXT NOT NULL,
  "sourceDoc" TEXT NOT NULL,
  "isHighRisk" BOOLEAN NOT NULL DEFAULT false,
  "confidence" DOUBLE PRECISION NOT NULL,
  CONSTRAINT "Requirement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ComplianceItem" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "requirementId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "requirement" TEXT NOT NULL,
  "status" "RequirementStatus" NOT NULL,
  "priority" "RiskImpact" NOT NULL,
  "sourceText" TEXT NOT NULL,
  "sourceDoc" TEXT NOT NULL,
  "isHighRisk" BOOLEAN NOT NULL DEFAULT false,
  "confidence" DOUBLE PRECISION NOT NULL,
  CONSTRAINT "ComplianceItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ComplianceItem_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "RiskItem" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "factor" TEXT NOT NULL,
  "impact" "RiskImpact" NOT NULL,
  "mitigation" TEXT NOT NULL,
  "affectedSection" TEXT NOT NULL,
  "status" "RiskStatus" NOT NULL,
  "owner" TEXT NOT NULL,
  CONSTRAINT "RiskItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Asset" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" "AssetType" NOT NULL,
  "evidence" TEXT,
  "expirationDate" TIMESTAMP(3),
  CONSTRAINT "Asset_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "EvidenceMatch" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "requirementId" TEXT NOT NULL,
  "assetId" TEXT,
  "name" TEXT NOT NULL,
  "type" "AssetType" NOT NULL,
  "status" "MatchStatus" NOT NULL,
  "requiredBy" TEXT NOT NULL,
  "evidence" TEXT,
  "expirationDate" TIMESTAMP(3),
  "confidence" DOUBLE PRECISION NOT NULL,
  "recommendation" TEXT NOT NULL,
  CONSTRAINT "EvidenceMatch_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "EvidenceMatch_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "EvidenceMatch_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "ExportJob" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "isCurrent" BOOLEAN NOT NULL DEFAULT false,
  "readiness" INTEGER,
  "status" "ExportJobStatus" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ExportJob_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ExportJob_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ExportCheck" (
  "id" TEXT PRIMARY KEY,
  "exportJobId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "owner" TEXT NOT NULL,
  "message" TEXT,
  CONSTRAINT "ExportCheck_exportJobId_fkey" FOREIGN KEY ("exportJobId") REFERENCES "ExportJob"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ProjectKeyFact" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "tone" TEXT,
  CONSTRAINT "ProjectKeyFact_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

