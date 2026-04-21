import type {ReactNode} from 'react';

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-6 rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-black/5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-primary/35">{eyebrow}</p> : null}
        <h1 className="mb-3 text-4xl font-serif italic tracking-tight text-brand-primary">{title}</h1>
        <p className="max-w-3xl text-sm font-medium leading-6 text-brand-primary/50">{description}</p>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}
