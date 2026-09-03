# Security Model, Misuse Resistance & Risk Register

## 1. Security Architecture & RBAC Policy

The platform enforces **Least Privilege Cost Visibility** by default. Users are authenticated and assigned granular RBAC roles that scope what cost data and telemetry they can view.

### RBAC Permission Matrix

| Role | Permitted Cost Visibility Scope | Allowed Actions |
| :--- | :--- | :--- |
| **Finance Admin** | Enterprise-wide macro spend, COGS, margins | Modify allocation rules, execute rollbacks, export reports |
| **Product Manager** | Assigned Product Line & Feature spend only | View unit economics, feature ROI, cost per customer |
| **Engineering Lead** | Squad dev env spend, preview cluster idle waste | View missing tags, audit developer spend, request pod teardown |
| **Developer** | Own PR preview environment costs & commit spend | View own cost efficiency metrics |

---

## 2. Misuse Resistance Mechanisms

1. **Tag Spoofing Defense**: Allocation tags submitted via IaC (Terraform/Pulumi) are validated against a strict regex whitelist. Tags referencing non-existent product IDs are flagged as `UNALLOCATED_INVALID_TAG` and quarantined.
2. **Data Manipulation Protection**: Allocation rule changes are stored in an append-only, cryptographic audit log. Any manual override of cost attribution requires dual-approval from Finance and Engineering leads.
3. **Telemetry Interruption Resilience**: If telemetry streams fail, the engine falls back gracefully to historical 7-day moving average allocation ratios, marking the output as `PROVISIONAL_ESTIMATE` with a visual warning badge.

---

## 3. Comprehensive Risk Register

| Risk ID | Risk Event | Impact | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **R-01** | **Tag Adoption Barriers** (Engineers don't apply tags to new IaC modules) | Medium | High | Automated Tier-2 Telemetry Join + CI/CD linter blocking untagged IaC pull requests. |
| **R-02** | **Data Staleness / Telemetry Lag** (Telemetry logs delayed > 2 hours) | Low | Medium | Visual UI freshness indicators ("Stale Data Warning") & fallback to 7-day heuristic baselines. |
| **R-03** | **False Confidence in Heuristic Attribution** (Wrong developer blamed for idle spend) | Medium | Low | Transparency drill-down showing confidence score; easy dispute mechanism for developers. |
| **R-04** | **Legacy Workflow Resistance** (Finance team reluctant to trust automated pipeline) | High | Medium | Coexistence mode showing side-by-side reconciliation table with \$0 invoice variance. |
| **R-05** | **Allocation Rule Regressions** (A updated rule misallocates 30% of spend) | High | Low | 1-Click Rollback engine with state snapshots allowing instant restoration of previous rules. |
