# TenderFlow Backend

Practical backend foundation for the current TenderFlow frontend.

## What this includes

- Express API in TypeScript
- Prisma schema for MVP entities
- PostgreSQL target datasource
- Seed/demo data for the current frontend screens
- Shared frontend/backend contracts via `@tenderflow/shared`
- Stub-only posture for AI/file processing for now

## Run

1. Copy `.env.example` to `.env`
2. Ensure PostgreSQL is running and `DATABASE_URL` points to an empty database
3. Install dependencies
4. Generate Prisma client
5. Apply migrations
6. Seed demo data
7. Start the server

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
npm run dev
```

Default server URL: `http://localhost:4000`

## Starter endpoints

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/projects`
- `GET /api/projects/:projectId`
- `GET /api/projects/:projectId/analysis`
- `GET /api/projects/:projectId/requirements`
- `GET /api/projects/:projectId/matches`
- `GET /api/projects/:projectId/risks`
- `GET /api/projects/:projectId/export-readiness`
- `GET /api/organizations`
- `GET /api/users`
- `GET /api/bid-documents`
- `GET /api/assets`
- `GET /api/export-jobs`
- `GET /api/audit-logs`

## Frontend swap plan

The frontend currently imports `tenderFlowRepository` from `tenderflow/src/services/tenderFlowService.ts`.

To swap mocks to real API clients later:

1. Keep the `TenderFlowRepository` interface unchanged.
2. Replace the mock implementation with an HTTP-backed implementation.
3. Map each method to the corresponding backend endpoint:
   - `getDashboardSummary` -> `GET /api/dashboard`
   - `listProjects` -> `GET /api/projects`
   - `getProject` -> `GET /api/projects/:projectId`
   - `getDocumentAnalysis` -> `GET /api/projects/:projectId/analysis`
   - `listRequirements` -> `GET /api/projects/:projectId/requirements`
   - `listEvidenceMatches` -> `GET /api/projects/:projectId/matches`
   - `listRisks` -> `GET /api/projects/:projectId/risks`
   - `getSubmissionReadiness` -> `GET /api/projects/:projectId/export-readiness`

