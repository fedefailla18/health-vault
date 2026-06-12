# HealthVault

A personal longitudinal health intelligence system designed to track medical history, training, injuries, and biomarkers over years.

## 📂 Project Navigation
- **[initialize.md](./initialize.md)**: The foundational kickoff document (Documento Maestro).
- **[ROADMAP.md](./ROADMAP.md)**: High-level strategic phases (The "Why" and "When").
- **[TASKS.md](./TASKS.md)**: Granular implementation status and current backlog (The "What" and "How").
- **[GEMINI.md](./GEMINI.md)**: AI Persona definitions and operational mandates (The "Who").
- **[data/](./data/)**: The structured source of truth (CSVs).
- **[studies/](./studies/)**: Raw medical evidence (MRI, Bloodwork, Reports).

## 🤖 AI Personas
This project is powered by two specialized agents:
1. **The Architect (Tech Lead):** Handles the engineering, scripting, and system design.
2. **The Librarian (Secretary):** Handles data entry, record tracking, and historical context.

## 🚀 Quick Start for Humans
1. Place new medical PDFs in the appropriate subfolder in `studies/`.
2. Update your `data/training_log.csv` or `data/body_metrics.csv` regularly (Manual for now, Sheets-sync in Phase 2).
3. Ask the Librarian to summarize your history whenever you see a new specialist.

---
*Built with Local-First and Human-in-the-Loop principles.*
