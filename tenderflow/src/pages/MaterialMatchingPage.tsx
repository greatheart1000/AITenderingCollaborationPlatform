import {Panel} from '../components/ui/Panel';
import {PageHeader} from '../components/ui/PageHeader';
import {MatchStatusBadge} from '../components/ui/Status';
import {EmptyState, ErrorState, LoadingState} from '../components/ui/StateViews';
import {tenderFlowRepository} from '../services/tenderFlowService';
import {useProjectId} from './projectPageHelpers';
import {useAsyncData} from './useAsyncData';

export function MaterialMatchingPage() {
  const projectId = useProjectId();
  const {data: matches, error, isLoading} = useAsyncData(() => tenderFlowRepository.listEvidenceMatches(projectId), [projectId]);

  if (isLoading) return <LoadingState label="Loading evidence matching..." />;
  if (error) return <ErrorState message={error} />;
  if (!matches?.length) return <EmptyState title="No evidence matches" message="Company assets will be matched here after analysis." />;

  return (
    <>
      <PageHeader eyebrow="Company asset library" title="Material & Evidence Matching" description="Evidence cards connect tender requirements to qualifications, personnel, certificates, and past performance." />
      <div className="grid gap-6 md:grid-cols-2">
        {matches.map((match) => (
          <div key={match.id}>
            <Panel>
            <div className="mb-4 flex items-center justify-between">
              <MatchStatusBadge status={match.status} />
              <span className="text-xs font-bold text-brand-primary/40">{Math.round(match.confidence * 100)}%</span>
            </div>
            <h2 className="mb-2 text-lg font-bold">{match.name}</h2>
            <p className="text-sm font-medium text-brand-primary/55">{match.requiredBy}</p>
            <p className="mt-5 rounded-3xl bg-bg-base/45 p-4 text-sm leading-6">{match.recommendation}</p>
            </Panel>
          </div>
        ))}
      </div>
    </>
  );
}
