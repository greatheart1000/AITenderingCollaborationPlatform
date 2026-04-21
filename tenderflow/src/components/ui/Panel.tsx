import type {ReactNode} from 'react';

export function Panel({children, className = ''}: {children: ReactNode; className?: string}) {
  return <section className={`rounded-[2.5rem] bg-white p-7 shadow-sm ring-1 ring-black/5 ${className}`}>{children}</section>;
}

export function MetricCard({label, value, note, className = ''}: {label: string; value: string; note: string; className?: string}) {
  return (
    <div className={`rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5 ${className}`}>
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-primary/35">{label}</p>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      <p className="mt-3 text-xs font-bold text-brand-primary/35">{note}</p>
    </div>
  );
}
