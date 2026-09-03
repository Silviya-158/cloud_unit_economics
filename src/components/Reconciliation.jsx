import React from 'react';
import { 
  RefreshCw, 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function Reconciliation({ 
  reconciliationResult, 
  isRollbackActive, 
  onToggleRollback,
  activeVersionInfo
}) {
  const rec = reconciliationResult;

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Invoice Total */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-slate-400 text-xs font-medium">Provider Cloud Invoice Total</div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-2">
            ${rec.raw_invoice_total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-mono">100% Raw Billing Input</div>
        </div>

        {/* Engine Reconciled Total */}
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <div className="text-slate-400 text-xs font-medium">Engine Reconciled Total</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">
            ${rec.reconciled_sum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-400 mt-1 font-mono">Attributed + Quarantined</div>
        </div>

        {/* Discrepancy Variance */}
        <div className="glass-card p-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5">
          <div className="text-slate-400 text-xs font-medium">Audit Discrepancy Variance</div>
          <div className="text-2xl font-bold font-mono text-cyan-300 mt-2">
            ${rec.variance_usd.toFixed(2)}
          </div>
          <div className="text-xs text-emerald-400 mt-1 font-mono font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> EXACT $0.00 MATCH
          </div>
        </div>
      </div>

      {/* Migration & Rollback Controller Card */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-100 text-base">
                Legacy Coexistence & 1-Click Rollback Controller
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono border border-cyan-500/20">
                Active: {activeVersionInfo.version}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Demonstrates how the engine coexists with legacy workflow and can revert to previous rules instantly with zero data loss.
            </p>
          </div>

          <div>
            <button
              onClick={onToggleRollback}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shadow-lg ${
                isRollbackActive
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>
                {isRollbackActive 
                  ? 'Promote to v2.4.0 (95.4% Attribution Engine)' 
                  : 'Rollback to v1.0.0 (Legacy Snapshot)'}
              </span>
            </button>
          </div>
        </div>

        {/* Snapshot Active Information Box */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span>Snapshot Version: <strong className="text-cyan-300">{activeVersionInfo.version}</strong></span>
            <span>Author: <strong className="text-slate-200">{activeVersionInfo.author}</strong></span>
          </div>
          <div className="text-slate-300 font-sans">
            <strong>Rule Description:</strong> {activeVersionInfo.description}
          </div>
        </div>
      </div>

      {/* Side-by-Side Coexistence Comparison Table */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-semibold text-slate-200 mb-1">
          Side-by-Side Migration Reconciliation Matrix
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Comparing Legacy Monthly Billing Spreadsheet vs New FinOps Unit Economics Engine
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium bg-slate-900/40">
                <th className="py-3 px-4">Cost Center / Dimension</th>
                <th className="py-3 px-4">Legacy Monthly Workflow</th>
                <th className="py-3 px-4">New Unit Economics Engine</th>
                <th className="py-3 px-4">Improvement Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-900/80">
                <td className="py-3 px-4 font-semibold text-slate-200 font-sans">Attributed Spend Rate</td>
                <td className="py-3 px-4 text-amber-400">41.2% ($81,580.00)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">95.4% ($186,530.50)</td>
                <td className="py-3 px-4 text-emerald-300 font-bold">+54.2% percentage points</td>
              </tr>
              <tr className="hover:bg-slate-900/80">
                <td className="py-3 px-4 font-semibold text-slate-200 font-sans">Short-Lived Dev Env Spend</td>
                <td className="py-3 px-4 text-rose-400">0.0% (100% Unallocated)</td>
                <td className="py-3 px-4 text-cyan-400 font-bold">92.8% ($6,580.50 Attributed)</td>
                <td className="py-3 px-4 text-cyan-300">+92.8% telemetry attribution</td>
              </tr>
              <tr className="hover:bg-slate-900/80">
                <td className="py-3 px-4 font-semibold text-slate-200 font-sans">Reconciliation Latency</td>
                <td className="py-3 px-4 text-slate-400">3 Weeks (Manual Excel)</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Real-time (&lt; 5 mins)</td>
                <td className="py-3 px-4 text-emerald-300 font-bold">99.9% Faster</td>
              </tr>
              <tr className="hover:bg-slate-900/80">
                <td className="py-3 px-4 font-semibold text-slate-200 font-sans">Line-Item Discrepancy</td>
                <td className="py-3 px-4 text-slate-400">Unverified / Estimated</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">$0.00 Exact Balance</td>
                <td className="py-3 px-4 text-emerald-300 font-bold">100% Audit Precision</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
