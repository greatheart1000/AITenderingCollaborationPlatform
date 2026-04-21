import cors from 'cors';
import express from 'express';
import {createProjectRouter, type ProjectRepository} from '../modules/projects/projectRoutes';

export function createApp(overrides?: {repository?: ProjectRepository}) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({status: 'ok'});
  });

  app.use('/api', createProjectRouter(overrides?.repository));

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({message});
  });

  return app;
}
