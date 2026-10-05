# Provenance, Code Originality & License Justification

## 1. Overview & Context
This document formally resolves the provenance and copyright attribution for the **Cloud Cost Allocation & Unit Economics Intelligence Platform** repository.

During initial repository setup, the project scaffolding was created inside a workspace that previously contained template files from an Agentic AI course instructed by Dr. Julius Sechang Mboli. As an artifact of that initial seed commit, third-party bootcamp resources (`resources/`, course outlines, and a template `LICENSE` bearing the instructor's name) were inadvertently included in the repository.

---

## 2. Provenance Resolution & Actions Taken

To ensure 100% repository hygiene, provenance integrity, and alignment with academic/industry standards:

1. **Third-Party Material Removal**:
   - All unrelated course materials, worksheets, fulfillment-center notebooks, and programme outlines under `resources/`, `One_Week_Programme_Outline.md`, and `References_and_Further_Reading.md` have been completely removed from this repository.
2. **License Copyright Correction**:
   - The root [`LICENSE`](../LICENSE) file has been updated to reflect the true project author and maintainer:
     ```
     Copyright (c) 2026 Silviya Dharshini
     ```
   - The license remains under the permissive **MIT License**.

---

## 3. Affirmation of Code Originality

All software components, data schemas, algorithmic engines, and user interfaces comprising this platform were designed, architected, and authored by **Silviya Dharshini** specifically for the Cloud Unit Economics platform objective:

| Component | Path | Description & Originality Scope |
| :--- | :--- | :--- |
| **3-Tier Allocation Engine** | [`src/engine/allocator.js`](../src/engine/allocator.js) | Custom algorithm implementing Tier 1 static tag routing, Tier 2 ephemeral K8s IP/pod-to-Git telemetry join, Tier 3 pro-rata shared resource distribution, unallocated quarantine, and dynamic unit cost derivation. |
| **Reconciliation & Rollback Engine** | [`src/engine/reconciliation.js`](../src/engine/reconciliation.js) | Custom reconciliation engine enforcing zero-discrepancy ($0.00 variance) between raw cloud invoices and attributed spend, with immutable rule versioning and 1-click snapshot rollback. |
| **Automated Validator Suite** | [`src/engine/validator.js`](../src/engine/validator.js) | Custom test harness validating 5 critical FinOps edge cases (EDGE-01 to EDGE-05) against enterprise benchmarks. |
| **Multi-Persona Dashboard** | [`src/components/*`](../src/components/) | React 18 UI components tailored to Finance, Engineering, and Product personas, featuring real-time lineage trace inspection, cost-to-serve analytics, and dynamic feature unit cost tables. |
| **Curated Synthetic Datasets** | [`data/*.json`](../data/) | Synthetic AWS CUR/GCP billing records, Kubernetes pod telemetry logs, customer tenant MRR/API activity, and pro-rata distribution weighting matrices. |
| **Architecture & Specifications** | [`documentation/*.md`](.) | System architecture diagrams, FOCUS data schema definitions, experiment benchmark reports, and security threat models. |

---

## 4. Verification & Audit Trail
- **Author**: Silviya Dharshini (GitHub: `@Silviya-158`)
- **License**: MIT License
- **Provenance Status**: Fully Resolved & Verified Original
