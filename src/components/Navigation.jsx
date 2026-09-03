import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  Terminal, 
  FileText, 
  RefreshCw, 
  UserCheck, 
  AlertCircle,
  Activity,
  GitPullRequest
} from 'lucide-react';

export default function Navigation({ 
  currentRole, 
  setCurrentRole, 
  activeTab, 
  setActiveTab, 
  summary, 
  isRollbackActive 
}) {
  const roles = [
    { id: 'finance', name: 'Finance Controller', icon: TrendingUp, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { id: 'engineering', name: 'Engineering Lead', icon: Terminal, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
    { id: 'product', name: 'VP of Product', icon: Layers, color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' }
  ];

  const tabs = [
    { id: 'finance', label: 'Finance View', icon: TrendingUp, rolesAllowed: ['finance'] },
    { id: 'engineering', label: 'Engineering Dev Envs', icon: Terminal, rolesAllowed: ['engineering', 'finance'] },
    { id: 'product', label: 'Product & Customer Economics', icon: Layers, rolesAllowed: ['product', 'finance'] },
    { id: 'reconciliation', label: 'Migration & Rollback', icon: RefreshCw, rolesAllowed: ['finance', 'engineering', 'product'] },
    { id: 'edgecases', label: 'Edge Case Suite', icon: Activity, rolesAllowed: ['finance', 'engineering', 'product'] },
    { id: 'docs', label: 'Architecture & Docs', icon: FileText, rolesAllowed: ['finance', 'engineering', 'product'] }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      {/* Top Notification Bar if Rollback Active */}
      {isRollbackActive && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-1.5 px-4 text-xs text-amber-400 flex items-center justify-between font-mono">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />
            <strong>LEGACY ROLLBACK MODE ACTIVE:</strong> Engine running on Snapshot Rule V1.0.0 (Attribution Rate capped at 41.2%)
          </span>
          <span className="text-slate-400">Reconciliation Balanced ($0.00 Variance)</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-slate-100 tracking-tight">FinOps Unit Economics</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono border border-cyan-500/20">
                  v2.4.0 Live
                </span>
              </div>
              <p className="text-xs text-slate-400">Cloud Spend & Ephemeral Dev Env Attribution Engine</p>
            </div>
          </div>

          {/* Right Header Status Indicators & Role Selector */}
          <div className="flex items-center gap-4">
            {/* Freshness Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-slate-400">Freshness:</span>
              <span className="font-mono text-slate-200">5m ago (15:20:00)</span>
            </div>

            {/* Attribution % Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">Attributed:</span>
              <span className={`font-semibold ${summary.attribution_rate_percent >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {summary.attribution_rate_percent}%
              </span>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              {roles.map(role => {
                const Icon = role.icon;
                const isActive = currentRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      setCurrentRole(role.id);
                      if (role.id === 'engineering' && activeTab === 'finance') setActiveTab('engineering');
                      if (role.id === 'product' && activeTab === 'finance') setActiveTab('product');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive 
                        ? `${role.color} border shadow-sm` 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{role.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <nav className="flex space-x-1 border-t border-slate-800/60 pt-1 pb-2 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
