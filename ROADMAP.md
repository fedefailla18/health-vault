# HealthVault Roadmap & Long-Term Plan

This document outlines the strategic evolution of the HealthVault system from a static repository to a proactive personal health intelligence hub.

## Phase 1: Foundation (Current)
*   **Structure:** Establish repository, folders, and historical baseline.
*   **Roles:** Define the Architect (Tech) and Librarian (Secretary) personas.
*   **Data:** Extract history from master documents into structured CSVs.

## Phase 2: Local-First Web Dashboard & Active Ingestion (Current)
*   **React Dashboard:** Interactive web UI (Vite + React + Tailwind + Recharts) on port 3002.
*   **Biomarker Trends & Analytics:** Dynamic charting for lab results, reference range indicators, and history.
*   **Injury & Recovery Tracker:** Visual timeline of injuries, severity tagging, and recovery notes.
*   **Strength & Training Progression:** 1RM estimation, volume logging, and workout frequency breakdowns.
*   **Bidirectional File Persistence:** Vite REST API middleware reading and writing directly to `data/*.csv`.
*   **Study Document Explorer:** Visual catalog for `studies/MRI`, `studies/Bloodwork`, and `studies/Reports`.
*   **Workspace Integration:** Unified runner integration (`./wp run health-vault`).

## Phase 3: Structural Intelligence (Month 3)
*   **Persistence:** Transition CSVs to a SQLite database for complex querying.
*   **RAG (Retrieval-Augmented Generation):** Index reports and medical literature for context-aware health advice.
*   **Local LLM:** Experiment with Ollama/Local models for maximum privacy.

## Phase 4: Proactive Analytics (Month 4+)
*   **Pattern Recognition:** Correlate exercise intensity (training_log) with injury flares (injuries.csv).
*   **Biomarker Trends:** Visualize lab results over time.
*   **Reporting:** Automated monthly health/performance summaries.

---
*Last Updated: June 9, 2026*
