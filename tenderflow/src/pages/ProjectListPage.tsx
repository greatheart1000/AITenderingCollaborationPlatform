import {Link} from 'react-router-dom';
import {Panel} from '../components/ui/Panel';
import {PageHeader} from '../components/ui/PageHeader';
import {ProjectStatusBadge} from '../components/ui/Status';
import {EmptyState, ErrorState, LoadingState} from '../components/ui/StateViews';
import {tenderFlowRepository} from '../services/tenderFlowService';
import {useAsyncData} from './useAsyncData';

export function ProjectListPage() {
  const {data: projects, error, isLoading} = useAsyncData(() => tenderFlowRepository.listProjects(), []);

  if (isLoading) return <LoadingState label="Loading project registry..." />;
  if (error) return <ErrorState message={error} />;
  if (!projects?.length) return <EmptyState title="No projects yet" message="Import a tender file to create the first project." />;

  return (
    <>
      <PageHeader
        eyebrow="Project portfolio"
        title="Project Registry"
        description="Every active tender project, owner, deadline, risk signal, and workflow stage in one operational list."
      />
      <Panel className="overflow-hidden p-0">
        <div className="grid grid-cols-[1fr_150px_150px_120px] gap-4 bg-bg-base/60 px-7 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-primary/35">
          <span>Project</span>
          <span>Status</span>
          <span>Owner</span>
          <span>Readiness</span>
        </div>
        {projects.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}/command`} className="grid grid-cols-[1fr_150px_150px_120px] gap-4 px-7 py-5 transition hover:bg-bg-base/45">
            <div>
              <h2 className="font-bold">{project.title}</h2>
              <p className="mt-1 text-xs font-medium text-brand-primary/45">{project.code} · {project.issuer}</p>
            </div>
            <ProjectStatusBadge status={project.status} />
            <span className="text-sm font-bold text-brand-primary/55">{project.owner}</span>
            <span className="text-sm font-bold">{project.completeness}%</span>
          </Link>
        ))}
      </Panel>
    </>
  );
}
