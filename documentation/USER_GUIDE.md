# End-User Guide: Cloud Cost & Unit Economics Platform

## 1. Quickstart Navigation

The Unit Economics Platform is structured around role-specific workflows and operational insights. Use the top navigation bar to select your identity and access your dashboard.

---

## 2. Guide by User Role

### A. Finance Leadership & Controllers
1. **Navigating Macro Spend**: Open the **Finance View** tab. Review Total Spend, Attributed Spend %, and Unallocated Spend.
2. **Monitoring Unit Margins**: Track **Cost per Active Customer** (COGS) and **Cost per Transaction**.
3. **Month-End Reconciliation**: Open the **Migration & Reconciliation** tab. Verify that the sum of attributed costs plus unallocated spend equals the exact provider cloud bill (\$0 variance).
4. **Executing Rule Rollbacks**: If an allocation rule revision creates discrepancy, navigate to **Migration & Reconciliation** $\rightarrow$ Click **Revert to Previous Rule Version**.

### B. Engineering Leads & DevOps Engineers
1. **Auditing Ephemeral Dev Spend**: Open the **Engineering View** tab. View total compute consumed by PR preview environments.
2. **Detecting Missing Tags**: Check the **Untagged Resource Scanner**. Click on any unallocated resource to inspect missing `product_line` or `feature_id` tags.
3. **Eliminating Idle Waste**: Review the **Idle Preview Environment** widget to identify environments with 0 active dev hours running for $>24$ hours.

### C. Product Managers
1. **Feature Unit Economics**: Open the **Product View** tab to analyze cost trends per feature (e.g. *Instant Payouts*, *OAuth SSO*, *Realtime Pipeline*).
2. **Customer Workload Economics**: Drill into **Cost to Serve per Tenant**. Compare Enterprise vs SMB tier infrastructure spend against subscription ARR.

---

## 3. How to Perform a Cost Lineage Drill-Down

To trace any metric back to its origin:
1. Click on any cost card or table row bearing the **Lineage Search** icon.
2. The **Cost Lineage Inspector** modal will display:
   - **Cloud Billing Record ID** (AWS CUR / GCP line item)
   - **Physical Infrastructure Resource** (EC2 instance / EKS pod / RDS cluster)
   - **Allocation Rule Tier** (Direct Tag vs Ephemeral Telemetry Join vs Pro-Rata)
   - **Git Commit & Developer Identity** (for short-lived preview environments)
   - **Final Unit Cost Calculation Math**

---

## 4. Data Quality Escalation & Support

If you identify an unallocated cost spike or suspect a misattributed feature spend:
- **Step 1**: Check the **Data Freshness Indicator** in the header. Ensure billing sync is complete.
- **Step 2**: Click **Flag Data Quality Issue** within the lineage inspector.
- **Step 3**: The platform automatically routes the ticket to the FinOps Platform team with the resource ARN and telemetry snapshot attached.
