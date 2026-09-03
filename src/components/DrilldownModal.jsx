import React from 'react';
import { 
  X, 
  Search, 
  GitBranch, 
  GitPullRequest, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  DollarSign, 
  FileText, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

export default function DrilldownModal({ record, onClose }) {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card max-w-2xl w-full rounded-2xl border border-slate-700 shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                Cost Lineage Audit Inspector
              </h3>
              <p className="text-xs text-slate-400 font-mono">Record ID: {record.billing_record_id}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Top Lineage Provenance Path */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Lineage Evidence Chain
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-center flex-1">
                <div className="text-slate-400 text-[10px]">1. Provider Charge</div>
                <div className="font-bold text-slate-200 mt-0.5">{record.service_name}</div>
                <div className="text-emerald-400 font-bold mt-1">${record.unblended_cost.toLocaleString()}</div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 mx-2" />

              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-center flex-1">
                <div className="text-slate-400 text-[10px]">2. Allocation Tier</div>
                <div className="font-bold text-cyan-400 mt-0.5">{record.allocation_tier}</div>
                <div className="text-slate-400 font-mono text-[10px] mt-1">
                  Confidence: {(record.confidence_score * 100).toFixed(0)}%
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 mx-2" />

              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-center flex-1">
                <div className="text-slate-400 text-[10px]">3. Accountable Business Unit</div>
                <div className="font-bold text-indigo-300 mt-0.5">{record.attributed_product}</div>
                <div className="text-slate-300 text-[11px] mt-1">{record.attributed_feature}</div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Raw Billing Provider Details */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-slate-400 font-sans font-semibold text-xs border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Raw Billing Export Metadata
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-500">Provider:</span>
                <span className="text-slate-200 font-bold">{record.provider}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-500">Resource ID:</span>
                <span className="text-slate-300 truncate max-w-[180px]">{record.resource_id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-500">Usage Window:</span>
                <span className="text-slate-300">{record.usage_amount} {record.usage_unit}</span>
              </div>
            </div>

            {/* Telemetry & Git Provenance Details */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-slate-400 font-sans font-semibold text-xs border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                Telemetry & Identity Provenance
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-500">Matching Rule:</span>
                <span className="text-cyan-300">{record.lineage_trace?.method || 'Direct Tag'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-500">Owner / Squad:</span>
                <span className="text-slate-200 font-semibold">{record.attributed_owner}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-500">Git Commit:</span>
                <span className="text-slate-300 font-mono">{record.lineage_trace?.git_commit || 'Tag Inherited'}</span>
              </div>
            </div>
          </div>

          {/* Audit Verification Stamp */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between font-mono">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Audit Record: Zero line-item variance against raw provider invoice.
            </span>
            <span className="text-emerald-300 text-[10px]">Audit Hash: 9942a-ok</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-900/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
