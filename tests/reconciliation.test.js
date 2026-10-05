import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runAllocationPipeline } from '../src/engine/allocator.js';
import { ReconciliationEngine } from '../src/engine/reconciliation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../data');

const rawBilling = JSON.parse(fs.readFileSync(path.join(dataDir, 'billing_export_raw.json'), 'utf-8'));
const telemetry = JSON.parse(fs.readFileSync(path.join(dataDir, 'usage_telemetry.json'), 'utf-8'));
const rules = JSON.parse(fs.readFileSync(path.join(dataDir, 'allocation_rules.json'), 'utf-8'));
const customer = JSON.parse(fs.readFileSync(path.join(dataDir, 'customer_activity.json'), 'utf-8'));

describe('Reconciliation Engine - Audit Balance & Snapshot Rollback', () => {
  const engine = new ReconciliationEngine(rules);
  const allocationResult = runAllocationPipeline(rawBilling, telemetry, rules, customer);

  test('Zero-Discrepancy Audit Balance: Guarantees $0.00 variance between raw invoice and attributed total', () => {
    const recResult = engine.reconcileInvoice(rawBilling, allocationResult);
    assert.equal(recResult.is_balanced, true);
    assert.equal(recResult.coexistence_status, 'BALANCED_EXACT_MATCH');
    assert.ok(recResult.variance_usd < 0.01, `Expected variance < $0.01, got $${recResult.variance_usd}`);
    assert.equal(recResult.raw_invoice_total, recResult.reconciled_sum);
  });

  test('Reconciliation detects artificial billing variance if raw invoice is tampered', () => {
    const tamperedBilling = [...rawBilling, { unblended_cost: 500.00 }];
    const recResult = engine.reconcileInvoice(tamperedBilling, allocationResult);
    assert.equal(recResult.is_balanced, false);
    assert.equal(recResult.coexistence_status, 'DISCREPANCY_DETECTED');
    assert.equal(recResult.variance_usd, 500.00);
  });

  test('Rollback Controller: Safely rolls back to Snapshot v1.0.0 without data loss', () => {
    const rollbackRes = engine.rollbackToPreviousVersion();
    assert.equal(rollbackRes.success, true);
    assert.equal(rollbackRes.restored_version, '1.0.0');

    const activeRules = engine.getActiveRules();
    assert.equal(activeRules.tier_2_ephemeral_telemetry.enabled, false);

    // Rollback execution produces valid reconciliation with zero invoice variance
    const rollbackAlloc = runAllocationPipeline(rawBilling, telemetry, activeRules, customer);
    const rollbackRec = engine.reconcileInvoice(rawBilling, rollbackAlloc);
    assert.equal(rollbackRec.is_balanced, true);
    assert.ok(rollbackAlloc.summary.attribution_rate_percent < allocationResult.summary.attribution_rate_percent);
  });

  test('Promotion Controller: Restores engine to latest version (v2.4.0)', () => {
    const promoteRes = engine.promoteToLatestVersion();
    assert.equal(promoteRes.success, true);
    assert.equal(promoteRes.restored_version, rules.version || '2.4.0');
    assert.equal(engine.getActiveRules().tier_2_ephemeral_telemetry.enabled, true);
  });
});
