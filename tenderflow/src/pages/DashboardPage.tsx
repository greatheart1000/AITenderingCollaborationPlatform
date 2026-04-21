import {ChevronRight} from 'lucide-react';
import {Link} from 'react-router-dom';
import {MetricCard, Panel} from '../components/ui/Panel';
import {PageHeader} from '../components/ui/PageHeader';
import {ProjectStatusBadge, RiskBadge} from '../components/ui/Status';
import {EmptyState, ErrorState, LoadingState} from '../components/ui/StateViews';
import {tenderFlowRepository} from '../services/tenderFlowService';
import {useAsyncData} from './useAsyncData';

export function DashboardPage() {
  const {data, error, isLoading} = useAsyncData(() => tenderFlowRepository.getDashboardSummary(), []);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <EmptyState title="No dashboard data" message="The dashboard repository returned no data." />;

  return (
    <>
      <PageHeader
        eyebrow="Executive dashboard"
        title="Bidding Workshop"
        description="A practical command surface for active bids, evidence gaps, risk signals, and delivery readiness."
      />
      <div className="mb-8 grid gap-5 md:grid-cols-4">
        {data.metrics.map((metric) => <div key={metric.id}><MetricCard label={metric.label} value={metric.value} note={metric.note} /></div>)}
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <Panel>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-serif italic font-bold">Pipeline</h2>
            <Link to="/projects" className="text-xs font-bold text-brand-accent">View all projects</Link>
          </div>
          <div className="space-y-3">
            {data.pipeline.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}/command`} className="grid gap-4 rounded-3xl bg-bg-base/45 p-5 transition hover:bg-bg-base md:grid-cols-[1fr_120px_120px_24px] md:items-center">
                <div>
                  <h3 className="font-bold">{project.title}</h3>
                  <p className="mt-1 text-xs font-medium text-brand-primary/45">{project.code} · {project.issuer}</p>
                </div>
                <ProjectStatusBadge status={project.status} />
                <div className="text-xs font-bold text-brand-primary/50">{project.deadline}</div>
                <ChevronRight size={18} className="text-brand-primary/25" />
              </Link>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-serif italic font-bold">Critical Alerts</h2>
          <div className="space-y-4">
            {data.criticalAlerts.map((risk) => (
              <div key={risk.id} className="rounded-3xl bg-bg-base/45 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <RiskBadge impact={risk.impact} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/35">{risk.owner}</span>
                </div>
                <p className="text-sm font-bold leading-5">{risk.factor}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
