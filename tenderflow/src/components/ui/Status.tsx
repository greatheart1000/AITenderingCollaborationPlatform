import type {ReactNode} from 'react';
import type {MatchStatus, ProjectStatus, RequirementStatus, RiskImpact} from '../../domain/tenderflow';

const toneClasses = {
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
  ink: 'bg-slate-100 text-slate-700',
};

export function Badge({children, tone = 'ink'}: {children: ReactNode; tone?: keyof typeof toneClasses}) {
  return <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${toneClasses[tone]}`}>{children}</span>;
}

export function ProjectStatusBadge({status}: {status: ProjectStatus}) {
  const tone = status === 'final_audit' || status === 'analysis' ? 'blue' : status === 'compliance_check' ? 'amber' : status === 'submitted' ? 'green' : 'ink';
  return <Badge tone={tone}>{status.replaceAll('_', ' ')}</Badge>;
}

export function RequirementStatusBadge({status}: {status: RequirementStatus}) {
  const tone = status === 'met' ? 'green' : status === 'unmet' ? 'red' : 'amber';
  return <Badge tone={tone}>{status}</Badge>;
}

export function MatchStatusBadge({status}: {status: MatchStatus}) {
  const tone = status === 'matched' ? 'green' : status === 'missing' || status === 'expired' ? 'red' : 'amber';
  return <Badge tone={tone}>{status.replaceAll('_', ' ')}</Badge>;
}

export function RiskBadge({impact}: {impact: RiskImpact}) {
  const tone = impact === 'high' ? 'red' : impact === 'medium' ? 'amber' : 'green';
  return <Badge tone={tone}>{impact}</Badge>;
}
