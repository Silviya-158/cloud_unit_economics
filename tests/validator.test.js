import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { runValidationSuite } from '../src/engine/validator.js';

describe('Validator Engine - 5 FinOps Edge Cases Suite', () => {
  const validation = runValidationSuite();

  test('Overall validation suite reports ALL_PASS with all 5 tests passing', () => {
    assert.equal(validation.overall_status, 'ALL_PASS');
    assert.equal(validation.all_passed, true);
    assert.equal(validation.tests.length, 5);
  });

  test('EDGE-01: Untagged Short-Lived Dev Pods (Ephemeral Telemetry Join) passes', () => {
    const test1 = validation.tests.find(t => t.id === 'EDGE-01');
    assert.ok(test1, 'EDGE-01 should exist');
    assert.equal(test1.passed, true);
    assert.ok(validation.summary.tier2_telemetry_spend > 0);
  });

  test('EDGE-02: Shared Infrastructure Pro-Rata Distribution passes', () => {
    const test2 = validation.tests.find(t => t.id === 'EDGE-02');
    assert.ok(test2, 'EDGE-02 should exist');
    assert.equal(test2.passed, true);
    assert.ok(validation.summary.tier3_prorata_spend > 0);
  });

  test('EDGE-03: Abandoned Ephemeral Environment Detection passes', () => {
    const test3 = validation.tests.find(t => t.id === 'EDGE-03');
    assert.ok(test3, 'EDGE-03 should exist');
    assert.equal(test3.passed, true);
    assert.ok(test3.details.includes('i-dev-abandoned-99'));
    assert.ok(test3.details.includes('jason.contractor@acmecompany.com'));
  });

  test('EDGE-04: Attribution Target Benchmark Threshold (>= 90.0%) passes', () => {
    const test4 = validation.tests.find(t => t.id === 'EDGE-04');
    assert.ok(test4, 'EDGE-04 should exist');
    assert.equal(test4.passed, true);
    assert.ok(
      validation.summary.attribution_rate_percent >= 90.0,
      `Expected >= 90.0%, got ${validation.summary.attribution_rate_percent}%`
    );
  });

  test('EDGE-05: Zero-Discrepancy Audit Balance ($0.00 Variance) passes', () => {
    const test5 = validation.tests.find(t => t.id === 'EDGE-05');
    assert.ok(test5, 'EDGE-05 should exist');
    assert.equal(test5.passed, true);
    assert.ok(test5.details.includes('$0.00 Variance'));
  });
});
