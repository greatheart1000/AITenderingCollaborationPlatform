import {Panel} from '../components/ui/Panel';
import {PageHeader} from '../components/ui/PageHeader';
import {RequirementStatusBadge} from '../components/ui/Status';
import {EmptyState, ErrorState, LoadingState} from '../components/ui/StateViews';
import {tenderFlowRepository} from '../services/tenderFlowService';
import {useProjectId} from './projectPageHelpers';
import {useAsyncData} from './useAsyncData';

export function CompliancePage() {
  const projectId = useProjectId();
  const {data: requirements, error, isLoading} = useAsyncData(() => tenderFlowRepository.listRequirements(projectId), [projectId]);

  if (isLoading) return <LoadingState label="Loading compliance checklist..." />;
  if (error) return <ErrorState message={error} />;
  if (!requirements?.length) return <EmptyState title="No compliance items" message="Parsed requirements will appear here." />;

  return (
    <>
      <PageHeader eyebrow="Review gate" title="Compliance Checklist" description="Requirement-level evidence traceability and high-risk tender clauses ready for human review." />
      <Panel className="space-y-4">
        {requirements.map((item) => (
          <div key={item.id} className="rounded-3xl bg-bg-base/45 p-5">
            <div className="mb-3 flex items-center justify-between">
              <RequirementStatusBadge status={item.status} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/35">{item.sourceDoc}</span>
            </div>
            <h2 className="font-bold">{item.requirement}</h2>
            <p className="mt-3 text-sm leading-6 text-brand-primary/55">{item.sourceText}</p>
          </div>
        ))}
      </Panel>
    </>
  );
}

