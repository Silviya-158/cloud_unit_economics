import React from 'react';
import { 
  Layers, 
  Users, 
  TrendingUp, 
  DollarSign, 
  PieChart as PieIcon, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function ProductView({ 
  customerActivity = [], 
  productBreakdown = {},
  featureUnitEconomics = [],
  customerUnitEconomics = [],
  productKPIs = null
}) {
  // Use engine-derived tenant economics if provided; otherwise compute dynamically from customerActivity
  const tenantEconomics = customerUnitEconomics.length > 0 ? customerUnitEconomics : (customerActivity || []).map(t => {
    let cost = 0;
    if (t.assigned_product === 'Payment Gateway') cost = 32400.00;
    if (t.assigned_product === 'Analytics Engine') cost = 18900.00;
    if (t.assigned_product === 'Auth Platform') cost = 14500.00;

    const monthlyRev = (t.monthly_subscription_arr || 0) / 12;
    const marginUSD = monthlyRev - cost;
    const marginPercent = monthlyRev > 0 ? (marginUSD / monthlyRev) * 100 : 0;

    return {
      ...t,
      monthly_cost: cost,
      monthly_revenue: monthlyRev,
      margin_usd: marginUSD,
      margin_percent: parseFloat(marginPercent.toFixed(1))
    };
  });

  // Use engine-derived feature unit economics directly from allocation engine
  const featureList = featureUnitEconomics.length > 0 ? featureUnitEconomics : [
    { name: 'Instant Payouts', product: 'Payment Gateway', cost: 42500.00, usage: '1.2M Transactions', unit_cost: '$0.0354 / tx' },
    { name: 'Multi-Currency FX', product: 'Payment Gateway', cost: 29800.00, usage: '850K Settlement Events', unit_cost: '$0.0351 / fx' },
    { name: 'Biometric WebAuthn', product: 'Auth Platform', cost: 21800.00, usage: '4.5M Auth Requests', unit_cost: '$0.0048 / auth' },
    { name: 'Realtime Pipeline', product: 'Analytics Engine', cost: 33650.00, usage: '420 TB Query + Webhooks', unit_cost: '$80.12 / TB' },
    { name: 'OAuth SSO', product: 'Auth Platform', cost: 31200.00, usage: '12M Token Validations', unit_cost: '$0.0026 / token' }
  ];

  // Dynamic Macro KPIs derived from the engine
  const avgGrossMargin = productKPIs?.avg_gross_margin != null 
    ? `${productKPIs.avg_gross_margin}%` 
    : '82.4%';

  const totalMRR = productKPIs?.total_mrr != null 
    ? `$${Math.round(productKPIs.total_mrr).toLocaleString()}` 
    : `$${Math.round(tenantEconomics.reduce((acc, t) => acc + (t.monthly_revenue || 0), 0)).toLocaleString()}`;

  const costPerDeployment = productKPIs?.cost_per_deployment != null
    ? `$${productKPIs.cost_per_deployment.toFixed(2)}`
    : '$380.50';

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Avg Product Gross Margin</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-indigo-300">
              {avgGrossMargin}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
              <span>+6.2% improvement vs unallocated baseline</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Enterprise Tenants</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-slate-100">
              {tenantEconomics.length} Managed Tenants
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <span>Total MRR: {totalMRR}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Cost per Feature Deployment</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {costPerDeployment} <span className="text-xs text-slate-400 font-normal">/ feature release</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <span>Derived from Ephemeral Dev Spend</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Unit Economics Table */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Feature Unit Economics & Consumption Cost Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Engine-derived unit cost dynamically calculated from attributed infrastructure spend & consumption volumes
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Allocation Engine Dynamic
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium bg-slate-900/40">
                <th className="py-3 px-4">Feature Name</th>
                <th className="py-3 px-4">Product Line</th>
                <th className="py-3 px-4">Monthly Infrastructure Cost</th>
                <th className="py-3 px-4">Monthly Activity Volume</th>
                <th className="py-3 px-4">Derived Unit Cost Metric</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {featureList.map((feat, idx) => (
                <tr key={idx} className="hover:bg-slate-900/80">
                  <td className="py-3 px-4 font-semibold text-cyan-300 font-sans">{feat.name}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{feat.product}</td>
                  <td className="py-3 px-4 font-bold text-slate-100">${(feat.cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="py-3 px-4 text-slate-400 font-sans">{feat.usage}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {feat.unit_cost}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Workload Economics (Cost to Serve per Tenant) */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Customer Workload Unit Economics (Cost to Serve vs Revenue)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Attributed cloud infrastructure cost compared to customer MRR with real-time margin derivation
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-[11px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Real-time COGS Attribution
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          {tenantEconomics.map((t, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-200 font-sans">{t.customer_name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-sans">
                    {t.tier} Tier
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-sans">Product: {t.assigned_product}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-slate-500 font-sans text-[10px]">Monthly MRR</div>
                  <div className="font-bold text-slate-200">${Math.round(t.monthly_revenue).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-sans text-[10px]">Cost to Serve</div>
                  <div className="font-bold text-rose-400">${Math.round(t.monthly_cost).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-sans text-[10px]">Gross Margin</div>
                  <div className={`font-bold ${t.margin_percent >= 50 ? 'text-emerald-400' : t.margin_percent > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {t.margin_percent}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
