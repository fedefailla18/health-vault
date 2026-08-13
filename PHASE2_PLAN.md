# HealthVault Phase 2: Google Sheets Integration — "Cards on the Table"

This document details the exact technical strategy and architecture for Phase 2. No code will be written until this plan is validated.

## 1. The Goal
Enable mobile-friendly data entry via Google Sheets that automatically synchronizes with the local, version-controlled CSV files in `healthVault/data/`.

## 2. Technical Stack
- **Language:** TypeScript (Node.js)
- **Libraries:** `googleapis`, `csv-parse`, `csv-stringify`, `dotenv`
- **Auth:** Google Service Account (JSON Key).

## 3. Data Flow Architecture (Bidirectional)
```text
[ User Phone/Web ] <──► [ Google Sheets ]
                                ▲
                                │ (Bidirectional Sync)
                                ▼
[ Local CSV Data ] <──► [ Sync Script ] ──► [ Git Commit (Optional) ]
```

## 4. Detailed Component Design

### A. The Spreadsheet Structure
We will use **one Spreadsheet** with 6 tabs. Each tab will have a header row exactly matching our CSVs.

### B. The Sync Script (`scripts/sync-sheets.ts`)
- **Action:** Bidirectional Merge.
- **Logic:**
    1. Read local CSV and Cloud Sheet.
    2. **Cloud -> Local:** Identify rows in the Cloud that are missing locally (based on fingerprint: `date` + key columns) and append them to the CSV.
    3. **Local -> Cloud:** Identify rows added locally that are missing in the Cloud and append them to the Sheet.
- **Deduplication:** A "Row Fingerprint" will be generated for every entry to prevent duplicate syncing.
- **Backup:** Timestamped backups of `data/` will be created before any local write.

### C. Authentication & Secrets
- `healthVault/.env`: Stores the `SPREADSHEET_ID`.
- `healthVault/credentials.json`: The Service Account key (Ignored by Git).

## 5. Deployment Strategy (The "Phases of the Phase")
1. **Infrastructure (User Task):** Create Google Project, Service Account, and Spreadsheet.
2. **Boilerplate:** Create `package.json` and `.env` template.
3. **Core Sync Logic:** Write the TS script to read one tab (`body_metrics`) and handle the bidirectional merge.
4. **Full Implementation:** Expand to all 6 tabs.
5. **Automation:** Add `npm run sync` to the project.

## 6. Conflict Resolution Policy (Refined)
- **Rule 1: Additive-Only Sync.** To prevent data loss, the script will primarily focus on *adding* missing rows to both sides.
- **Rule 2: Conflict.** If a row with the same fingerprint exists on both sides but has different data, the **Cloud (Google Sheets)** version will be treated as the more recent update (Mobile-first entry).
- **Rule 3: Deletions.** Deletions will NOT be synchronized automatically. This is a safety measure for medical data.

---
## Questions for Approval
1. Does this TypeScript-based bidirectional approach align with your expectations?
