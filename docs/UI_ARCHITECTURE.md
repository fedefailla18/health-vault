# HealthVault UI Architecture & Engineering Guide

## 1. Overview
HealthVault UI is a modern, high-performance, Local-First web application built to visualize, analyze, and record longitudinal health records, training progress, injuries, and biomarkers.

## 2. Core Principles
1. **Local-First & Zero-Cloud Dependency:** All data remains strictly in local files (`data/*.csv` and `studies/`).
2. **Deterministic File Sync:** The Vite development server provides a built-in REST API middleware that directly reads and writes to disk.
3. **Longitudinal Analysis:** Emphasizes multi-year trend analysis (weight trajectory, biomarker history, strength PRs, and injury recovery).
4. **Non-Destructive Ingestion:** Data updates preserve CSV formatting, column order, and metadata.

## 3. Technology Stack
- **Framework:** React 18 + TypeScript + Vite 5
- **Styling:** Tailwind CSS + Lucide Icons
- **Visualization:** Recharts (Interactive SVG charting for biomarkers, body weight, and strength curves)
- **State & Data Engine:** Client-side CSV parser/serializer with optimistic local state and real-time disk persistence via Vite middleware
- **Port:** `3002` (orchestrated via `./wp run health-vault`)

## 4. Component Structure
- `src/components/Header.tsx`: System status, quick actions, active user profile.
- `src/components/Navigation.tsx`: Navigation bar between health modules.
- `src/components/DashboardOverview.tsx`: Consolidated health cockpit (vitals, active injuries, recent workouts, biomarker alerts).
- `src/components/BiomarkersView.tsx`: Chronological lab results, visual reference ranges, trend charts, and test logger.
- `src/components/InjuriesView.tsx`: Injury history, severity badges, active monitoring, recovery milestones.
- `src/components/TrainingView.tsx`: Exercise breakdown, weekly volume, strength progression charts (Squats, Presses, Rows, etc.).
- `src/components/BodyMetricsView.tsx`: Weight and body composition longitudinal charts.
- `src/components/MedicationsView.tsx`: Active prescriptions, supplement regimen, and dosage tracking.
- `src/components/StudiesView.tsx`: Medical imaging and laboratory PDF document explorer.
- `src/components/Modal.tsx`: Reusable accessible modal dialog for record creation.

## 5. API Middleware Contract
- `GET /api/data`: Returns aggregated JSON parsed from all `data/*.csv` files.
- `POST /api/save`: Persists updated CSV or Markdown content safely to `data/` or `studies/`.
- `GET /api/studies`: Lists all indexed PDF/image studies in `studies/MRI`, `studies/Bloodwork`, `studies/Reports`.
