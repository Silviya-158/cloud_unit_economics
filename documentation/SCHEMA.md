# Data Schema, Tag Hierarchy & Allocation Formulas

## 1. Tag Hierarchy Taxonomy

All cloud resources, Kubernetes namespaces, and preview environments follow a strict, inheritance-based taxonomy:

```
[ Organization: Global Enterprise ]
  └── [ Business Unit ]: FinTech / Healthcare / AI Analytics
        └── [ Product Line ]: Payment Gateway / Auth Platform / Analytics Engine
              └── [ Feature ID ]: Instant Payouts / OAuth SSO / Realtime Pipeline
                    └── [ Environment ]: production / staging / preview-pr-1042
                          └── [ Dev Workload ID ]: dev-pod-892a (Short-lived)
```

---

## 2. Standardized Data Schemas

### A. Raw Billing Export Schema (FOCUS / CUR 2.0 Compliant)

```json
{
  "billing_record_id": "string (UUID)",
  "provider": "AWS | GCP | KUBERNETES",
  "account_id": "string",
  "service_name": "AmazonEC2 | AmazonEKS | CloudSQL | Egress",
  "resource_id": "string (ARN / URI)",
  "usage_start_time": "ISO8601 Timestamp",
  "usage_end_time": "ISO8601 Timestamp",
  "unblended_cost": "number (USD)",
  "usage_amount": "number",
  "usage_unit": "Hrs | GB | Requests",
  "tags": {
    "env": "string",
    "owner": "string",
    "product_line": "string",
    "feature_id": "string",
    "tenant_id": "string"
  }
}
```

### B. Usage & Ephemeral Telemetry Schema

```json
{
  "telemetry_id": "string (UUID)",
  "timestamp": "ISO8601 Timestamp",
  "cluster_id": "string",
  "namespace": "string (e.g. preview-pr-1042)",
  "pod_name": "string",
  "node_ip": "string",
  "git_commit": "string (SHA)",
  "git_branch": "string (feature/instant-payouts-v2)",
  "developer_email": "string",
  "cpu_cores_requested": "number",
  "mem_gb_requested": "number",
  "runtime_seconds": "number"
}
```

### C. Attributed Billing Schema

```json
{
  "attribution_id": "string (UUID)",
  "billing_record_id": "string",
  "attributed_product": "string",
  "attributed_feature": "string",
  "attributed_tenant": "string",
  "attributed_business_unit": "string",
  "allocation_tier": "TIER_1_DIRECT | TIER_2_HEURISTIC_TELEMETRY | TIER_3_PRO_RATA | UNALLOCATED",
  "allocated_cost": "number (USD)",
  "confidence_score": "number (0.0 - 1.0)",
  "lineage_trace": {
    "source_resource": "string",
    "matching_rule": "string",
    "telemetry_ref": "string"
  }
}
```

---

## 3. Mathematical Allocation Formulas

### Tier 1: Direct Tag Allocation
For any line item where tags contain non-null `product_line` and `feature_id`:
$$\text{Cost}_{\text{Direct}}(p, f) = \sum_{i \in R_{\text{tagged}}} \text{unblended\_cost}_i$$

### Tier 2: Heuristic Ephemeral Join (Pod/PR Attribution)
For short-lived resources lacking static tags:
$$\text{Cost}_{\text{Ephemeral}}(i) = \text{unblended\_cost}_i \times \frac{\text{TelemetryRuntime}(i, \text{PR}_k)}{\sum \text{TelemetryRuntime}(i)}$$
Where $\text{PR}_k$ maps to `feature_id` via Git Commit Webhook logs.

### Tier 3: Shared Infrastructure Pro-Rata Split
For shared control planes or NAT gateways:
$$\text{Cost}_{\text{Shared}}(p) = \text{SharedTotalCost} \times \left( w_1 \cdot \frac{\text{API\_Volume}_p}{\sum \text{API\_Volume}} + w_2 \cdot \frac{\text{Active\_Tenants}_p}{\sum \text{Active\_Tenants}} \right)$$

---

## 4. SQL Join Pattern (Attribution Pipeline)

```sql
SELECT 
    b.billing_record_id,
    b.service_name,
    b.unblended_cost,
    COALESCE(b.tags->>'product_line', t.product_line, 'UNALLOCATED') AS attributed_product,
    COALESCE(b.tags->>'feature_id', t.feature_id, 'UNALLOCATED') AS attributed_feature,
    CASE 
        WHEN b.tags->>'product_line' IS NOT NULL THEN 'TIER_1_DIRECT'
        WHEN t.telemetry_id IS NOT NULL THEN 'TIER_2_HEURISTIC_TELEMETRY'
        WHEN b.service_name IN ('AmazonEKS-ControlPlane', 'AWS-NATGateway') THEN 'TIER_3_PRO_RATA'
        ELSE 'UNALLOCATED'
    END AS allocation_tier
FROM raw_cloud_billing b
LEFT JOIN usage_telemetry t 
    ON b.resource_id = t.node_ip 
    AND b.usage_start_time BETWEEN t.timestamp AND t.timestamp + INTERVAL '1 hour'
```
