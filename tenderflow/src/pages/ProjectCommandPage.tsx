import {Link} from 'react-router-dom';
import {Panel} from '../components/ui/Panel';
import {PageHeader} from '../components/ui/PageHeader';
import {ProjectStatusBadge} from '../components/ui/Status';
import {EmptyState, ErrorState, LoadingState} from '../components/ui/StateViews';
import {workflowStages} from '../domain/tenderflow';
import {tenderFlowRepository} from '../services/tenderFlowService';
import {useAsyncData} from './useAsyncData';
import {useProjectId} from './projectPageHelpers';

export function ProjectCommandPage() {
  const projectId = useProjectId();
  const {data: project, error, isLoading} = useAsyncData(() => tenderFlowRepository.getProject(projectId), [projectId]);

  if (isLoading) return <LoadingState label="Loading command center..." />;
  if (error) return <ErrorState message={error} />;
  if (!project) return <EmptyState title="Project not found" message="Select an existing project from the registry." />;

  return (
    <>
      <PageHeader
        eyebrow={project.code}
        title="Project Command Center"
        description={project.nextAction}
        actions={<ProjectStatusBadge status={project.status} />}
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <Panel>
          <h2 className="mb-5 text-xl font-serif italic font-bold">{project.title}</h2>
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Meta label="Issuer" value={project.issuer} />
            <Meta label="Owner" value={project.owner} />
            <Meta label="Value" value={project.value} />
            <Meta label="Deadline" value={project.deadline} />
          </div>
          <div className="grid gap-3 md:grid-cols-5">
            {workflowStages.map((stage) => (
              <Link key={stage.id} to={`../${stage.path}`} className="rounded-3xl bg-bg-base/50 p-5 text-center text-xs font-bold transition hover:bg-brand-primary hover:text-white">
                {stage.label}
              </Link>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-serif italic font-bold">Blockers</h2>
          <div className="space-y-4">
            {project.blockers.length ? project.blockers.map((blocker) => (
              <div key={blocker.id} className="rounded-3xl bg-red-50 p-5 text-red-950">
                <p className="font-bold">{blocker.title}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-red-900/45">{blocker.owner} · {blocker.severity}</p>
              </div>
            )) : <p className="text-sm font-medium text-brand-primary/45">No active blockers.</p>}
          </div>
        </Panel>
      </div>
    </>
  );
}

function Meta({label, value}: {label: string; value: string}) {
  return (
    <div className="rounded-3xl bg-bg-base/45 p-5">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-brand-primary/35">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}

