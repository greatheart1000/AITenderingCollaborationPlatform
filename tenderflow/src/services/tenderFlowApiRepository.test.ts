import {createTenderFlowApiRepository} from './tenderFlowApiRepository';

describe('tenderFlowApiRepository', () => {
  test('calls the backend dashboard endpoint and returns repository-shaped data', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        metrics: [],
        pipeline: [{id: 'p-1', title: 'Demo', status: 'analysis', stage: 'analysis'}],
        criticalAlerts: [],
        upcomingDeadlines: [],
      }),
    });

    const repository = createTenderFlowApiRepository({
      baseUrl: 'http://localhost:4000',
      fetchImpl: fetchMock as typeof fetch,
    });

    const dashboard = await repository.getDashboardSummary();

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:4000/api/dashboard', expect.any(Object));
    expect(dashboard.pipeline[0]).toMatchObject({
      id: 'p-1',
      title: 'Demo',
      status: 'analysis',
      stage: 'analysis',
    });
  });
});
