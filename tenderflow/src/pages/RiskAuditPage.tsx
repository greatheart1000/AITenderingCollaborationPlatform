import {Panel} from '../components/ui/Panel';
import {PageHeader} from '../components/ui/PageHeader';
import {RiskBadge} from '../components/ui/Status';
import {EmptyState, ErrorState, LoadingState} from '../components/ui/StateViews';
import {tenderFlowRepository} from '../services/tenderFlowService';
import {useProjectId} from './projectPageHelpers';
import {useAsyncData} from './useAsyncData';

export function RiskAuditPage() {
  const projectId = useProjectId();
  const {data: risks, error, isLoading} = useAsyncData(() => tenderFlowRepository.listRisks(projectId), [projectId]);

  if (isLoading) return <LoadingState label="Loading risk audit..." />;
  if (error) return <ErrorState message={error} />;
  if (!risks?.length) return <EmptyState title="No risks found" message="Risk signals will appear after document analysis." />;

  return (
    <>
      <PageHeader eyebrow="Audit control" title="Risk Audit" description="Operational, legal, commercial, and technical risks with mitigation owners." />
      <div className="space-y-5">
        {risks.map((risk) => (
          <div key={risk.id}>
            <Panel>
            <div className="mb-4 flex items-center justify-between">
              <RiskBadge impact={risk.impact} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/35">{risk.affectedSection}</span>
            </div>
            <h2 className="mb-4 text-xl font-bold">{risk.factor}</h2>
            <p className="rounded-3xl bg-brand-primary p-5 text-sm font-medium leading-6 text-white/75">{risk.mitigation}</p>
            </Panel>
          </div>
        ))}
      </div>
    </>
  );
}
