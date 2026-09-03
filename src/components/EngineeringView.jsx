import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  GitBranch, 
  GitPullRequest, 
  AlertOctagon, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  User, 
  Zap,
  Search,
  ExternalLink
} from 'lucide-react';

export default function EngineeringView({ records, telemetry, onSelectRecord }) {
  const [terminatedClusterId, setTerminatedClusterId] = useState(null);

  // Filter Tier-2 Ephemeral Telemetry Records
  const ephemeralRecords = records.filter(r => r.allocation_tier === 'TIER_2_HEURISTIC_TELEMETRY');
  
  // Developer Leaderboard Math
  const developerSpend = {};
  telemetry.forEach(t => {
    const dev = t.developer_email;
    if (!developerSpend[dev]) {
      developerSpend[dev] = { email: dev, spend: 0, prs: 0, pods: 0 };
    }
    // Match corresponding record cost
    const matchingRec = records.find(r => r.resource_id === t.node_ip || r.resource_id === t.pod_name);
    if (matchingRec) {
      developerSpend[dev].spend += matchingRec.unblended_cost;
    }
    developerSpend[dev].prs += 1;
    developerSpend[dev].pods += 1;
  });

  const devList = Object.values(developerSpend).sort((a, b) => b.spend - a.spend);

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ephemeral Dev Compute Spend */}
        <div className="glass-card p-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Ephemeral Preview Env Spend</span>
            <GitPullRequest className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-cyan-300">
              $6,580.50
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <span className="text-emerald-400 font-mono">92.8% Attributed</span>
              <span>• 1,200 Short-lived pods</span>
            </div>
          </div>
        </div>

        {/* Active PR Preview Clusters */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Preview Environments</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-slate-100">
              18 Clusters
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <span>Avg runtime: 4.2 hours / PR</span>
            </div>
          </div>
        </div>

        {/* Idle Waste Flag */}
        <div className="glass-card p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Flagged Abandoned Dev Waste</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-rose-400">
              $2,150.00
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-rose-400">
              <span>1 Idle cluster with 0 requests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Abandoned Cluster Teardown Alert Box */}
      <div className="glass-card p-6 rounded-2xl border border-rose-500/30 bg-rose-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 mt-0.5">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-100 text-sm">Edge-Case 3 Detected: Abandoned Dev Cluster</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono border border-rose-500/30">
                  CRITICAL IDLE WASTE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Resource <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded">i-dev-abandoned-99</code> has been active for 72h with <strong>0 active dev requests</strong>. 
                Origin: <span className="font-mono text-slate-200">jason.contractor@acmecompany.com</span> (PR #999 abandoned).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {terminatedClusterId === 'i-dev-abandoned-99' ? (
              <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-mono border border-emerald-500/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Cluster Terminated ($2,150 Saved)
              </span>
            ) : (
              <button
                onClick={() => setTerminatedClusterId('i-dev-abandoned-99')}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Teardown & Reclaim $2,150</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ephemeral Telemetry Join Audit Table & Developer Spend Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Telemetry Join Audit Table (2 cols) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            Ephemeral Dev Environment Heuristic Join Audit Trail
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Untagged pods matched to Git Commits via internal Node IP and Pod timestamps
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium bg-slate-900/40">
                  <th className="py-2.5 px-3">PR Branch</th>
                  <th className="py-2.5 px-3">Developer</th>
                  <th className="py-2.5 px-3">Pod IP / Node</th>
                  <th className="py-2.5 px-3">Cost (USD)</th>
                  <th className="py-2.5 px-3">Feature Attributed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {telemetry.map(t => {
                  const matchingRec = records.find(r => r.resource_id === t.node_ip || r.resource_id === t.pod_name);
                  const cost = matchingRec ? matchingRec.unblended_cost : 0;
                  return (
                    <tr key={t.telemetry_id} className="hover:bg-slate-900/80">
                      <td className="py-2.5 px-3 font-semibold text-cyan-400 flex items-center gap-1.5">
                        <GitPullRequest className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{t.git_branch}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-sans">{t.developer_email.split('@')[0]}</td>
                      <td className="py-2.5 px-3 text-slate-400">{t.node_ip}</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold">${cost.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-sans">{t.feature_id}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Developer Spend Leaderboard (1 col) */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            Developer Dev Env Cost Attribution
          </h3>
          <p className="text-xs text-slate-400 mb-4">Accountability by engineering squad member</p>

          <div className="space-y-3">
            {devList.map((dev, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-400 font-mono">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{dev.email}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{dev.prs} Active PR Preview Clusters</div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-slate-100">${dev.spend.toLocaleString()}</div>
                  <div className="text-[10px] text-emerald-400">Attributed</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
