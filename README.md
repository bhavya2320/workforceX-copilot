# Workforce Copilot — AI Workforce Capacity & Hiring Optimization Engine

> **Product Name:** Workforce Copilot  
> **Sub-title:** Intelligent HR workforce-planning platform that helps HR leaders determine capacity, identify skill gaps, and decide whether to **HIRE, RESKILL, or REDISTRIBUTE** employees.

---

## 📌 Executive Summary & Problem

Companies frequently make high-stakes hiring decisions based on manager gut-feel rather than workload telemetry. When a project is announced or an employee resigns, hiring requisitions are raised without cross-checking organization-wide capacity. The consequence: some teams become overloaded while others hold unutilized capacity, and external hires arrive too late because shortages were not predicted early enough.

**Headcount ≠ Capacity.** True delivery capacity depends on skills, proficiency, planned leave, existing project commitments, working hours, and individual productivity.

**Workforce Copilot** analyzes real employee workloads, planned leaves, and upcoming project skill requirements over a rolling 6-month horizon. It provides an explainable decision engine that evaluates:
1. **HIRE:** Number of external specialists, recruiting cost, 45-day lead times, and recruitment start deadlines.
2. **RESKILL:** Internal developers with adjacent skills and spare capacity who can be upskilled in 6 weeks at 85% lower cost.
3. **REDISTRIBUTE:** Under-utilized employees (<60% utilization) who can be immediately reallocated at ₹0 cost.

---

## 🚀 Key Features

### 1. Enterprise SaaS Dashboard
- **Top KPI Cards:** Total Employees (120), Utilization (82%), Active/Pipeline Projects (16), Projected Hiring Need (6), Critical Skill Gaps (4), Under-utilized Staff (14).
- **Capacity vs Demand Chart:** 6-month monthly curve comparing Available Capacity vs Project Demand vs Pipeline Forecast with shortage highlight.
- **Skill Gap Heatmap:** Next 6 months across 8 core tracks (Python, ML, Data Analysis, DevOps, Cloud, UI/UX, Product Management, QA) with visual statuses: *Surplus*, *Balanced*, *Moderate Gap*, *Critical Gap*.
- **Team Workload Breakdown:** Real-time utilization % and status badges for 10 functional teams.
- **Top Skill Deficits & Root Causes:** Pinpoints affected projects and dates when shortages begin.

### 2. Live Capacity & Workload Engine
- Real deterministic calculations:
  $$\text{Available Hours} = \text{Monthly Hours} - \text{Leave Hours} - \text{Allocated Project Hours}$$
  $$\text{Effective Capacity} = \text{Available Hours} \times \text{Productivity Factor (0.85x – 1.15x)}$$
  $$\text{Utilization} = \frac{\text{Allocated Hours}}{\text{Working Hours} - \text{Leave Hours}} \times 100$$
- Configurable thresholds:
  - `< 60%`: Under-utilized (Prime candidate for redistribution)
  - `60% – 85%`: Healthy Operational Band
  - `85% – 100%`: High Saturation Band
  - `> 100%`: Overloaded (Burnout risk)

### 3. Explainable Hire / Reskill / Redistribute Engine
- For every detected gap, algorithmically compares all 3 strategies with cost, turnaround time, feasibility score, and employee candidate matches.
- Transparent explainability breakdown detailing **WHY** a specific decision or hybrid mix is optimal.

### 4. Interactive Scenario Simulator (Hackathon WOW Demo)
- Dedicated "Workforce Scenario Simulator" supporting:
  - **Win New Projects** (e.g. Win 3 projects with +2,400 hours)
  - **Client Churn / Project Cancellations**
  - **Unexpected Attrition** (e.g. departure of 6 senior engineers)
  - **Peak Holiday Leave** (+25% leave)
  - **Reduced Productivity** (-15% tech debt velocity drop)
  - **Custom Scenarios** with interactive sliders for projects, hours, and skill tracks
- **Dynamically modifies calculations**: Outputs additional demand (+2,400h), new utilization surge, critical shortage months, recommended hire count (4), reskill count (2), and redistribution count (3) with exact hiring deadlines.

### 5. Workforce Copilot AI Assistant
- Slide-over contextual copilot available from any screen.
- Answers complex workforce queries using live calculated database metrics:
  - *"What happens if we win 3 new projects next month?"*
  - *"Can we avoid hiring?"*
  - *"Which teams are overloaded?"*
  - *"Which employees can be redistributed?"*
  - *"Which skills are currently missing?"*
  - *"When should we start hiring?"*
  - *"Can we solve the Python shortage through reskilling?"*
