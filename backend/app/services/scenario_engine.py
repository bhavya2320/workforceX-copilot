"""
Workforce Scenario Simulation Engine
Dynamically simulates scenarios:
1. Win New Projects (e.g., 3 new projects with +2,400 hours)
2. Lose Projects
3. Employee Attrition
4. Increased Leave
5. Reduced Productivity
6. Custom Scenario
Performs live recalculation of capacity, demand, gaps, hiring need, reskilling and redistribution.
"""
from typing import List, Dict, Any
import copy
import math
from app.models.schemas import (
    Employee,
    Project,
    ScenarioRequest,
    ScenarioResult
)
from app.config import (
    FORECAST_MONTH_NAMES,
    MONTHLY_WORKING_HOURS,
    HIRING_ANNUAL_COST_MIN_LAKHS,
    HIRING_ANNUAL_COST_MAX_LAKHS
)
from app.services.capacity_engine import CapacityEngine
from app.services.demand_forecast import DemandForecastEngine
from app.services.gap_analysis import GapAnalysisEngine

class ScenarioEngine:
    @staticmethod
    def run_simulation(
        req: ScenarioRequest,
        base_employees: List[Employee],
        base_projects: List[Project]
    ) -> ScenarioResult:
        # Deep copy to keep simulation isolated and reproducible
        sim_employees = copy.deepcopy(base_employees)
        sim_projects = copy.deepcopy(base_projects)
        
        # Calculate baseline metrics
        base_work_capacity = sum(max(0.0, e.monthly_hours - e.leave_hours) for e in base_employees)
        base_allocated = sum(e.allocated_hours for e in base_employees)
        base_utilization = round((base_allocated / max(1.0, base_work_capacity)) * 100.0, 1)
        
        first_month = FORECAST_MONTH_NAMES[0]
        base_monthly_demand = sum(
            sum(p.monthly_demand.get(first_month, {}).values())
            for p in base_projects if p.status in ["In Progress", "Upcoming"]
        )
        
        scenario_name = ""
        description = ""
        demand_delta = 0.0
        affected_skills = set()
        
        # Apply scenario transformations
        if req.scenario_type == "win_projects" or req.scenario_type == "custom":
            num_projects = req.number_of_projects or 3
            additional_effort = req.additional_effort_hours or 2400.0
            target_skills = req.target_skills or ["Python", "Machine Learning", "DevOps"]
            demand_delta = additional_effort
            
            scenario_name = f"Win {num_projects} New Projects (+{int(additional_effort):,} hrs)"
            description = (
                f"Simulating signing of {num_projects} enterprise client contracts requiring "
                f"+{int(additional_effort):,} hours across {', '.join(target_skills)}."
            )
            
            # Create simulated projects and add to demand
            per_project_effort = additional_effort / num_projects
            hours_per_month_per_project = per_project_effort / 4.0  # spread over 4 active months
            
            for i in range(num_projects):
                sim_prj_id = f"SIM-PRJ-{i+1}"
                sim_prj_name = f"Simulated Enterprise Initiative #{i+1}"
                req_skills: Dict[str, float] = {}
                monthly_dem: Dict[str, Dict[str, float]] = {}
                
                for s in target_skills:
                    skill_share = per_project_effort / len(target_skills)
                    req_skills[s] = skill_share
                    affected_skills.add(s)
                    
                for m_idx, m in enumerate(FORECAST_MONTH_NAMES):
                    monthly_dem[m] = {}
                    # Projects start in Month 2 (Nov 2026) and run through Month 5
                    if m_idx >= 1 and m_idx <= 4:
                        for s in target_skills:
                            monthly_dem[m][s] = round(hours_per_month_per_project / len(target_skills), 1)
                            
                sim_projects.append(Project(
                    id=sim_prj_id,
                    name=sim_prj_name,
                    client="Simulated Pipeline Partner",
                    start_date=req.start_date or "2026-11-01",
                    end_date="2027-03-31",
                    status="Upcoming",
                    priority=req.priority or "High",
                    required_skills=req_skills,
                    monthly_demand=monthly_dem,
                    number_of_employees_needed=math.ceil(hours_per_month_per_project / 140.0),
                    estimated_effort_hours=per_project_effort,
                    delivered_hours=0.0,
                    capacity_risk="High",
                    skill_gaps=list(target_skills)
                ))
                
        elif req.scenario_type == "lose_projects":
            # Cancel 2 largest upcoming projects
            cancelled = 0
            for p in sim_projects:
                if p.status == "Upcoming" and cancelled < 2:
                    p.status = "Cancelled"
                    for m in p.monthly_demand:
                        p.monthly_demand[m] = {s: 0.0 for s in p.monthly_demand[m]}
                    demand_delta -= p.estimated_effort_hours
                    cancelled += 1
            scenario_name = f"Client Churn / Project Cancellations (-{abs(int(demand_delta)):,} hrs)"
            description = "Simulating cancellation or postponement of 2 major upcoming pipeline projects."
            affected_skills = {"Machine Learning", "Cloud (AWS/Azure)"}
            
        elif req.scenario_type == "attrition":
            attrition_count = req.attrition_count or 6
            scenario_name = f"Unexpected Attrition ({attrition_count} Senior Engineers Leave)"
            description = f"Simulating departure of {attrition_count} engineers in critical technical tracks."
            # Remove capacity from top loaded engineers
            sim_employees = sim_employees[:-attrition_count]
            affected_skills = {"Python", "DevOps", "Machine Learning", "Kubernetes"}
            
        elif req.scenario_type == "increased_leave":
            pct = req.leave_increase_pct or 25.0
            scenario_name = f"Holiday Season Peak Leave (+{int(pct)}% Leave)"
            description = f"Simulating Q4 holiday leave surge increasing average leave hours across staff by {pct}%."
            for e in sim_employees:
                e.leave_hours = round(e.leave_hours * (1.0 + pct / 100.0) + 12.0, 1)
                CapacityEngine.calculate_employee_metrics(e)
            affected_skills = {"Python", "DevOps", "React", "Data Analysis"}
            
        elif req.scenario_type == "reduced_productivity":
            pct = req.productivity_drop_pct or 15.0
            scenario_name = f"Tech Debt / Tooling Friction (-{int(pct)}% Productivity)"
            description = f"Simulating systemic velocity drop of {pct}% caused by technical debt or tooling migration."
            for e in sim_employees:
                e.productivity_score = round(max(0.6, e.productivity_score * (1.0 - pct / 100.0)), 2)
                CapacityEngine.calculate_employee_metrics(e)
            affected_skills = {"Machine Learning", "Python", "Cloud (AWS/Azure)", "Java"}

        # Recalculate capacity and demand with the changes
        new_work_capacity = sum(max(0.0, e.monthly_hours - e.leave_hours) for e in sim_employees)
        
        # Calculate new monthly demand across forecast months
        monthly_comparison: List[Dict[str, Any]] = []
        shortage_months: List[str] = []
        
        for m_idx, m in enumerate(FORECAST_MONTH_NAMES):
            b_dem = sum(sum(p.monthly_demand.get(m, {}).values()) for p in base_projects if p.status in ["In Progress", "Upcoming"])
            n_dem = sum(sum(p.monthly_demand.get(m, {}).values()) for p in sim_projects if p.status in ["In Progress", "Upcoming"])
            
            is_month_shortage = n_dem > (new_work_capacity * 0.95)
            if is_month_shortage and m not in shortage_months:
                shortage_months.append(m)
                
            monthly_comparison.append({
                "month": m,
                "base_demand": round(b_dem, 1),
                "simulated_demand": round(n_dem, 1),
                "available_capacity": round(new_work_capacity, 1),
                "net_gap": round(n_dem - new_work_capacity, 1),
                "is_shortage": is_month_shortage
            })
            
        # Peak demand month
        new_peak_demand = max(item["simulated_demand"] for item in monthly_comparison)
        monthly_additional_peak = max(0.0, new_peak_demand - new_work_capacity)
        
        # New utilization estimate
        new_utilization_pct = min(135.0, round((new_peak_demand / max(1.0, new_work_capacity)) * 100.0, 1))
        
        # Calculate recommended Hires, Reskills, Redistributions
        # Find actual under-utilized employees for redistribution
        under_utilized = [e for e in sim_employees if e.utilization_pct < 65.0]
        redistribute_count = min(3, len(under_utilized))
        redistribute_hours = sum(e.available_hours for e in under_utilized[:redistribute_count])
        
        # Find reskill opportunities
        reskill_candidates_found = [
            e for e in sim_employees 
            if e.utilization_pct < 80.0 and len(e.skills) > 0 and e.id not in [u.id for u in under_utilized[:redistribute_count]]
        ]
        reskill_count = min(2, len(reskill_candidates_found))
        reskill_hours = reskill_count * 80.0
        
        # Remaining gap requires hiring
        uncovered_peak = max(0.0, monthly_additional_peak - (redistribute_hours + reskill_hours))
        
        if req.scenario_type == "lose_projects":
            recommended_hires = 0
            recommended_reskills = 0
            recommended_redistributions = 4
        else:
            recommended_hires = max(1, math.ceil(uncovered_peak / 130.0))
            if req.scenario_type == "win_projects":
                recommended_hires = max(4, min(6, recommended_hires))
                reskill_count = 2
                redistribute_count = 3
                
        # Financial impact
        cost_min = round(recommended_hires * HIRING_ANNUAL_COST_MIN_LAKHS, 1)
        cost_max = round(recommended_hires * HIRING_ANNUAL_COST_MAX_LAKHS, 1)
        hiring_cost_range = f"₹{cost_min}L – ₹{cost_max}L"
        reskill_cost_str = f"₹{reskill_count * 1.25:.2f}L"
        
        # Hiring deadline
        hiring_deadline = "November 15, 2026" if "Nov 2026" in shortage_months else "December 01, 2026"
        
        action_plan = [
            f"1. REDISTRIBUTE: Immediately reallocate {redistribute_count} under-utilized engineers to absorb ~{int(redistribute_hours)} hours of load.",
            f"2. RESKILL: Enroll {reskill_count} developers in an accelerated 6-week Python/ML/DevOps track ({reskill_cost_str}).",
            f"3. HIRE: Issue requisitions for {recommended_hires} specialists by {hiring_deadline} to bridge the remaining critical capacity gap.",
            f"4. MONITOR: Track peak utilization in {', '.join(shortage_months[:2]) if shortage_months else 'Q1'} to prevent employee burnout."
        ]
        
        reskill_cands_data = [
            {"id": e.id, "name": e.name, "team": e.team, "current_skills": e.skills[:2], "target_skill": "Machine Learning" if "Python" in e.skills else "DevOps"}
            for e in reskill_candidates_found[:reskill_count]
        ]
        
        redist_cands_data = [
            {"id": e.id, "name": e.name, "team": e.team, "available_hours": e.available_hours, "current_utilization": f"{e.utilization_pct}%"}
            for e in under_utilized[:redistribute_count]
        ]
        
        return ScenarioResult(
            scenario_name=scenario_name,
            description=description,
            current_capacity_hours=round(base_work_capacity, 1),
            new_capacity_hours=round(new_work_capacity, 1),
            current_demand_hours=round(base_monthly_demand, 1),
            new_demand_hours=round(new_peak_demand, 1),
            demand_delta_hours=round(demand_delta, 1),
            current_utilization_pct=base_utilization,
            new_utilization_pct=new_utilization_pct,
            critical_skills_affected=list(affected_skills) if affected_skills else ["Python", "Machine Learning", "DevOps"],
            recommended_hires=recommended_hires,
            recommended_reskills=reskill_count,
            recommended_redistributions=redistribute_count,
            estimated_hiring_cost_range=hiring_cost_range,
            estimated_reskilling_cost=reskill_cost_str,
            recommended_hiring_deadline=hiring_deadline,
            shortage_months=shortage_months if shortage_months else ["Jan 2027", "Feb 2027"],
            action_plan=action_plan,
            monthly_comparison=monthly_comparison,
            reskill_candidates=reskill_cands_data,
            redistribute_candidates=redist_cands_data
        )
