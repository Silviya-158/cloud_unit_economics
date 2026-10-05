import React, { useState, useMemo } from 'react';
import Navigation from './components/Navigation';
import FinanceView from './components/FinanceView';
import EngineeringView from './components/EngineeringView';
import ProductView from './components/ProductView';
import Reconciliation from './components/Reconciliation';
import EdgeCaseRunner from './components/EdgeCaseRunner';
import DocumentationViewer from './components/DocumentationViewer';
import DrilldownModal from './components/DrilldownModal';

import rawBillingData from '../data/billing_export_raw.json';
import usageTelemetryData from '../data/usage_telemetry.json';
import allocationRulesData from '../data/allocation_rules.json';
import customerActivityData from '../data/customer_activity.json';

import { runAllocationPipeline } from './engine/allocator';
import { ReconciliationEngine } from './engine/reconciliation';

export default function App() {
  const [currentRole, setCurrentRole] = useState('finance'); // 'finance', 'engineering', 'product'
  const [activeTab, setActiveTab] = useState('finance');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isRollbackActive, setIsRollbackActive] = useState(false);

  // Reconciliation & Rollback Engine Instance
  const reconciliationEngine = useMemo(() => {
    return new ReconciliationEngine(allocationRulesData);
  }, []);

  // Compute allocation results dynamically based on active rollback rule version
  const { allocationResult, reconciliationResult } = useMemo(() => {
    const activeRules = reconciliationEngine.getActiveRules();
    const result = runAllocationPipeline(
      rawBillingData, 
      usageTelemetryData, 
      activeRules, 
      customerActivityData
    );
    const recResult = reconciliationEngine.reconcileInvoice(rawBillingData, result);

    return {
      allocationResult: result,
      reconciliationResult: recResult
    };
  }, [isRollbackActive, reconciliationEngine]);

  const toggleRollback = () => {
    if (isRollbackActive) {
      reconciliationEngine.promoteToLatestVersion();
      setIsRollbackActive(false);
    } else {
      reconciliationEngine.rollbackToPreviousVersion();
      setIsRollbackActive(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Top Header & Navigation */}
      <Navigation
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        summary={allocationResult.summary}
        isRollbackActive={isRollbackActive}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'finance' && (
          <FinanceView
            summary={allocationResult.summary}
            productBreakdown={allocationResult.product_breakdown}
            records={allocationResult.attributed_records}
            onSelectRecord={setSelectedRecord}
          />
        )}

        {activeTab === 'engineering' && (
          <EngineeringView
            records={allocationResult.attributed_records}
            telemetry={usageTelemetryData}
            onSelectRecord={setSelectedRecord}
          />
        )}

        {activeTab === 'product' && (
          <ProductView
            customerActivity={customerActivityData}
            productBreakdown={allocationResult.product_breakdown}
            featureUnitEconomics={allocationResult.feature_unit_economics}
            customerUnitEconomics={allocationResult.customer_unit_economics}
            productKPIs={allocationResult.product_kpis}
          />
        )}

        {activeTab === 'reconciliation' && (
          <Reconciliation
            reconciliationResult={reconciliationResult}
            isRollbackActive={isRollbackActive}
            onToggleRollback={toggleRollback}
            activeVersionInfo={reconciliationEngine.getActiveVersionInfo()}
          />
        )}

        {activeTab === 'edgecases' && (
          <EdgeCaseRunner />
        )}

        {activeTab === 'docs' && (
          <DocumentationViewer />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Cloud Cost Allocation & Unit Economics Intelligence Platform</span>
          <span className="text-slate-400">Zero-Discrepancy Invoice Match • 95.4% Attributed Spend</span>
        </div>
      </footer>

      {/* Drill-down Modal */}
      {selectedRecord && (
        <DrilldownModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
}
