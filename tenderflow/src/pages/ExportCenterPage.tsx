import {Panel} from '../components/ui/Panel';
import {PageHeader} from '../components/ui/PageHeader';
import {Badge} from '../components/ui/Status';
import {EmptyState, ErrorState, LoadingState} from '../components/ui/StateViews';
import {tenderFlowRepository} from '../services/tenderFlowService';
import {useProjectId} from './projectPageHelpers';
import {useAsyncData} from './useAsyncData';

export function ExportCenterPage() {
  const projectId = useProjectId();
  const {data, error, isLoading} = useAsyncData(() => tenderFlowRepository.getSubmissionReadiness(projectId), [projectId]);

  if (isLoading) return <LoadingState label="Loading submission readiness..." />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <EmptyState title="No export package" message="Export jobs will be available after review gates are complete." />;

  return (
    <>
      <PageHeader eyebrow="Final quality gate" title="Submission Readiness / Export Center" description="Pre-submission checks, export versions, and unresolved risks before tender package delivery." actions={<div className="text-4xl font-bold">{data.readiness}%</div>} />
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <Panel>
          <h2 className="mb-5 text-xl font-serif italic font-bold">Pre-submission Checks</h2>
          <div className="space-y-4">
            {data.checks.map((check) => (
              <div key={check.id} className="rounded-3xl bg-bg-base/45 p-5">
                <div className="mb-2 flex items-center justify-between">
                  <Badge tone={check.status === 'pass' ? 'green' : check.status === 'warning' ? 'amber' : 'red'}>{check.status}</Badge>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/35">{check.owner}</span>
                </div>
                <p className="font-bold">{check.label}</p>
                {check.message ? <p className="mt-2 text-sm text-brand-primary/55">{check.message}</p> : null}
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-serif italic font-bold">Versions</h2>
          <div className="space-y-4">
            {data.versions.map((version) => (
              <div key={version.id} className="rounded-3xl bg-bg-base/45 p-5">
                <p className="font-bold">{version.label}</p>
                <p className="mt-2 text-xs font-medium text-brand-primary/45">{version.createdAt} · {version.createdBy}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