- 100% functional offline without mandatory external API keys.

### 6. Workforce Planning Reports
- Formal audit report with Executive Summary, Capacity Forecast, Critical Deficits, and Scenario Stress Tests.
- Clean printable PDF styling (`Ctrl+P` / `Print`) and one-click **Export to CSV**.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Recharts |
| **Backend** | Python 3.14 / 3.10+, FastAPI, Uvicorn, Pydantic v2 |
| **Calculation Engine** | Deterministic NumPy/Pandas compatible Python analytics |
| **Simulated Data** | 120 employees, 20+ skills, 10 teams, 16 projects, 6-month monthly forecast |

---

## 📂 Project Structure

```
workforce-copilot/
├── backend/
│   ├── app/
│   │   ├── config.py                 # Thresholds, benchmark costs, lead times
│   │   ├── main.py                   # FastAPI app entry point & CORS
│   │   ├── data/
│   │   │   └── seed_data.py          # 120 employees, 20+ skills, 16 projects generator
│   │   ├── models/
│   │   │   └── schemas.py            # Pydantic schemas (Employee, Project, Scenario, etc.)
│   │   ├── routes/
│   │   │   └── api.py                # All REST endpoints
│   │   └── services/
│   │       ├── capacity_engine.py    # Available hours, productivity factor, utilization
│   │       ├── demand_forecast.py    # 6-month skill demand aggregation & trends
│   │       ├── gap_analysis.py       # Shortage vs surplus, heatmaps, explainable causes
│   │       ├── recommendation_engine.py # Hire vs Reskill vs Redistribute comparison
│   │       ├── scenario_engine.py    # Dynamic what-if simulation engine
│   │       └── copilot_service.py    # Contextual conversational AI assistant
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Top header with cycle info, reset & Copilot trigger
│   │   │   ├── Sidebar.jsx           # Section navigation with status badges
│   │   │   ├── WorkforceCopilotDrawer.jsx # Slide-over AI Assistant
│   │   │   ├── EmployeeDetailModal.jsx    # Complete staff profile modal
│   │   │   └── ProjectDetailModal.jsx     # Project requirements & risk modal
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx     # KPIs, Capacity vs Demand, Heatmap, Teams
│   │   │   ├── EmployeesPage.jsx     # Filterable staff directory
│   │   │   ├── ProjectsPage.jsx      # Portfolio management & capacity risks
│   │   │   ├── WorkloadCapacityPage.jsx # Formula view, overloaded & under-utilized staff
│   │   │   ├── SkillsMatrixPage.jsx  # Supply vs Demand & shortage dates
│   │   │   ├── LeaveAvailabilityPage.jsx # Absence tracker & capacity deduction
│   │   │   ├── ScenarioSimulatorPage.jsx # Interactive what-if simulation (WOW DEMO)
│   │   │   ├── RecommendationsPage.jsx   # Detailed Hire/Reskill/Redistribute matrix
│   │   │   └── ReportsPage.jsx       # Planning report with Print & CSV export
│   │   ├── services/
│   │   │   └── api.js                # API client
│   │   ├── App.jsx                   # Main routing & state container
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## ⚡ Quick Start & Run Instructions

### 1. Prerequisites
- **Python 3.10+** (FastAPI, uvicorn, pydantic)
- **Node.js v18+** & **npm**

### 2. Start the Backend Server (Port 8000)
Open a terminal in the project root:
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs will be live at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

### 3. Start the Frontend Application (Port 3000)
Open a second terminal in the project root:
```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 3000
```
- Open your browser at: **[http://localhost:3000](http://localhost:3000)**

---

## 🎯 Hackathon Demonstration Flow (Judge Walkthrough)

Follow this 8-step script to showcase the power of Workforce Copilot:

### Step 1: Open the Dashboard
- Note the top KPI Cards: **120 Employees**, **82% Utilization**, **16 Projects**, **4 Critical Skill Gaps**, **6 Projected Hires**.
- Point out the **Alerts Bar** highlighting urgent capacity risks.

### Step 2: Inspect Capacity vs Demand Chart
- Observe the monthly curves across **Oct 2026 to Mar 2027**.
- Point out how project demand surges in **January–February 2027**, crossing workforce capacity thresholds.

### Step 3: Examine the Skill Gap Heatmap
- Look at the rows: *Python, Machine Learning, Data Analysis, DevOps, Cloud (AWS/Azure), UI/UX, Product Management, QA*.
- Show how Machine Learning and Python transition from *Moderate Gap* to *Critical Gap* in Q1.

### Step 4: Review AI Recommendations
- Click **AI Recommendations** in the sidebar.
- Expand the **Machine Learning** card.
- Show the 3 compared strategies:
  - **Hire:** 2 Senior ML Specialists (₹48L–₹60L cost, 45-day lead time).
  - **Reskill:** 2 adjacent Python engineers (6 weeks, ₹2.5L investment).
  - **Redistribute:** 3 under-utilized staff (₹0 direct cost).
- Explain why the engine suggests a **HYBRID** approach to guarantee project SLAs while saving budget.

### Step 5: Open the Scenario Simulator (The WOW Feature)
- Click **Scenario Simulator** (highlighted with the `WOW DEMO` badge).
- Select preset: **"Win 3 New Projects"** (+2,400 hours).
- Note the interactive sliders for project count, effort hours, and target skills.

### Step 6: Click "RUN SIMULATION"
- Watch the system recalculate the organization's capacity:
  - Total Demand increases by **+2,400 hours**.
  - Organization utilization surges from **81.8% to 104% (Overload)**.
  - Recommended Plan: **Hire 4 specialists**, **Reskill 2 developers**, **Redistribute 3 staff members**.
  - Hiring budget impact: **₹48L – ₹72L**.
  - Critical hiring deadline: **November 15, 2026** (to allow 45-day recruitment cycle before Q1 kickoff).

### Step 7: Engage Workforce Copilot
- Click the **Workforce Copilot** button in the top navbar or select the prompt chip:
  - *"Can we avoid hiring?"*
- Observe how Copilot performs mathematical analysis:
  - *"Internal redistribution can cover ~950 hrs/month, reskilling covers ~240 hrs/month, leaving an unavoidable deficit of ~380 hrs in ML and DevOps. Therefore, external hiring can be reduced from 6 to 3, saving ₹36 Lakhs."*

### Step 8: View Planning Reports & Export
- Navigate to **Planning Reports**.
- View the executive audit document and click **Export CSV** or **Print / Save PDF**.

---

## 🔗 Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Main dashboard payload (KPIs, timeline, heatmap, teams, alerts) |
| `GET` | `/api/employees` | Filterable employee directory (`team`, `role`, `skill`, `utilization_status`, `search`) |
| `GET` | `/api/employees/{id}` | Detailed employee profile with skills, workload, and optimization suitability |
| `GET` | `/api/projects` | List of projects with status, effort hours, and capacity risks |
| `GET` | `/api/projects/{id}` | Detailed project view with assigned staff and skill deficits |
| `GET` | `/api/capacity` | Real-time capacity breakdown, overloaded and under-utilized cohorts |
| `GET` | `/api/skill-gaps` | 20+ skill supply vs demand matrix, monthly trends, and shortage dates |
| `GET` | `/api/recommendations`| Explainable Hire vs Reskill vs Redistribute decision matrix |
| `POST`| `/api/scenario` | Live what-if workforce scenario simulator |
| `POST`| `/api/copilot/chat` | Contextual conversational AI assistant endpoint |
| `GET` | `/api/reports` | Comprehensive workforce audit report |
| `POST`| `/api/reset` | Resets dataset back to default benchmark values |

---

## 🏆 Hackathon Compliance Checklist

- [x] **End-to-End Working System:** Both frontend and backend fully integrated and running live.
- [x] **Realistic Simulated Data:** 120 employees, 20+ skills, 10 teams, 16 projects, leave records, and productivity scores.
- [x] **Real Mathematical Engines:** Calculated available hours, effective capacity, and utilization thresholds.
- [x] **Explainable Recommendation Engine:** Complete Hire vs Reskill vs Redistribute comparison with candidate names, budgets, and timelines.
- [x] **Scenario Simulator:** Live recalculation of +2,400 hours project win with deadline and candidate outputs.
- [x] **Workforce Copilot:** Natural language assistant answering questions using actual calculated workforce data.
- [x] **Zero External API Dependency:** 100% offline functionality ensures zero demonstration failures.
- [x] **Enterprise SaaS Design:** Modern, clean UI built with Tailwind CSS, Recharts, and Lucide icons.
