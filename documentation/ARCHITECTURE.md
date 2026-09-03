# Cloud Cost Allocation & Unit Economics Architecture

## 1. Executive Summary
This document specifies the enterprise system architecture for attributing cloud expenditure (AWS, GCP, Azure, Kubernetes) across hundreds of ephemeral, short-lived development environments directly to business units, products, features, and customer workloads.

---

## 2. End-to-End System Architecture

```mermaid
flowchart TD
    subgraph Data Sources
        A1[AWS CUR / GCP Billing CSV]
        A2[K8s Pod / Node Telemetry Logs]
        A3[Git Webhooks / PR Build Metadata]
        A4[Product Activity & Tenant Metrics]
    end

    subgraph Data Ingestion & Pipeline
        B1[Raw Ingestion Layer]
        B2[Schema Normalizer & Validator]
        B3[Tag Hierarchy Extractor]
    end

    subgraph Unit Economics Allocation Engine
        C1[Tier 1: Direct Allocation Engine]
        C2[Tier 2: Ephemeral Telemetry Join Engine]
        C3[Tier 3: Pro-Rata Shared Infra Allocator]
        C4[Unallocated Spend Quarantine]
    end

    subgraph Storage & Data Layer
        D1[(Unified Cost & Attribution Store)]
        D2[(Allocation Rules & Snapshot Versioning)]
    end

    subgraph Presentation & Analytics (Dashboard)
        E1[Finance View: Macro Spend & Margin]
        E2[Engineering View: Dev Env & Idle Waste]
        E3[Product View: Unit Cost per Feature/Tenant]
        E4[Reconciliation & Rollback Controller]
    end

    A1 --> B1
    A2 --> B1
    A3 --> B1
    A4 --> B1

    B1 --> B2
    B2 --> B3

    B3 --> C1
    B3 --> C2
    B3 --> C3

    C1 --> D1
    C2 --> D1
    C3 --> D1
    C1 -. Missing Tags .-> C4
    C4 -. Heuristic Match .-> C2

    D1 --> E1
    D1 --> E2
    D1 --> E3
    D2 --> E4
```

---

## 3. Core Data Flow & Allocation Pipeline

### Phase 1: Ingestion & Standardization
- Billing data is normalized from provider-native formats (AWS CUR 2.0, GCP BigQuery Export, Azure Cost Details) into a unified **FOCUS (FinOps Open Cost & Usage Specification)** format.
- Ephemeral development telemetry (Kubernetes cluster events, preview environment provisioning logs, PR trigger events) is ingested every 5 minutes.

### Phase 2: 3-Tier Allocation Engine
1. **Tier 1 — Direct Tag Allocation**: Line items bearing static tags (`product_line`, `feature_id`, `environment`, `tenant_id`) are mapped directly to accountable cost centers.
2. **Tier 3 — Ephemeral Telemetry Join Engine (Heuristic Attribution)**: Ephemeral dev pods active for $< 30$ minutes often lack static billing tags. The engine joins pod creation timestamps and node internal IP addresses with Git webhook commit metadata (`git_branch`, `author_email`, `pr_id`) to attribute compute spend back to the responsible feature and engineering squad.
3. **Tier 3 — Shared Infrastructure Pro-Rata Allocator**: Un-taggable shared infrastructure (e.g. EKS control planes, shared NAT gateways, central logging services) is distributed based on relative product consumption volume (API transaction counts or CPU core-hours consumed).

---

## 4. Stakeholder Assumptions & Requirements

| Stakeholder Role | Key Objective | Primary Unit Economics Metric | SLA & Freshness Requirement |
| :--- | :--- | :--- | :--- |
| **Finance Leadership** | Auditability, margin protection, budget predictability | Cost per Monthly Active Customer (COGS), Attributed % | Daily batch update ($< 24\text{h}$ lag), $\$0$ invoice variance |
| **Engineering Leads** | Eliminate untagged waste, optimize dev env runtime | Cost per Ephemeral Dev Environment, Idle Pod Cost % | Near real-time ($< 15\text{m}$ telemetry lag) |
| **Product Managers** | Price features accurately, assess feature ROI | Cost per Feature Deployment, Cost per API Call | Daily aggregate per release candidate |
| **FinOps Practitioner** | System trust, tag adoption tracking, zero-discrepancy migration | Unallocated Spend Rate (Target $< 5\%$) | Live rule execution & rollback capability |

---

## 5. Architectural Coexistence & Migration Strategy

To ensure zero operational disruption, the Unit Economics Engine operates as a **Coexistence Layer** alongside legacy monthly billing spreadsheets:
- **Zero-Discrepancy Guarantee**: $\sum \text{Attributed Spend} + \text{Unallocated Spend} = \text{Raw Cloud Invoice Total}$.
- **Parallel Run Phase**: Teams continue using legacy monthly reports for month-end accounting while referencing the Unit Economics Engine for operational optimization.
- **Rollback Mechanism**: Allocation rule changes are stored in an append-only git-backed state store. If an allocation rule revision introduces false attributions, a single click restores the snapshot without raw billing data loss.
