# HealthVault Task Tracking

This file tracks the granular tasks and bugs encountered during the development of HealthVault.

## 🟢 Phase 1: Foundation (Complete)
- [x] Initial directory structure created.
- [x] Baseline historical data migrated to CSVs.
- [x] AI Role definitions established (`GEMINI.md`).
- [x] Project roadmap drafted.

## 🟡 Phase 2: Google Sheets Integration (Next)
- [ ] Research Google Sheets API authentication (Service Account vs OAuth).
- [ ] Create Python script boilerplate for Sheets-to-CSV sync.
- [ ] Design "Conflict Resolution" logic (what happens if local and cloud differ?).
- [ ] Implement automatic sync on script run.

## ⚪ Phase 3: Structural Intelligence (Planned)
- [ ] Define SQLite schema for metrics normalization.
- [ ] Implement PDF text extraction for `studies/` folder.

## ⚪ Phase 4: Proactive Analytics (Planned)
- [ ] Create "Injury Correlation" prompt template.
- [ ] Develop basic dashboard/reporting script.

## 📝 Ongoing Notes & Obstacles
- *2026-06-09:* User reported a high-severity Rectus Femoris injury. Need to ensure Phase 2 includes a way to log pain levels/recovery progress easily.
