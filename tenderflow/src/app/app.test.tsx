import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import App from '../App';
import {tenderFlowRepository} from '../services/tenderFlowService';

describe('TenderFlow routing shell', () => {
  test('renders the project list route when opening /projects', async () => {
    vi.spyOn(tenderFlowRepository, 'listProjects').mockResolvedValueOnce([
      {
        id: 'project-1',
        code: 'P-001',
        title: 'Project Registry Demo',
        issuer: 'Demo Issuer',
        deadline: '2026-05-01',
        status: 'analysis',
        value: '￥1,000,000',
        riskScore: 20,
        category: 'Demo',
        owner: 'Demo Owner',
        stage: 'analysis',
        completeness: 12,
        nextAction: 'Continue',
        blockers: [],
        activityLog: [],
      },
    ]);

    render(
      <MemoryRouter initialEntries={['/projects']}>
        <App />
      </MemoryRouter>,
    );

    const headings = await screen.findAllByRole('heading', {name: /project registry/i});
    expect(headings[0]).toBeInTheDocument();
  });
});
