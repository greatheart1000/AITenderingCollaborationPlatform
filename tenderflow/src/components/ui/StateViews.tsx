import {AlertCircle, Loader2} from 'lucide-react';

export function LoadingState({label = 'Loading TenderFlow workspace...'}: {label?: string}) {
  return (
    <div className="flex min-h-72 items-center justify-center rounded-[2rem] bg-white/70 text-sm font-bold text-brand-primary/50">
      <Loader2 className="mr-3 animate-spin text-brand-accent" size={18} />
      {label}
    </div>
  );
}

export function EmptyState({title, message}: {title: string; message: string}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-line bg-white p-10 text-center">
      <h2 className="mb-2 text-2xl font-serif italic">{title}</h2>
      <p className="text-sm font-medium text-brand-primary/50">{message}</p>
    </div>
  );
}

export function ErrorState({title = 'Something went wrong', message}: {title?: string; message: string}) {
  return (
    <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-red-900">
      <div className="mb-2 flex items-center gap-2 font-bold">
        <AlertCircle size={18} />
        {title}
      </div>
      <p className="text-sm">{message}</p>
    </div>
  );
}
