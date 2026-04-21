import type {ComponentType, FC, SVGProps} from 'react';
import {BarChart3, Briefcase, Download, FileSearch, LayoutDashboard, ShieldAlert, ShieldCheck, UserCheck, Zap} from 'lucide-react';
import {NavLink, Outlet, useParams} from 'react-router-dom';

const mainNav = [
  {to: '/', label: 'Dashboard', icon: LayoutDashboard},
  {to: '/projects', label: 'Projects', icon: Briefcase},
];

const workflowNav = [
  {to: 'command', label: 'Command', icon: BarChart3},
  {to: 'analysis', label: 'Analysis', icon: FileSearch},
  {to: 'compliance', label: 'Compliance', icon: ShieldCheck},
  {to: 'matching', label: 'Matching', icon: UserCheck},
  {to: 'risk', label: 'Risk Audit', icon: ShieldAlert},
  {to: 'export', label: 'Export', icon: Download},
];

export function AppShell() {
  const params = useParams();
  const hasProject = Boolean(params.projectId);

  return (
    <div className="flex min-h-screen bg-bg-base text-brand-primary">
      <aside className="hidden w-72 shrink-0 flex-col bg-brand-primary text-bg-base lg:flex">
        <div className="flex items-center gap-3 p-7">
          <div className="flex h-10 w-10 rotate-6 items-center justify-center rounded-2xl bg-brand-accent text-white">
            <Zap size={20} />
          </div>
          <div>
            <div className="text-xl font-serif italic font-bold tracking-tight">TenderFlow</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">Bidding Copilot</div>
          </div>
        </div>

        <nav className="space-y-2 px-4">
          {mainNav.map((item) => (
            <ShellNavLink key={item.to} to={item.to} icon={item.icon} label={item.label} end={item.to === '/'} />
          ))}
        </nav>

        {hasProject ? (
          <div className="mt-8 border-t border-white/10 px-4 pt-8">
            <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">Active Workflow</p>
            <nav className="space-y-2">
              {workflowNav.map((item) => (
                <ShellNavLink key={item.to} to={item.to} icon={item.icon} label={item.label} />
              ))}
            </nav>
          </div>
        ) : null}
      </aside>

      <div className="min-w-0 flex-1">
        <TopBar />
        <main className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

type ShellNavLinkProps = {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  end?: boolean;
};

const ShellNavLink: FC<ShellNavLinkProps> = ({
  to,
  label,
  icon: Icon,
  end,
}) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({isActive}) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
          isActive ? 'bg-bg-base text-brand-primary shadow-xl' : 'text-white/45 hover:bg-white/10 hover:text-white'
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
};

function TopBar() {
  return (
    <div className="sticky top-0 z-10 border-b border-line bg-bg-base/85 px-5 py-4 backdrop-blur lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="lg:hidden text-lg font-serif italic font-bold">TenderFlow</div>
        <div className="hidden text-sm font-bold text-brand-primary/40 lg:block">招投标智能辅助工作台</div>
        <button className="rounded-full bg-brand-primary px-4 py-2 text-xs font-bold text-white shadow-sm">Import Tender</button>
      </div>
    </div>
  );
}
