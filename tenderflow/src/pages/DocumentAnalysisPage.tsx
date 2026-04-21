import {Panel} from '../components/ui/Panel';
import {PageHeader} from '../components/ui/PageHeader';
import {RiskBadge} from '../components/ui/Status';
import {EmptyState, ErrorState, LoadingState} from '../components/ui/StateViews';
import {tenderFlowRepository} from '../services/tenderFlowService';
import {useAsyncData} from './useAsyncData';
import {useProjectId} from './projectPageHelpers';

export function DocumentAnalysisPage() {
  const projectId = useProjectId();
  const {data, error, isLoading} = useAsyncData(() => tenderFlowRepository.getDocumentAnalysis(projectId), [projectId]);

  if (isLoading) return <LoadingState label="Loading document analysis..." />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <EmptyState title="No analysis available" message="Upload and parse a tender document to populate this screen." />;

  return (
    <>
      <PageHeader eyebrow={data.sourceDocument.name} title="Document Analysis" description={data.executiveSummary} />
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <Panel>
          <h2 className="mb-4 text-xl font-serif italic font-bold">AI Strategy</h2>
          <p className="text-sm font-medium leading-7 text-brand-primary/65">{data.suggestedStrategy}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {data.keyFacts.map((fact) => (
              <div key={fact.label} className="rounded-3xl bg-bg-base/45 p-5">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-brand-primary/35">{fact.label}</p>
                <p className="font-bold">{fact.value}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-serif italic font-bold">Risk Map</h2>
          <div className="space-y-4">
            {data.risks.map((risk) => (
              <div key={risk.id} className="rounded-3xl bg-bg-base/45 p-5">
                <RiskBadge impact={risk.impact} />
                <p className="mt-3 text-sm font-bold leading-5">{risk.factor}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

