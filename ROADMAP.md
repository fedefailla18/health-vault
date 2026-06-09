# HealthVault Roadmap & Long-Term Plan

This document outlines the strategic evolution of the HealthVault system from a static repository to a proactive personal health intelligence hub.

## Phase 1: Foundation (Current)
*   **Structure:** Establish repository, folders, and historical baseline.
*   **Roles:** Define the Architect (Tech) and Librarian (Secretary) personas.
*   **Data:** Extract history from master documents into structured CSVs.

## Phase 2: Active Ingestion & Integration (Month 2)
*   **Google Sheets:** Connect local CSVs to Google Sheets for mobile/easy data entry.
*   **Study Indexing:** Implement a process for scanning `studies/` and extracting metadata using AI.
*   **Automation:** Basic Python scripts for data validation and normalization.

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
