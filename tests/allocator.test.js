import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runAllocationPipeline } from '../src/engine/allocator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../data');

const rawBilling = JSON.parse(fs.readFileSync(path.join(dataDir, 'billing_export_raw.json'), 'utf-8'));
const telemetry = JSON.parse(fs.readFileSync(path.join(dataDir, 'usage_telemetry.json'), 'utf-8'));
const rules = JSON.parse(fs.readFileSync(path.join(dataDir, 'allocation_rules.json'), 'utf-8'));
const customer = JSON.parse(fs.readFileSync(path.join(dataDir, 'customer_activity.json'), 'utf-8'));

describe('Allocation Engine - 3-Tier Pipeline & Unit Economics', () => {
  const result = runAllocationPipeline(rawBilling, telemetry, rules, customer);

  test('Tier 1: Direct Tag Mapping attributes static resources with 1.0 confidence', () => {
    const tier1Records = result.attributed_records.filter(r => r.allocation_tier === 'TIER_1_DIRECT');
    assert.ok(tier1Records.length > 0, 'Should have Tier 1 direct tag attributed records');
    tier1Records.forEach(rec => {
      assert.equal(rec.confidence_score, 1.0);
      assert.ok(rec.attributed_product !== 'UNALLOCATED');
      assert.ok(rec.attributed_feature !== 'UNALLOCATED');
      assert.ok(rec.lineage_trace.method.includes('Static'));
    });
  });

  test('Tier 2: Ephemeral Telemetry Join matches untagged K8s pods via IP and Git logs', () => {
    const tier2Records = result.attributed_records.filter(r => r.allocation_tier === 'TIER_2_HEURISTIC_TELEMETRY');
    assert.ok(tier2Records.length > 0, 'Should have Tier 2 telemetry attributed records');
    assert.ok(result.summary.tier2_telemetry_spend > 0, 'Tier 2 spend should be greater than 0');
    
    // Check specific pod match (e.g., checkout-api-789bfb-x82m at 10.0.12.84)
    const podMatch = tier2Records.find(r => r.resource_id === '10.0.12.84');
    assert.ok(podMatch, 'Pod 10.0.12.84 should be matched via telemetry');
    assert.equal(podMatch.attributed_product, 'Payment Gateway');
    assert.equal(podMatch.attributed_feature, 'Instant Payouts');
    assert.equal(podMatch.confidence_score, 0.93);
    assert.equal(podMatch.lineage_trace.developer, 'alex.dev@acmecompany.com');
  });

  test('Tier 3: Shared Infrastructure allocates un-taggable control planes and NAT gateways pro-rata', () => {
    const tier3Records = result.attributed_records.filter(r => r.allocation_tier === 'TIER_3_PRO_RATA');
    assert.ok(tier3Records.length >= 2, 'NAT gateway and EKS control plane should be allocated pro-rata');
    assert.ok(result.summary.tier3_prorata_spend > 0);

    const natRecord = tier3Records.find(r => r.service_name === 'AWS-NATGateway');
    assert.ok(natRecord, 'AWS-NATGateway should be allocated');
    assert.equal(natRecord.attributed_owner, 'platform-infra-team');
    assert.equal(natRecord.confidence_score, 0.85);
  });

  test('Quarantine: Untagged resources without telemetry match are isolated with 0.0 confidence', () => {
    const quarantined = result.attributed_records.filter(r => r.allocation_tier === 'UNALLOCATED');
    assert.ok(quarantined.length > 0, 'Should isolate untagged/unmatched resources in quarantine');
    quarantined.forEach(r => {
      assert.equal(r.confidence_score, 0.0);
      assert.equal(r.attributed_product, 'UNALLOCATED');
      assert.ok(r.lineage_trace.method.includes('Quarantined'));
    });
  });

  test('Benchmark: Overall attribution rate achieves >= 90.0% enterprise target', () => {
    assert.ok(
      result.summary.attribution_rate_percent >= 90.0,
      `Expected attribution rate >= 90.0%, got ${result.summary.attribution_rate_percent}%`
    );
    assert.equal(result.summary.status, 'OPTIMAL');
  });

  test('Dynamic Unit Cost Derivation: Calculates unit cost per feature without hardcoding', () => {
    assert.ok(Array.isArray(result.feature_unit_economics), 'Should output feature_unit_economics array');
    assert.ok(result.feature_unit_economics.length >= 5, 'Should cover configured features');

    result.feature_unit_economics.forEach(feat => {
      assert.ok(feat.name, 'Feature must have a name');
      assert.ok(feat.product, 'Feature must belong to a product');
      assert.ok(feat.cost > 0, 'Feature attributed cost should be positive');
      assert.ok(feat.volume > 0, 'Feature activity volume should be positive');
      assert.ok(feat.unit_cost_numeric > 0, 'Derived unit cost should be positive');
      assert.ok(feat.unit_cost.includes('/'), 'Formatted unit cost must include unit name');
      
      // Verify math: cost / volume == unit_cost_numeric
      const expectedUnitCost = feat.cost / feat.volume;
      assert.ok(Math.abs(feat.unit_cost_numeric - expectedUnitCost) < 0.0001, 'Unit cost math must be accurate');
    });

    // Check specific feature unit cost derivation
    const instantPayouts = result.feature_unit_economics.find(f => f.name === 'Instant Payouts');
    assert.ok(instantPayouts);
    assert.equal(instantPayouts.product, 'Payment Gateway');
    assert.ok(instantPayouts.cost >= 42500); // 42,500 direct + ephemeral pod
    assert.ok(instantPayouts.unit_cost.includes('/ tx'));
  });

  test('Dynamic Customer Economics: Calculates tenant cost to serve and gross margin dynamically', () => {
    assert.ok(Array.isArray(result.customer_unit_economics), 'Should output customer_unit_economics array');
    assert.equal(result.customer_unit_economics.length, customer.length);

    result.customer_unit_economics.forEach(tenant => {
      assert.ok(tenant.customer_name, 'Tenant must have a customer name');
      assert.ok(typeof tenant.monthly_cost === 'number' && tenant.monthly_cost >= 0);
      assert.ok(typeof tenant.monthly_revenue === 'number');
      assert.ok(typeof tenant.margin_percent === 'number');
      assert.ok(tenant.unit_cost_per_api_formatted.includes('API calls'));

      if (tenant.monthly_revenue > 0) {
        // Paying customer
        const expectedRev = tenant.monthly_subscription_arr / 12;
        assert.ok(Math.abs(tenant.monthly_revenue - expectedRev) < 0.01, `Revenue mismatch for ${tenant.tenant_id}`);
        const expectedMarginUSD = expectedRev - tenant.monthly_cost;
        assert.ok(Math.abs(tenant.margin_usd - expectedMarginUSD) < 0.05);
      }
    });

    // Check Globex Corp
    const globex = result.customer_unit_economics.find(t => t.tenant_id === 'tenant-globex');
    assert.ok(globex);
    assert.equal(globex.monthly_revenue, 20000);
    assert.ok(globex.monthly_cost > 0);
  });

  test('Product Macro KPIs: Aggregates portfolio gross margin and deployment economics', () => {
    assert.ok(result.product_kpis);
    assert.ok(result.product_kpis.avg_gross_margin > 0);
    assert.ok(result.product_kpis.total_mrr > 0);
    assert.equal(result.product_kpis.managed_tenants_count, customer.length);
    assert.ok(result.product_kpis.cost_per_deployment > 0);
  });
});
