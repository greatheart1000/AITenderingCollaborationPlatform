import {Router} from 'express';
import {toDashboardSummary, toDocumentAnalysis, toMatch, toProject, toRequirement, toRisk, toSubmissionReadiness} from './projectMappers';
import * as repository from './projectRepository';

export type ProjectRepository = typeof repository;

export function createProjectRouter(projectRepository: ProjectRepository = repository) {
  const router = Router();

  router.get('/dashboard', async (_req, res, next) => {
    try {
      const payload = await projectRepository.getDashboardPayload();
      res.json(toDashboardSummary(payload));
    } catch (error) {
      next(error);
    }
  });

  router.get('/projects', async (_req, res, next) => {
    try {
      const projects = await projectRepository.listProjects();
      res.json(projects.map(toProject));
    } catch (error) {
      next(error);
    }
  });

  router.get('/projects/:projectId', async (req, res, next) => {
    try {
      const project = await projectRepository.getProject(req.params.projectId);
      if (!project) {
        res.status(404).json({message: 'Project not found'});
        return;
      }
      res.json(toProject(project));
    } catch (error) {
      next(error);
    }
  });

  router.get('/projects/:projectId/analysis', async (req, res, next) => {
    try {
      const project = await projectRepository.getDocumentAnalysis(req.params.projectId);
      if (!project) {
        res.status(404).json({message: 'Analysis not found'});
        return;
      }
      res.json(toDocumentAnalysis(project));
    } catch (error) {
      next(error);
    }
  });

  router.get('/projects/:projectId/requirements', async (req, res, next) => {
    try {
      const items = await projectRepository.listRequirements(req.params.projectId);
      res.json(items.map(toRequirement));
    } catch (error) {
      next(error);
    }
  });

  router.get('/projects/:projectId/matches', async (req, res, next) => {
    try {
      const items = await projectRepository.listMatches(req.params.projectId);
      res.json(items.map(toMatch));
    } catch (error) {
      next(error);
    }
  });

  router.get('/projects/:projectId/risks', async (req, res, next) => {
    try {
      const items = await projectRepository.listRisks(req.params.projectId);
      res.json(items.map(toRisk));
    } catch (error) {
      next(error);
    }
  });

  router.get('/projects/:projectId/export-readiness', async (req, res, next) => {
    try {
      const jobs = await projectRepository.getSubmissionReadiness(req.params.projectId);
      const readiness = toSubmissionReadiness(req.params.projectId, jobs);
      if (!readiness) {
        res.status(404).json({message: 'Export readiness not found'});
        return;
      }
      res.json(readiness);
    } catch (error) {
      next(error);
    }
  });

  router.get('/organizations', async (_req, res, next) => {
    try {
      const organizations = await projectRepository.listOrganizations();
      res.json(organizations);
    } catch (error) {
      next(error);
    }
  });

  router.get('/users', async (_req, res, next) => {
    try {
      const users = await projectRepository.listUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  });

  router.get('/bid-documents', async (req, res, next) => {
    try {
      const documents = await projectRepository.listBidDocuments(req.query.projectId as string | undefined);
      res.json(documents);
    } catch (error) {
      next(error);
    }
  });

  router.get('/assets', async (_req, res, next) => {
    try {
      const assets = await projectRepository.listAssets();
      res.json(assets);
    } catch (error) {
      next(error);
    }
  });

  router.get('/export-jobs', async (req, res, next) => {
    try {
      const jobs = await projectRepository.listExportJobs(req.query.projectId as string | undefined);
      res.json(jobs);
    } catch (error) {
      next(error);
    }
  });

  router.get('/audit-logs', async (req, res, next) => {
    try {
      const logs = await projectRepository.listAuditLogs(req.query.projectId as string | undefined);
      res.json(logs);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
