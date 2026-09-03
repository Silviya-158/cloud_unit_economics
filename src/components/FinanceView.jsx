import React from 'react';
import { 
  DollarSign, 
  PieChart as PieIcon, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowUpRight,
  ChevronRight,
  ShieldAlert,
  Search
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

export default function FinanceView({ summary, productBreakdown, records, onSelectRecord }) {
  const pieData = [
    { name: 'Tier 1 Direct Tagged', value: summary.tier1_direct_spend, color: '#10b981' },
    { name: 'Tier 2 Telemetry Ephemeral', value: summary.tier2_telemetry_spend, color: '#06b6d4' },
    { name: 'Tier 3 Pro-Rata Shared', value: summary.tier3_prorata_spend, color: '#6366f1' },
    { name: 'Unallocated Spend', value: summary.unallocated_spend, color: '#f59e0b' }
  ];

  const productBarData = Object.keys(productBreakdown).map(prod => ({
    name: prod,
    spend: productBreakdown[prod].total_cost
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cloud Invoice */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 glass-card-hover">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Monthly Cloud Bill</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-slate-100">
              ${summary.total_raw_spend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <span className="text-emerald-400 font-mono">100% Invoice Match</span>
              <span>• AWS + GCP + K8s</span>
            </div>
          </div>
        </div>

        {/* Attributed Spend */}
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 glass-card-hover bg-emerald-500/5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Attributed Spend</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-emerald-400">
              ${summary.attributed_total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-emerald-400 font-semibold font-mono">{summary.attribution_rate_percent}% Accountable</span>
              <span className="text-slate-500">Target: 90.0%</span>
            </div>
          </div>
        </div>

        {/* Unallocated Spend */}
        <div className="glass-card p-5 rounded-2xl border border-amber-500/20 glass-card-hover bg-amber-500/5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Unallocated Spend (Mystery)</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-amber-400">
              ${summary.unallocated_spend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-amber-400 font-mono">{(100 - summary.attribution_rate_percent).toFixed(1)}% Quarantined</span>
              <span className="text-slate-500">Down from 58.8%</span>
            </div>
          </div>
        </div>

        {/* Cost per Customer (COGS) */}
        <div className="glass-card p-5 rounded-2xl border border-indigo-500/20 glass-card-hover bg-indigo-500/5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Unit COGS / Customer</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-indigo-300">
              $8.42 <span className="text-xs text-slate-400 font-normal">/ active tenant</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400 font-mono">
              <span>+18.4% Margin Efficiency</span>
            </div>
          </div>
        </div>
      </div>

      {/* Allocation Tiers & Product Spend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tier Breakdown Donut Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-cyan-400" />
            3-Tier Allocation Framework Breakdown
          </h3>
          <p className="text-xs text-slate-400 mb-4">Direct tags vs Telemetry Heuristic Join vs Pro-Rata Shared</p>
          
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val) => `$${Number(val).toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2 font-mono text-xs">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <div className="truncate">
                  <div className="text-slate-300 font-sans text-[11px] truncate">{item.name}</div>
                  <div className="text-slate-100 font-bold">${item.value.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Spend Bar Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Product Line Cost Allocation
          </h3>
          <p className="text-xs text-slate-400 mb-4">Attributed spend grouped by business unit product line</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productBarData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tickFormatter={(val) => `$${val/1000}k`} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={110} tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(val) => `$${Number(val).toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="spend" fill="#0284c7" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Highest Expense Category: <strong className="text-slate-200">Payment Gateway ($72,300)</strong></span>
            <span className="text-cyan-400 font-mono">36.5% of total cloud spend</span>
          </div>
        </div>
      </div>

      {/* Unallocated Spend Error Analysis Banner */}
      <div className="glass-card p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Unallocated Spend Root-Cause Post-Mortem (Remaining {((summary.unallocated_spend / summary.total_raw_spend)*100).toFixed(1)}%)
            </h3>
            <p className="text-xs text-slate-400">Detailed breakdown of quarantined charges unable to automatically attribute</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono border border-amber-500/20">
            Total: ${summary.unallocated_spend.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-slate-400 font-sans text-xs">Untagged Cross-Region Egress</div>
            <div className="text-lg font-bold text-amber-400 mt-1">$5,240.00</div>
            <p className="text-[11px] text-slate-500 font-sans mt-2">No pod IP metadata available for inter-region transfer</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-slate-400 font-sans text-xs">Idle Reserved Instance Capacity</div>
            <div className="text-lg font-bold text-amber-400 mt-1">$3,500.00</div>
            <p className="text-[11px] text-slate-500 font-sans mt-2">Unblended RI commitment during off-peak weekend hours</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-slate-400 font-sans text-xs">Legacy S3 Log Bucket</div>
            <div className="text-lg font-bold text-amber-400 mt-1">$2,740.00</div>
            <p className="text-[11px] text-slate-500 font-sans mt-2">Deprecated 2021 storage bucket missing lifecycle rules</p>
          </div>
        </div>
      </div>

      {/* Attributed Billing Item Table with Lineage Search */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Raw Cloud Invoices & Unit Attribution Audit Trail</h3>
            <p className="text-xs text-slate-400">Click any row to inspect complete cost lineage evidence trace</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Showing {records.length} billing line items</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium bg-slate-900/40">
                <th className="py-3 px-4">Billing Record ID</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Cost (USD)</th>
                <th className="py-3 px-4">Attributed Product</th>
                <th className="py-3 px-4">Allocation Tier</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Lineage Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {records.map((rec) => (
                <tr 
                  key={rec.billing_record_id}
                  onClick={() => onSelectRecord(rec)}
                  className="hover:bg-slate-900/80 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-semibold text-slate-300 group-hover:text-cyan-400 flex items-center gap-2">
                    <span>{rec.billing_record_id}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-sans">{rec.service_name}</td>
                  <td className="py-3 px-4 font-bold text-slate-200">${rec.unblended_cost.toLocaleString()}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      rec.attributed_product === 'UNALLOCATED' 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                    }`}>
                      {rec.attributed_product}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {rec.allocation_tier}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold ${
                      rec.confidence_score > 0.9 ? 'text-emerald-400' : rec.confidence_score > 0.7 ? 'text-cyan-400' : 'text-amber-400'
                    }`}>
                      {(rec.confidence_score * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-cyan-600/30 text-cyan-400 border border-slate-700 text-[11px] font-sans inline-flex items-center gap-1 transition-all">
                      <span>Inspect Trace</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
