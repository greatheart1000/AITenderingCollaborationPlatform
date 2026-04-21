import request from 'supertest';
import {createApp} from '../app/createApp';
import * as repository from '../modules/projects/projectRepository';

describe('starter API shape', () => {
  test('exposes health and project collection endpoints', async () => {
    const app = createApp({
      repository: {
        ...repository,
        ...({
          listProjects: async () => [],
        } satisfies Partial<typeof repository>),
      },
    });

    const health = await request(app).get('/api/health');
    const projects = await request(app).get('/api/projects');

    expect(health.status).toBe(200);
    expect(health.body).toEqual({status: 'ok'});
    expect(projects.status).toBe(200);
  });
});
