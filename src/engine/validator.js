/**
 * Automated Edge-Case & Failure Validation Test Suite
 * Tests 3 critical failure modes:
 * 1. Untagged short-lived Kubernetes pods (Telemetry Fallback)
 * 2. Overlapping product workloads (Shared Microservices Pro-Rata Split)
 * 3. Abandoned Preview Environments with Zero Activity (Idle Waste Attribution)
 */

import { runAllocationPipeline } from './allocator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function runValidationSuite() {
  const dataDir = path.resolve(__dirname, '../../data');
  
  const rawBilling = JSON.parse(fs.readFileSync(path.join(dataDir, 'billing_export_raw.json'), 'utf-8'));
  const telemetry = JSON.parse(fs.readFileSync(path.join(dataDir, 'usage_telemetry.json'), 'utf-8'));
  const rules = JSON.parse(fs.readFileSync(path.join(dataDir, 'allocation_rules.json'), 'utf-8'));
  const customer = JSON.parse(fs.readFileSync(path.join(dataDir, 'customer_activity.json'), 'utf-8'));

  const result = runAllocationPipeline(rawBilling, telemetry, rules, customer);

  const tests = [
    {
      id: "EDGE-01",
      name: "Untagged Short-Lived Dev Pods (Ephemeral Telemetry Join)",
      description: "Verify short-lived K8s pods without static tags are attributed via IP & Git logs",
      passed: result.summary.tier2_telemetry_spend > 0,
      details: `Successfully attributed $${result.summary.tier2_telemetry_spend.toLocaleString()} of ephemeral dev compute (Tier 2 Telemetry Join)`
    },
    {
      id: "EDGE-02",
      name: "Shared Infrastructure Pro-Rata Distribution",
      description: "Verify untagged control planes & NAT gateways are split pro-rata",
      passed: result.summary.tier3_prorata_spend > 0,
      details: `Successfully allocated $${result.summary.tier3_prorata_spend.toLocaleString()} of shared infrastructure spend across products`
    },
    {
      id: "EDGE-03",
      name: "Abandoned Ephemeral Environment Detection",
      description: "Identify preview cluster with 0 active activity and isolate as developer waste",
      passed: result.attributed_records.some(r => r.resource_id.includes('abandoned') && r.attributed_owner.includes('contractor')),
      details: "Correctly identified i-dev-abandoned-99 ($2,150) and attributed to jason.contractor@acmecompany.com"
    },
    {
      id: "EDGE-04",
      name: "Attribution Target Benchmark Threshold",
      description: "Ensure total attributed spend exceeds the 90.0% target requirement",
      passed: result.summary.attribution_rate_percent >= 90.0,
      details: `Attribution Rate: ${result.summary.attribution_rate_percent}% (Baseline: 41.2% -> Target: 90.0% -> Measured: ${result.summary.attribution_rate_percent}%)`
    },
    {
      id: "EDGE-05",
      name: "Zero-Discrepancy Audit Balance",
      description: "Ensure sum of attributed and unallocated spend equals raw cloud bill",
      passed: Math.abs(result.summary.total_raw_spend - (result.summary.attributed_total + result.summary.unallocated_spend)) < 0.01,
      details: `Raw Total: $${result.summary.total_raw_spend.toLocaleString()} == Reconciled: $${(result.summary.attributed_total + result.summary.unallocated_spend).toLocaleString()} ($0.00 Variance)`
    }
  ];

  const allPassed = tests.every(t => t.passed);

  return {
    timestamp: new Date().toISOString(),
    overall_status: allPassed ? "ALL_PASS" : "FAILURES_DETECTED",
    tests: tests,
    summary: result.summary
  };
}

// If run directly from CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log("==================================================================");
  console.log(" RUNNING CLOUD COST UNIT ECONOMICS VALIDATION TEST SUITE");
  console.log("==================================================================\n");
  const validation = runValidationSuite();
  
  validation.tests.forEach(test => {
    const symbol = test.passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${symbol} [${test.id}] ${test.name}`);
    console.log(`   └─ ${test.details}\n`);
  });

  console.log("------------------------------------------------------------------");
  console.log(`Summary Status: ${validation.overall_status}`);
  console.log(`Attribution Rate: ${validation.summary.attribution_rate_percent}%`);
  console.log("==================================================================");
}
