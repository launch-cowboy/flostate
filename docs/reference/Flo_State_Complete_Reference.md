# Flo State

**Your ClinOps Concierge for Everyday AI.**

Flo State is Florence Healthcare's AI-powered agent marketplace for clinical trial operations. It provides 6 intelligent agents, 4 workflow templates, and 5 reusable skills that transform reactive, fragmented site operations into proactive, AI-orchestrated workflows — built on Florence's 65,000+ site ecosystem.

---

## Table of Contents

1. [Agents](#agents)
   - [Protocol Complexity Burden Scorer](#1-protocol-complexity-burden-scorer)
   - [Protocol-to-Site-Operations Generator](#2-protocol-to-site-operations-generator)
   - [eISF-eTMF Reconciliation Bot](#3-eisf-etmf-reconciliation-bot)
   - [AI Regulatory Document Factory](#4-ai-regulatory-document-factory)
   - [Digital Trial Rehearsal](#5-digital-trial-rehearsal)
   - [Virtual SMO Layer](#6-virtual-smo-layer)
2. [Templates](#templates)
   - [Oncology Study Startup Kit](#7-oncology-study-startup-kit)
   - [CRA Monitoring Visit Prep](#8-cra-monitoring-visit-prep)
   - [Site Feasibility Response Assistant](#9-site-feasibility-response-assistant)
   - [Amendment Impact Assessment](#10-amendment-impact-assessment)
3. [Skills](#skills)
   - [Protocol Reader](#11-protocol-reader)
   - [Regulatory Calendar](#12-regulatory-calendar)
   - [Document Comparator](#13-document-comparator)
   - [Clinical Terminology Translator](#14-clinical-terminology-translator)
   - [Audit Trail Generator](#15-audit-trail-generator)
4. [Demo Input Files](#demo-input-files)
5. [Downloadable Output Files](#downloadable-output-files)
6. [Technical Architecture](#technical-architecture)

---

## Agents

### 1. Protocol Complexity Burden Scorer

**Category:** Protocol Design | **Version:** 1.0.0

**What It Does:**
Quantify operational complexity and site burden from your protocol before study activation. Phase III oncology protocols now average 263 procedures per patient and 3.6 million data points per study. The Scorer reads your protocol and quantifies the operational load across five weighted domains, producing a composite score with therapeutic area multipliers.

**Built For:** Study startup managers, site directors, PIs, feasibility teams

**How It Works:**
Upload a protocol PDF. Flo State extracts every visit, procedure, eligibility criterion, and data requirement. It scores operational complexity across 5 domains on a 1–10 scale, applies a therapeutic area multiplier (e.g., 1.3× oncology, 0.8× dermatology, 1.2× CNS), and generates a comprehensive scorecard.

**5-Domain Weighted Scoring Model:**

| Domain | Weight | What It Measures |
|--------|--------|-----------------|
| Operational Execution | 25% | Visit count, procedures/visit, data points, lab requirements, imaging |
| Regulatory Oversight | 20% | Safety reporting complexity, DSMB requirements, IND obligations |
| Patient Burden | 20% | Visit frequency, travel requirements, time per visit, invasive procedures |
| Site Burden | 20% | Staff training needs, equipment requirements, concurrent study load |
| Study Design | 15% | Randomization complexity, blinding, adaptive design elements |

**Time Saved:** Replaces 4–8 hours of manual protocol analysis per study.

**Demo Flow:**
1. Navigate to `/agents/protocol-complexity-scorer` → Click "Activate Agent"
2. Default protocol (ONK-301-2025) is pre-loaded
3. Click "Generate Score" → 2-second processing animation
4. Results render: 5-domain scorecard table, radar chart (protocol vs benchmark), site hours bar chart, burden flags, amendment risk (84% probability shown), and 5 ranked recommendations
5. Click "Export Scorecard" → downloads CSV

**Input Files:**
- `ONK-301-2025_Protocol.md` — Phase III NSCLC (16 I/15 E criteria, 10 visit types, PK/biomarker)
- `DERM-110-2025_Protocol.md` — Phase III Psoriasis (PASI scoring, photography, ePRO)
- `CNS-205-2024_Protocol.md` — Phase II Alzheimer's (18 infusion visits, ARIA monitoring)
- `Site_Feasibility_Questionnaire_MetroClinical.csv` — Site-level calibration data

**Output Files:**
- `ONK301_Complexity_Scorecard.csv` — 5-domain scores, 1.3× oncology multiplier, 77.5 hrs/patient
- `DERM110_Complexity_Scorecard.csv` — 0.8× derm multiplier, PASI/photography burden flags
- `CNS205_Complexity_Scorecard.csv` — 1.2× CNS multiplier, ARIA monitoring, 98 hrs/patient

---

### 2. Protocol-to-Site-Operations Generator

**Category:** Study Startup | **Version:** 1.1.0

**What It Does:**
Auto-generate site operational packages, schedules, and document checklists from a protocol. Every new study starts the same way — a coordinator receives a 200-page protocol and spends 40–80 hours manually extracting the information needed to run the study. The Generator reads the protocol once and produces the complete operational package.

**Built For:** Clinical research coordinators, study startup managers, CRAs

**How It Works:**
Upload a protocol PDF. Flo State reads every section and generates five operational deliverables: visit schedule table, document checklist, role-based training requirements, source document worksheet, and site burden estimate.

**Time Saved:** 40–80 hours per study, per site. Across a 50-site study, that is 2,000–4,000 hours returned to the system.

**Demo Flow:**
1. Navigate to `/agents/protocol-to-ops` → Click "Activate Agent"
2. Click "Generate Ops Package" → processing animation
3. Results render with tabs: Visit Schedule, Source Doc Templates, Document Checklist
4. Click "Export Operations Bundle" → downloads `DERM110_Operations_Bundle.csv`
5. Switch to "Source Docs" tab → click individual documents to download

**Output Files:**
- `DERM110_Operations_Bundle.csv` — Complete visit schedule with procedures per visit
- `DERM110_SourceTemplate.txt` — Source document template for data collection
- `Visit_Schedule_Operations.csv` — 9-visit schedule with DERM-110 procedures
- `Vital_Signs_ECG_Worksheet.txt` — Triplicate ECG + pre/post-dose vitals
- `PASI_IGA_Scoring_Sheet.txt` — PASI body region grid + IGA 5-point scale
- `Adverse_Event_Log.txt` — CTCAE v5.0, MedDRA coding, SAE criteria
- `ConMed_Medication_Log.txt` — WHO Drug ATC classification, prohibited med checks

---

### 3. eISF-eTMF Reconciliation Bot

**Category:** Document Management | **Version:** 1.0.0

**What It Does:**
Cross-reference site and sponsor documents to identify mismatches automatically — in 10 seconds. CRAs spend 3–7 hours per site, per visit, manually cross-checking site ISF documents against the sponsor's Trial Master File. The Reconciliation Bot compares every document across both systems using 6 reconciliation rules and generates a severity-rated discrepancy report with TMF zone references.

**Built For:** CRAs, TMF managers, quality assurance teams, site regulatory specialists

**6 Reconciliation Rules:**
1. **Missing in eISF** → Critical (document exists in eTMF but not site)
2. **Version Mismatch** → Critical (direction-aware: identifies which system has the newer version)
3. **Naming Inconsistency** → Minor (different naming conventions between systems)
4. **Filing Location Error** → Major (document filed in wrong TMF zone)
5. **Expired Document** → Critical (calculates days since expiration)
6. **Signature Gap** → Major (signed in eISF but unsigned in eTMF)

**Time Saved:** 3–7 hours per site per monitoring visit. For a CRA monitoring 10 sites monthly, 30–70 hours returned.

**Demo Flow:**
1. Navigate to `/agents/eisf-etmf-reconciliation` → Click "Activate Agent"
2. Two upload zones appear (eISF Index + eTMF Index)
3. Click "Run Reconciliation" → 1.5-second processing
4. Summary cards: 7 Critical Mismatches, 0 Major Findings, 14 Matched Properly (of 20 eISF / 21 eTMF)
5. Discrepancy table with TMF Zone column shows: ICF version mismatch (v3.0 vs v2.0), DOR version mismatch (v4.1 vs v3.0), IB version mismatch (v5.0 vs v4.0), SAE report missing from eISF, 3 expired credentials (PI license 148 days, Patel GCP 177 days, Williams GCP 330 days)
6. Click "Export CSV Report" → downloads discrepancy report

**Data Files:**
- `eisf_documents.json` — 20 artifacts across 12 Florence eBinder zones (Zones 2.1–22.8)
- `etmf_documents.json` — 21 artifacts with deliberate discrepancies for demo

**Output Files:**
- `eISF_eTMF_Discrepancy_Report.csv` — Full discrepancy report with TMF zone references

---

### 4. AI Regulatory Document Factory

**Category:** Regulatory | **Version:** 2.0.0

**What It Does:**
Three specialized agents preparing your regulatory startup package in parallel. Regulatory document preparation is the single longest phase of site activation — taking weeks because every document is prepared independently. The Factory is a multi-agent system handling 1572 auto-population, delegation gap analysis, and CV/license expiration monitoring, with an orchestration layer detecting cross-document dependencies.

**Built For:** Regulatory specialists, coordinators, study startup managers, site directors

**Three Sub-Agents:**
1. **1572 Populator** — Auto-fills FDA Form 1572 from site data (PI info, sub-investigators, facilities, labs, IRB)
2. **Delegation Analyzer** — Scans delegation logs for gaps, expired training, and missing signatures
3. **CV/License Monitor** — Tracks credential expirations with severity tiers (overdue/30-day/90-day)

**Time Saved:** Reduces regulatory preparation from 3–6 weeks to same-day review.

**Demo Flow:**
1. Navigate to `/agents/regulatory-doc-factory` → Click "Activate Agent"
2. Three sub-agent panels activate simultaneously
3. Each agent processes its portion: 1572 auto-population, delegation analysis, CV monitoring
4. Results show cross-document dependencies (new sub-investigator triggers delegation update)

**Input Files:**
- `FDA_Form_1572_PrePopulated.txt` — Pre-populated regulatory form
- `Site_Delegation_Log_MetroClinical.csv` — 9 staff, 4 studies, compliance gaps
- `Principal_Investigator_CV_Dr_Chen.txt` — PI credentials (47 trials, certifications)

---

### 5. Digital Trial Rehearsal

**Category:** Site Intelligence | **Version:** 1.0.0

**What It Does:**
Rehearse your trial before going live — find the bottlenecks before they find you. Every other industry rehearses before going live; clinical trials spend millions activating sites with no simulation. The Rehearsal runs 1,000 Monte Carlo iterations using historical site performance data, modeling activation timelines, enrollment forecasts, and cost-of-delay for three distinct site archetypes.

**Built For:** Study startup managers, clinical operations directors, site directors

**3 Site Archetypes:**

| Site Type | Median Activation | Best Case (P10) | Worst Case (P90) |
|-----------|-------------------|-----------------|-------------------|
| Academic Medical Center | 142 days | 92 days | 214 days |
| Dedicated Research Site | 74 days | 48 days | 112 days |
| Community Hospital | 108 days | 70 days | 162 days |

**5 Simulation Phases:**
1. Contract Negotiation (log-normal distribution, highest variance)
2. IRB/Ethics Approval (PERT distribution, central vs. local)
3. Regulatory Document Collection (triangular distribution)
4. Site Initiation Visit (narrow distribution)
5. First Patient Screening (depends on enrollment rate)

**Time Saved:** Prevents 2–8 weeks of avoidable delay per site by identifying bottlenecks before they happen.

**Demo Flow:**
1. Navigate to `/agents/digital-trial-rehearsal` → Click "Activate Agent"
2. Select site archetype from dropdown (Academic/Dedicated/Community)
3. Click "Run Monte Carlo (1,000 Iterations)" → 2-second simulation
4. Results: distribution chart, 3 key metrics (Median/P10/P90), phase-by-phase forecast table, enrollment forecast, 3 bottleneck cards with mitigations, critical path analysis, site comparison table, cost-of-delay ($55,716/day), scheduling conflicts
5. Switch site type → re-run to compare (74 days vs 142 days)
6. Click "Export Report" → downloads CSV

**Input Files:**
- `Site_Activation_Tracker.csv` — 10 sites × 5 countries, milestone dates, risk flags
- `Investigator_Brochure_Summary_ONK301.txt` — Drug safety/efficacy data for risk parameters
- `Site_Feasibility_Questionnaire_MetroClinical.csv` — Historical performance metrics

**Output Files:**
- `ONK301_Rehearsal_Report.csv` — Phase timeline, enrollment forecast, bottlenecks, cost-of-delay

---

### 6. Virtual SMO Layer

**Category:** Monitoring & Oversight | **Version:** 1.2.0

**What It Does:**
Your coordinator's AI-powered morning briefing — every study, every task, every alert. Coordinators manage 7+ studies simultaneously with 20+ systems and no unified view. The Virtual SMO Layer curates a prioritized dashboard of everything that needs attention across every study, modeled after China's embedded SMO approach which runs clinical development at 2–5× US enrollment speed and 20–50% of US cost.

**Built For:** Clinical research coordinators, site directors, research managers

**Dashboard Sections:**
1. **Workload Assessment** — Patients, FTE, active studies with capacity indicator
2. **Today's Tasks** — P1-Critical through P4-Routine priority badges, clickable completion
3. **Monitoring Visit Prep** — 12 eBinder zone documents with ✓/✗/⚠ readiness status
4. **Credential Alerts** — Expired GCP certs, medical licenses, delegation log gaps
5. **AI-Drafted Communications** — Pre-drafted emails with "AI-DRAFTED • REQUIRES HUMAN REVIEW" labels
6. **Portfolio Status** — 4-study table with enrollment progress bars and RAG regulatory indicators
7. **Scheduling Conflicts** — Time-slot conflicts across studies with AI resolutions

**Time Saved:** 2–3 hours per coordinator per day. Over 5,000 hours/year for a typical site.

**Demo Flow:**
1. Navigate to `/agents/virtual-smo` → Click "Activate Agent"
2. Maria Rodriguez's dashboard renders for Metro Clinical Research Center
3. Workload bar: 22 patients / 5.25 FTE / 4 studies
4. 7 tasks with P1–P4 priority badges — click circle to dismiss/complete
5. Monitoring Visit Prep table: 12 documents mapped to Florence eBinder zones
6. Credential Alerts: 2 overdue GCP certs, 1 medical license lapse
7. AI-Drafted Comms: 2 pre-drafted emails (protocol deviation, IRB continuing review)
8. Portfolio Status: ONK-301 (87% enrolled), DERM-110 (45%), CNS-205 (23%), LUNG-812 (62%)
9. Click "Portfolio Report" → downloads weekly status CSV

**Input Files:**
- `Monitoring_Visit_Prep_Checklist.csv` — 32 essential documents across 15 TMF zones
- `IRB_Correspondence_Log.csv` — 16 IRB entries across 4 protocols
- `Site_Delegation_Log_MetroClinical.csv` — 9 staff, 4 studies, compliance gaps
- `Principal_Investigator_CV_Dr_Chen.txt` — PI credentials
- `FDA_Form_1572_PrePopulated.txt` — Regulatory document status

**Output Files:**
- `SMO_Weekly_Portfolio_Status.csv` — 4-study portfolio metrics, credential alerts
- `Monitoring_Visit_Report_Template.txt` — 12-section CRA report mapped to eBinder zones
- `Essential_Document_Regulatory_Checklist.csv` — ICH E6(R3) §8 checklist, 28 documents, 86% compliance

---

## Templates

### 7. Oncology Study Startup Kit

**Category:** Study Startup | **Version:** 1.0.0

Everything a coordinator needs to launch an oncology study, in one workspace. Pre-loaded with RECIST 1.1 criteria (≤5 target lesions, 2 per organ), iRECIST for immunotherapy pseudoprogression (1–16% of patients), NCI CTCAE v5.0 grading (26 System Organ Classes), companion diagnostics (78+ FDA-approved CDx combinations), and irAE management guidelines.

**Built For:** Coordinators new to oncology, study startup managers
**Skills Enabled:** Protocol Reader, Regulatory Calendar

*Note: This template has a store listing but no interactive workspace in the current build.*

---

### 8. CRA Monitoring Visit Prep

**Category:** Monitoring & Oversight | **Version:** 1.0.0

Walk into every visit knowing exactly what to look for. Creates a monitoring-focused AI workspace grounded in ICH E6(R3) requirements — where centralized monitoring can now serve as the sole approach (Section 3.11.4.2.b). Addresses top FDA BIMO inspection findings: Form 1572 non-compliance (#1), protocol deviations (#2), inadequate case histories (#3).

**Built For:** CRAs, lead CRAs, monitoring managers
**Skills Enabled:** Document Comparator, Regulatory Calendar

**Demo Flow:**
1. Navigate to `/templates/cra-monitoring-visit-prep` → Click **Install Template**
2. 3-stage install animation (~5s): Scaffolding → Ingesting → Activating
3. Workspace opens with visit info banner: ONK-301, Metro Clinical Research Center (Site 4521), CRA Jennifer Walsh (Syneos Health), Enrolled 16/25
4. 6 collapsible checklist sections with 25 total items:
   - Section A: Regulatory / ISF Review (7 items)
   - Section B: Informed Consent (4 items)
   - Section C: Source Data Verification (5 items)
   - Section D: Investigational Product (3 items)
   - Section E: Safety Reporting (3 items)
   - Section F: Risk Assessment (3 items)
5. Each item has a PASS/FLAGGED badge and contextual note. Click items to check them off — progress bar updates in real time
6. 8 items are pre-flagged (e.g., "Dr. Rodriguez financial disclosure update due in 18 days")
7. After all 25 items checked → green "Pre-Visit Checklist Complete" banner with "Generate Visit Report" button

**Input:** Embedded mock data (no file upload)
**Output:** Export Report button (demo only — no file download wired)

---

### 9. Site Feasibility Response Assistant

**Category:** Site Intelligence | **Version:** 1.0.0

Answer feasibility questionnaires in minutes, not days. Sites spend a median 264 hours/year on feasibility assessments costing >$1M annually (ASCO 2021). Only 62% of engaged sites ever activate — this assistant drafts responses based on actual site data, reusing site profile and capability data across questionnaires.

**Built For:** Coordinators, site business development leads, PIs
**Skills Enabled:** Protocol Reader, Clinical Terminology Translator

*Note: This template has a store listing but no interactive workspace in the current build.*

---

### 10. Amendment Impact Assessment

**Category:** Study Startup | **Version:** 1.0.0

See the full cascade of every protocol change before it reaches your site. 76% of protocols have ≥1 amendment, averaging 3.3 amendments per protocol with 6.9 changes each. Each amendment cascades across 12+ operational areas (ICFs, training records, visit schedules, EDC, IRB). Implementation averages 260 days — nearly tripled in a decade.

**Built For:** Coordinators, regulatory specialists, CRAs
**Skills Enabled:** Protocol Reader, Document Comparator, Regulatory Calendar

**Demo Flow:**
1. Navigate to `/templates/amendment-impact-assessment` → Click **Install Template**
2. Install animation (~5s) → workspace opens to **document comparison upload screen**
3. Two side-by-side upload dropzones: Original Protocol (left) + Amended Protocol (right)
4. Click **Load Sample** to pre-fill with `PHOENIX-301_Protocol_v3.0.pdf` → `v4.0_Amendment2.pdf`
5. Click **Run Impact Assessment** → 3-second analysis animation with 6 streaming status steps
6. Results render with 5 tabs:
   - **Changes** — 7 protocol changes as side-by-side diff cards (Original v3.0 → Amended v4.0) with Critical/Major/Minor severity badges
   - **Cascade** — Table of 12 downstream actions with change, impact area, owner, priority, effort
   - **Documents** — 10 affected documents as checkable items with version transitions
   - **Timeline** — Gantt chart: 8 implementation phases across 47 days, critical path in red
   - **Re-consent** — 14/16 subjects re-consented (87.5%), 2 pending with next visit dates

**Input:** Two protocol versions (mock upload or "Load Sample")
**Output:** Export button (demo only — no file download wired)

---

## Skills

### 11. Protocol Reader

**Category:** Protocol Design | **Version:** 1.0.0

Extracts structured metadata, schedules, and criteria directly from protocol PDFs. Turns any 100–300 page protocol PDF into structured, queryable data. Aligned with ICH M11 (CeSHarP, finalized November 2025) mandating harmonized protocol template structure. Uses two-stage architecture: transformer-based table detection followed by multimodal LLM extraction.

**Demo Flow:**
1. Navigate to `/skills/protocol-reader` → Click **Activate Skill**
2. Upload screen appears with two options: Upload Protocol PDF or **Load Sample Protocol**
3. Click **Load Sample Protocol** → 2.5s extraction animation with 5 streaming steps (parsing, extracting, mapping)
4. Results render with 6 tabs:
   - **Study Overview** — PHOENIX-301 metadata: Sponsor (Axion Therapeutics), Phase III, 450 subjects, 1:1 randomization, 104-week treatment + 2-year follow-up, 2 study arms
   - **Schedule of Events** — 24-visit × 16-procedure matrix with checkmarks (Screening through Follow-up 5, including PK Sampling "Cohort 1 only" annotation)
   - **Eligibility** — 6 Inclusion + 5 Exclusion criteria with plain-English translations and "Restrictive" / "Screen Failure Risk" badges
   - **Endpoints** — 5 endpoints: 1 Primary (PFS), 3 Secondary (OS, ORR, DoR), 1 Exploratory (HRQoL) with statistical methods
   - **Design Parameters** — 4 cards: Sample Size (450, 90% power), Interim Analyses (O'Brien-Fleming), Stratification (3 factors), DSMB (5 members)
   - **Complexity** — 4 KPIs (24 visits, 16 procedures, 263/patient, ~3.1M data points) + benchmarks table

**Input:** Upload protocol PDF or "Load Sample" (PHOENIX-301 embedded data)
**Output:** Export All button (demo only — no file download wired)

---

### 12. Regulatory Calendar

**Category:** Regulatory | **Version:** 1.0.0

Never miss a regulatory deadline again. Tracks: IRB continuing review (annual, 45 CFR 46), IND annual reports (60 days per 21 CFR 312.33), GCP training renewals (3 years), medical licenses (1–3 years by state), DEA registrations (3 years), CLIA certificates (2 years), safety reporting windows (15 days SUSARs, 7 days fatal), ClinicalTrials.gov results (1 year, penalties up to $12,103/day).

*Note: This skill has a store listing but no interactive workspace in the current build.*

---

### 13. Document Comparator

**Category:** Document Management | **Version:** 1.0.0

See exactly what changed between two versions of any document. Identifies every difference between document versions with change categorization: Critical (safety/data integrity), Major (direct GxP violation), Minor (low probability of impact). Supports protocols, ICFs, IBs, delegation logs.

*Note: This skill has a store listing but no interactive workspace in the current build.*

---

### 14. Clinical Terminology Translator

**Category:** Protocol Design | **Version:** 1.0.0

Turn protocol language into plain-English instructions for any role. Coordinators perform 128 different activities — the Translator calibrates output for CRCs (visit schedules, I/E criteria), research nurses (procedures, dosing), regulatory coordinators (IRB requirements), data entry specialists (variable definitions), PIs (stopping rules), and research pharmacists (drug handling).

*Note: This skill has a store listing but no interactive workspace in the current build.*

---

### 15. Audit Trail Generator

**Category:** Regulatory | **Version:** 1.0.0

GxP-ready documentation of every AI-assisted action. Compliant with 21 CFR Part 11 §11.10(e), EU Annex 11, and ALCOA+ principles. Logs: input data with source/version, model identification, output with confidence score, human review action (approved/edited/rejected with rationale), synchronized timestamps, and user identification with role/authority level. Aligned with EU GMP Annex 22 (first AI/ML GMP framework, July 2025) and FDA CSA Guidance (September 2025).

**Demo Flow:**
1. Navigate to `/skills/audit-trail-generator` → Click **Activate Skill**
2. Session log opens immediately — 12 timestamped audit entries spanning February 24, 2025 (08:02 AM – 3:15 PM)
3. Each entry shows: timestamp, user, role, agent name, action type, output summary, and Approved/Edited/Rejected badge
4. Click any entry to expand → shows full Input Summary, Output Summary, Study, Document Affected, Confidence %, Decision
5. GxP filter buttons: All / GxP-critical (5) / GxP-relevant (3) / Non-GxP (4)
6. Click **Session Summary** tab → 4 KPI cards: 12 Total Actions, 9 Approved (75%), 2 Edited (17%), 1 Rejected (8%). Session details: 7h 13m duration, 2 users, 7 agents, 9 documents, 3 studies (ONK-301, CNS-405, CARD-112)
7. Click **Compliance Dashboard** tab → Human-in-the-loop metrics (25% override rate, 75% AI accuracy, 92% avg confidence) + full ALCOA+ checklist (9/9 green checks) + "Regulatory Readiness: 100%" banner

**Input:** Embedded mock data (12 audit entries across multiple agents/users)
**Output:** Export for TMF button, Inspector View button (demo only — no file download wired)

---

## Demo Input Files

All demo input files are located in `/demo_files/`:

| # | File | TMF Zone | Agent(s) |
|---|------|----------|----------|
| 1 | `ONK-301-2025_Protocol.md` | 11.1 | Scorer, Rehearsal |
| 2 | `DERM-110-2025_Protocol.md` | 11.1 | Scorer, Ops Generator |
| 3 | `CNS-205-2024_Protocol.md` | 11.1 | Scorer |
| 4 | `Principal_Investigator_CV_Dr_Chen.txt` | 3.1 | Reg Factory, SMO |
| 5 | `Site_Delegation_Log_MetroClinical.csv` | 12.2 | Reg Factory, SMO |
| 6 | `Site_Feasibility_Questionnaire_MetroClinical.csv` | 3/5 | Scorer, Rehearsal |
| 7 | `Site_Activation_Tracker.csv` | 5/22 | Rehearsal |
| 8 | `Investigator_Brochure_Summary_ONK301.txt` | 6.1 | Rehearsal |
| 9 | `Monitoring_Visit_Prep_Checklist.csv` | 22 | SMO |
| 10 | `IRB_Correspondence_Log.csv` | 9 | SMO |
| 11 | `FDA_Form_1572_PrePopulated.txt` | 2.5 | Reg Factory |
| 12 | `ICF_Version_3.0_Site_eISF.md` | 17.1 | Reconciliation |
| 13 | `ICF_Version_2.0_Sponsor_eTMF.md` | 17.1 | Reconciliation |

---

## Downloadable Output Files

All downloadable output files are in `public/downloads/`:

| # | File | Agent | Description |
|---|------|-------|-------------|
| 1 | `ONK301_Complexity_Scorecard.csv` | Scorer | 5-domain scores, 1.3× oncology multiplier |
| 2 | `DERM110_Complexity_Scorecard.csv` | Scorer | 0.8× derm multiplier, PASI burden |
| 3 | `CNS205_Complexity_Scorecard.csv` | Scorer | 1.2× CNS multiplier, ARIA monitoring |
| 4 | `ONK301_Rehearsal_Report.csv` | Rehearsal | Phase timeline, enrollment, cost-of-delay |
| 5 | `SMO_Weekly_Portfolio_Status.csv` | SMO | 4-study portfolio metrics |
| 6 | `Monitoring_Visit_Report_Template.txt` | SMO | 12-section CRA report, eBinder zones |
| 7 | `Essential_Document_Regulatory_Checklist.csv` | SMO | ICH §8, 28 documents, 86% compliance |
| 8 | `DERM110_Operations_Bundle.csv` | Ops Generator | Complete visit schedule |
| 9 | `Visit_Schedule_Operations.csv` | Ops Generator | 9-visit DERM-110 schedule |
| 10 | `DERM110_SourceTemplate.txt` | Ops Generator | Source document template |
| 11 | `Vital_Signs_ECG_Worksheet.txt` | Ops Generator | Triplicate ECG + vitals |
| 12 | `PASI_IGA_Scoring_Sheet.txt` | Ops Generator | PASI grid + IGA scale |
| 13 | `Adverse_Event_Log.txt` | Ops Generator | CTCAE v5.0, MedDRA |
| 14 | `ConMed_Medication_Log.txt` | Ops Generator | WHO Drug ATC classification |
| 15 | `eISF_eTMF_Discrepancy_Report.csv` | Reconciliation | TMF zone discrepancy report |

---

## Cash Flo — AI ROI Intelligence Platform

**Route:** `/dashboard` (accessible via "Cash Flo" button in the StoreFront header)

**What It Does:**
Executive analytics dashboard showing the ROI of Flo State across 5 tiers: Operational Velocity, Site Performance, Financial Impact, Predictive Intel, and Token Economics.

**Demo Flow:**
1. Click **Cash Flo** in top nav → Overview tier loads with hero KPIs
2. Time toggle: **This Week** ($12.4M value) / **This Month** ($48.2M) / **This Year** ($412.5M)
3. Click **Operational Velocity** → Doc cycle time (3.2× speed multiplier), eISF activation (342 days saved), TMF readiness bars
4. Click **Site Performance** → Engagement vs Enrollment scatter, Adoption Funnel (8,500 → 1,200 power users)
5. Click **Financial Impact** → Revenue conversion, EBITDA Margin Bridge (24.2% → 26.9%, 270 bps), Churn/Retention by adoption tier
6. Click **Predictive Intel** → Risk Radar (5 categories), Sites Needing Attention table, 87% prediction accuracy
7. Click **Token Economics** → Agent efficiency ranking, 835× ROI ratio, $0.0034 avg cost/token

**Input:** Embedded analytics data (`cashflo_analytics.ts`)
**Output:** Read-only dashboard — no file downloads

---

## Technical Architecture

- **Framework:** React 18 + TypeScript + Vite
- **UI:** Tailwind CSS + shadcn/ui components
- **Charts:** Recharts (radar, bar, line, area, scatter)
- **Routing:** React Router v6 with HashRouter (`/#/agents/:slug`, `/#/templates/:slug`, `/#/skills/:slug`, `/#/dashboard`)
- **AI Models:** Claude Opus 4.6 (protocol analysis), Gemini 3.1 Pro (code generation), Google Antigravity (agentic orchestration)
- **AI Architecture:** Hexagonal adapter pattern (`claude-adapter.ts`) with circuit breaker (2 failures → cached fallback) + offline demo mode
- **Simulation:** Custom Monte Carlo engine (1,000 iterations, 3 site archetypes, 5 phases)
- **Data Layer:** Clinical trial knowledge graph — 7 JSON stores mapping protocols, TMF documents, site profiles, coordinator workflows using DIA TMF Reference Model
- **Ontology:** TMF Zones (DIA Reference Model), CTCAE v5.0, RECIST 1.1, ICH E6 GCP, ALCOA+, 5-domain weighted scoring with therapeutic area multipliers
- **Testing:** Playwright E2E (8 tests, 42.2s) + TypeScript strict mode (zero errors)
- **Compliance:** 21 CFR Part 11, HIPAA, GDPR, EU Annex 11, ICH E6(R3), EU GMP Annex 22

### 30-Second Elevator Pitch

> We built this in 48 hours using a multi-model AI stack: **Claude Opus 4.6** for deep protocol analysis and structured extraction, **Gemini 3.1 Pro** for rapid code generation and iteration, and **Google Antigravity** as the agentic coding orchestrator that wired it all together. The architecture uses a hexagonal adapter pattern so every agent can run live against the LLM or fall back to domain-expert cached outputs — the demo works perfectly offline. The data layer is a clinical trial knowledge graph mapping protocols, TMF documents, site profiles, and coordinator workflows using the DIA TMF Reference Model ontology. Agents run in an agentic execution loop — they analyze, generate a plan, then autonomously execute multi-step workflows with real-time streaming logs. The frontend is React + TypeScript + Recharts with Playwright E2E tests validating every workflow.
