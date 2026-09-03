import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  BookOpen, 
  Code, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default function DocumentationViewer() {
  const [activeDoc, setActiveDoc] = useState('architecture');

  const docs = [
    { id: 'architecture', name: 'System Architecture', icon: Layers },
    { id: 'schema', name: 'Data Schema & Formulas', icon: Code },
    { id: 'results', name: 'Empirical Experiment', icon: TrendingUp },
    { id: 'security', name: 'Security & Risk Register', icon: ShieldCheck },
    { id: 'guide', name: 'End-User Guide', icon: BookOpen }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-nav for documentation */}
      <div className="glass-card p-2 rounded-2xl border border-slate-800 flex space-x-2 overflow-x-auto">
        {docs.map(doc => {
          const Icon = doc.icon;
          const isActive = activeDoc === doc.id;
          return (
            <button
              key={doc.id}
              onClick={() => setActiveDoc(doc.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{doc.name}</span>
            </button>
          );
        })}
      </div>

      {/* Doc Viewer Container */}
      <div className="glass-card p-8 rounded-2xl border border-slate-800 text-slate-200 leading-relaxed text-sm space-y-6 font-sans">
        {activeDoc === 'architecture' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Layers className="w-5 h-5 text-cyan-400" />
              1. Enterprise System Architecture & Data Flow
            </h2>
            <p className="text-slate-300">
              The platform connects cloud billing exports (AWS CUR 2.0 / GCP Billing) with Kubernetes pod telemetry, Git preview build webhooks, and customer transaction volumes into a high-throughput 3-Tier Allocation Engine.
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 space-y-2">
              <div>[Data Ingestion: AWS/GCP/K8s] ➔ [Tag Normalizer] ➔ [3-Tier Allocation Engine]</div>
              <div className="pl-6">├── Tier 1: Direct Infrastructure Tag Match (Static)</div>
              <div className="pl-6">├── Tier 2: Heuristic Telemetry Join (Short-Lived Dev Pods & PRs)</div>
              <div className="pl-6">└── Tier 3: Pro-Rata Shared Infrastructure Split (Control Planes & Gateways)</div>
            </div>
          </div>
        )}

        {activeDoc === 'schema' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Code className="w-5 h-5 text-emerald-400" />
              2. Data Taxonomy, Schemas & Allocation Math
            </h2>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div className="text-emerald-400 font-bold">// Tag Taxonomy Hierarchy</div>
              <div>Organization ➔ Business Unit ➔ Product Line ➔ Feature ID ➔ Environment ➔ Dev Workload ID</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-indigo-300 space-y-2">
              <div className="text-indigo-400 font-bold">// 3-Tier Allocation Mathematical Formula</div>
              <div>Total Spend = Direct Tagged Spend + Telemetry Attributed Spend + Pro-Rata Shared Spend</div>
            </div>
          </div>
        )}

        {activeDoc === 'results' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              3. Empirical Benchmark Results (30-Day Experiment)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Baseline Attribution</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">41.2%</div>
                <div className="text-[11px] text-slate-500 mt-1">Legacy Monthly Workflow</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Target Goal</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">90.0%</div>
                <div className="text-[11px] text-slate-500 mt-1">Requirement Threshold</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Achieved Measured</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">95.4%</div>
                <div className="text-[11px] text-slate-500 mt-1">Measured Result</div>
              </div>
            </div>
          </div>
        )}

        {activeDoc === 'security' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              4. Security Architecture & Risk Register
            </h2>
            <p className="text-slate-300">
              Enforces least-privilege RBAC. Users see only cost metrics for products or workloads they own. Rules changes are backed by cryptographic audit snapshots.
            </p>
          </div>
        )}

        {activeDoc === 'guide' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              5. End-User Operational Guide
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li><strong>Finance Users:</strong> Check macro metrics, unit margins, and perform zero-discrepancy reconciliation.</li>
              <li><strong>Engineering Users:</strong> Audit ephemeral dev environments, detect missing tags, and trigger teardown for abandoned clusters.</li>
              <li><strong>Product Users:</strong> Analyze cost per feature deployment and customer workload unit economics.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
