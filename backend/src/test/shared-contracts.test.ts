import {workflowStages} from '@tenderflow/shared';

describe('shared tenderflow contracts', () => {
  test('exports the current workflow stages expected by the frontend', () => {
    expect(workflowStages.map((stage) => stage.path)).toEqual([
      'analysis',
      'compliance',
      'matching',
      'risk',
      'export',
    ]);
  });
});

