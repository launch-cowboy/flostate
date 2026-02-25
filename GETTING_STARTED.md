# Flo State Demo - Getting Started

This guide explains how to launch the Flo State demo locally, run the core workflows from the demo talk track, and avoid common issues during a live demo.

## 1. Keep your local repo in sync

If you already cloned this repository, use:

```bash
git fetch origin
git checkout main
git reset --hard origin/main
```

Note: `git reset --hard` discards local uncommitted changes.

## 2. Prerequisites

- Node.js 18+ (Node 20 LTS recommended)
- npm (comes with Node)
- macOS/Linux/Windows terminal
- Modern browser (Chrome recommended for demos)

## 3. Install and run locally

From repo root:

```bash
npm install
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

## 4. Build and preview (optional)

```bash
npm run build
npm run preview
```

## 5. Important paths in this repo

- Demo reference markdown: `docs/reference/Flo_State_Complete_Reference.md`
- Demo talk track: `docs/reference/Flo-State-Demo-Talk-Track.docx` and `.pdf`
- Catalog source: `src/data/store_catalog.json`
- Demo inputs: `demo_files/`
- Download outputs: `public/downloads/`

## 6. URL routing note

This app uses `HashRouter`.

- Home: `http://localhost:5173/#/`
- Agents: `http://localhost:5173/#/agents/<slug>`
- Templates: `http://localhost:5173/#/templates/<slug>`
- Skills: `http://localhost:5173/#/skills/<slug>`
- Cash Flo: `http://localhost:5173/#/dashboard`

## 7. Recommended 5-7 minute demo flow

Use this order from the talk track:

1. Protocol-to-Site-Operations Generator (`#/agents/protocol-to-ops`)
2. eISF-eTMF Reconciliation Bot (`#/agents/eisf-etmf-reconciliation`)
3. Protocol Reader (`#/skills/protocol-reader`)
4. Cash Flo (`#/dashboard`)

## 8. Workflow runbook (from talk track)

### A) Protocol-to-Site-Operations Generator

Route: `#/agents/protocol-to-ops`

1. Open the agent from StoreFront and click `Activate Agent`.
2. Optionally upload a protocol file.
3. Click `Process Protocol`.
4. Review tabs (Visit Schedule, Regulatory Checklist, Training Matrix, Source Documents, Reference Card).
5. Click `Export Operations Bundle` to download `DERM110_Operations_Bundle.csv`.
6. In Source Documents tab, download individual templates (for example `Vital_Signs_ECG_Worksheet.txt`).

Inputs:

- Embedded mock data (DERM-110 demo path)

Outputs:

- `DERM110_Operations_Bundle.csv`
- Individual source document `.txt` downloads

### B) eISF-eTMF Reconciliation Bot

Route: `#/agents/eisf-etmf-reconciliation`

1. Open agent and click `Activate Agent`.
2. Optionally add files in both dropzones.
3. Click `Run Reconciliation`.
4. Review discrepancy table (severity, artifact, TMF zone, eISF vs eTMF values, action).
5. Click `Export Report` to download `eISF_eTMF_Discrepancy_Report.csv`.
6. Click `Generate Resolution Plan`, then `Execute All` to show agentic execution log.

Inputs:

- Embedded: `src/data/eisf_documents.json`, `src/data/etmf_documents.json`

Outputs:

- `eISF_eTMF_Discrepancy_Report.csv`

### C) Protocol Reader

Route: `#/skills/protocol-reader`

1. Open skill and click `Activate Skill`.
2. Click `Load Sample Protocol`.
3. Walk through tabs in order: Study Overview, Schedule of Events, Eligibility, Endpoints, Design Parameters, Complexity.

Input:

- Sample protocol data (embedded PHOENIX-301 dataset)

Output:

- Demo-only in UI (no wired file download)

### D) Cash Flo Dashboard

Route: `#/dashboard`

1. From top nav, click `Cash Flo`.
2. Point out hero KPIs on Overview.
3. Toggle `This Week` -> `This Month` -> `This Year`.
4. Open tabs in sequence:
   - Operational Velocity
   - Site Performance
   - Financial Impact
   - Predictive Intel
   - Token Economics
5. Close with financial proof points (margin bridge and ROI/token).

Input:

- Embedded analytics data

Output:

- View-only dashboard (no export)

## 9. Additional workflows available

### Virtual SMO Layer

Route: `#/agents/virtual-smo`

- Morning briefing loads immediately.
- Export action downloads `SMO_Weekly_Portfolio_Status.csv`.
- `Generate Execution Plan` and `Execute All Actions` show sequential execution logs.

### CRA Monitoring Visit Prep (template)

Route: `#/templates/cra-monitoring-visit-prep`

- Install template and complete checklist sections.
- Export button is demo-only (no file output).

### Audit Trail Generator

Route: `#/skills/audit-trail-generator`

- Session log with filters, summary, compliance dashboard.
- Export/Inspector actions are demo-only in current build.

## 10. What is wired vs demo-only

Wired file downloads include (examples):

- `public/downloads/DERM110_Operations_Bundle.csv`
- `public/downloads/eISF_eTMF_Discrepancy_Report.csv`
- `public/downloads/SMO_Weekly_Portfolio_Status.csv`
- Other files listed in `README.md`

Demo-only actions (UI present, no actual file output):

- Protocol Reader `Export All`
- CRA Monitoring Visit Prep `Export Report`
- Amendment Impact Assessment `Export`
- Audit Trail Generator `Export for TMF` and `Inspector View`
- Cash Flo exports (dashboard is view-only)

## 11. Troubleshooting

- Blank/404-like page:
  - Ensure URL uses hash routes (example: `/#/dashboard`).
- Missing dependencies:
  - Run `npm install` again.
- Port already in use:
  - Start Vite on a different port:
    - `npm run dev -- --port 5174`
- Download button does nothing:
  - Confirm target file exists in `public/downloads/`.
- Calendar links blocked:
  - Allow browser pop-ups for localhost.

## 12. Demo day checklist

1. `git fetch origin && git checkout main && git reset --hard origin/main`
2. `npm install`
3. `npm run dev`
4. Open `/#/` and sanity-check key routes:
   - `/#/agents/protocol-to-ops`
   - `/#/agents/eisf-etmf-reconciliation`
   - `/#/skills/protocol-reader`
   - `/#/dashboard`
5. Verify sample downloads work:
   - `DERM110_Operations_Bundle.csv`
   - `eISF_eTMF_Discrepancy_Report.csv`
   - `SMO_Weekly_Portfolio_Status.csv`
