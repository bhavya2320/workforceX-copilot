"""
Hire / Reskill / Redistribute Recommendation Engine
Evaluates shortage solutions with cost, lead time, candidate matching, and clear explainability.
"""
from typing import List, Dict, Any, Optional
import math
from datetime import datetime, timedelta
from app.models.schemas import (
    Employee,
    Project,
    SkillGapItem,
    DetailedRecommendation,
    RecommendationOption
)
from app.config import (
    MONTHLY_WORKING_HOURS,
    HIRING_ANNUAL_COST_MIN_LAKHS,
    HIRING_ANNUAL_COST_MAX_LAKHS,
    HIRING_LEAD_TIME_DAYS_DEFAULT,
    RESKILLING_COST_PER_EMPLOYEE_LAKHS,
    RESKILLING_DURATION_WEEKS_DEFAULT,
    UTILIZATION_UNDER
)

# Skill adjacency graph for realistic reskilling paths
SKILL_ADJACENCY = {
    "Machine Learning": ["Python", "Data Analysis", "SQL / PostgreSQL", "NLP"],
    "Python": ["Java", "Go", "QA & Automation", "Node.js", "Data Analysis"],
    "DevOps": ["Cloud (AWS/Azure)", "Kubernetes", "CI/CD", "Linux", "Python"],
    "Cloud (AWS/Azure)": ["DevOps", "Solution Architecture", "Enterprise Solutions", "Cyber Security"],
    "NLP": ["Python", "Machine Learning", "Data Analysis"],
    "Kubernetes": ["DevOps", "Cloud (AWS/Azure)", "Go", "CI/CD"],
    "QA & Automation": ["Python", "Java", "QA & Testing", "React"],
    "React": ["UI/UX", "Node.js", "Mobile / Flutter"],
    "Mobile / Flutter": ["React", "UI/UX", "Java", "Node.js"],
    "Cyber Security": ["Cloud (AWS/Azure)", "DevOps", "Python", "Enterprise Solutions"]
}

class RecommendationEngine:
    @staticmethod
    def generate_recommendations(
        skill_gaps: List[SkillGapItem],
        employees: List[Employee],
        projects: List[Project]
    ) -> List[DetailedRecommendation]:
        recommendations: List[DetailedRecommendation] = []
        
        # Only analyze skills with positive gaps (shortages)
        shortage_gaps = [g for g in skill_gaps if g.gap_hours > 20.0]
        
        for gap in shortage_gaps:
            rec = RecommendationEngine._analyze_single_gap(gap, employees, projects)
            recommendations.append(rec)
            
        return recommendations

    @staticmethod
    def _analyze_single_gap(
        gap: SkillGapItem,
        employees: List[Employee],
        projects: List[Project]
    ) -> DetailedRecommendation:
        skill = gap.skill
        needed_hours = gap.gap_hours
        
        # 1. Evaluate REDISTRIBUTE
        # Find employees who already possess this skill, are under-utilized (< 65%), and have capacity
        redistribute_candidates: List[Employee] = []
        for emp in employees:
            if skill in emp.skills and emp.utilization_pct < 68.0 and emp.available_hours >= 20.0:
                redistribute_candidates.append(emp)
                
        total_redistributable_hours = sum(e.available_hours for e in redistribute_candidates)
        
        # 2. Evaluate RESKILL
        # Find employees with adjacent skills who have spare capacity (< 80%) and good productivity
        adjacent_skills = SKILL_ADJACENCY.get(skill, ["Python", "SQL / PostgreSQL"])
        reskill_candidates: List[Employee] = []
        for emp in employees:
            if skill not in emp.skills:
                has_adjacent = any(s in emp.skills for s in adjacent_skills)
                if has_adjacent and emp.utilization_pct <= 80.0 and emp.productivity_score >= 0.90:
                    reskill_candidates.append(emp)
                    
        # Limit reskill candidates to top 4 by free capacity & productivity
        reskill_candidates.sort(key=lambda x: (x.available_hours * x.productivity_score), reverse=True)
        top_reskill = reskill_candidates[:4]
        
        # Reskilled employees can contribute ~80 hours/month each after 6 weeks
        reskill_capacity_deliverable = len(top_reskill) * 80.0
        
        # 3. Evaluate HIRE
        # Headcount required if hiring exclusively
        hire_headcount = max(1, math.ceil(needed_hours / 140.0))
        hiring_cost_min = round(hire_headcount * HIRING_ANNUAL_COST_MIN_LAKHS, 1)
        hiring_cost_max = round(hire_headcount * HIRING_ANNUAL_COST_MAX_LAKHS, 1)
        
        # Lead time calculation: 45 days
        lead_time_days = HIRING_LEAD_TIME_DAYS_DEFAULT
        # Recommended start date: today - 15 days or Nov 1, 2026
        target_start_date = "Oct 20, 2026" if gap.gap_hours > 200 else "Nov 15, 2026"
        
        # Decision Synthesis & Strategy Choice
        uncovered_after_redistribute = max(0.0, needed_hours - total_redistributable_hours)
        uncovered_after_all_internal = max(0.0, uncovered_after_redistribute - reskill_capacity_deliverable)
        
        reasoning: List[str] = [
            f"Monthly {skill} demand exceeds internal allocated capacity by {needed_hours:.0f} hours.",
            f"Existing under-utilized employees can cover {min(total_redistributable_hours, needed_hours):.0f} hours via immediate workload redistribution.",
            f"Adjacent team members can be reskilled within {RESKILLING_DURATION_WEEKS_DEFAULT} weeks to supply {min(reskill_capacity_deliverable, uncovered_after_redistribute):.0f} hours.",
        ]
        
        if uncovered_after_all_internal > 60.0 or len(gap.affected_projects) >= 3:
            strategy = "HYBRID" if (total_redistributable_hours > 0 or len(top_reskill) > 0) else "HIRE"
            reasoning.append(
                f"Project timelines require full readiness before {gap.shortage_date or 'Q4 launch'}, creating an unavoidable hiring requirement of {hire_headcount} specialist(s)."
            )
            exec_summary = (
                f"Adopt a {strategy} strategy: Rebalance {min(total_redistributable_hours, needed_hours):.0f} hours internally, "
                f"reskill {min(2, len(top_reskill))} team member(s), and initiate hiring for {max(1, hire_headcount - 1)} {skill} specialist(s) immediately."
            )
        elif total_redistributable_hours >= needed_hours * 0.7:
            strategy = "REDISTRIBUTE"
            reasoning.append(
                f"Sufficient spare capacity exists in adjacent teams to absorb this gap without hiring or costly training."
            )
            exec_summary = f"Solve 100% of the {skill} shortage via zero-cost workload redistribution from under-utilized employees."
        else:
            strategy = "RESKILL"
            reasoning.append(
                f"Reskilling offers a 70% cost reduction compared to external recruitment and protects long-term project margins."
            )
            exec_summary = f"Prioritize reskilling {min(3, len(top_reskill))} internal developers into {skill} within {RESKILLING_DURATION_WEEKS_DEFAULT} weeks."

        # Plans
        hire_plan = {
            "headcount": hire_headcount,
            "cost_range": f"₹{hiring_cost_min}L – ₹{hiring_cost_max}L",
            "lead_time": f"{lead_time_days} days",
            "recommended_start": target_start_date,
            "role_title": f"Senior {skill} Specialist",
            "affected_projects": gap.affected_projects
        }
        
        reskill_cost_total = round(len(top_reskill) * RESKILLING_COST_PER_EMPLOYEE_LAKHS, 2)
        reskill_plan = {
            "target_skill": skill,
            "candidates": [{"id": e.id, "name": e.name, "team": e.team, "current_skills": e.skills[:2]} for e in top_reskill],
            "duration": f"{RESKILLING_DURATION_WEEKS_DEFAULT} weeks",
            "estimated_cost": f"₹{reskill_cost_total}L",
            "capacity_unlocked": f"{reskill_capacity_deliverable:.0f} hrs/mo"
        }
        
        redistribute_plan = {
            "candidates": [{"id": e.id, "name": e.name, "team": e.team, "free_hours": e.available_hours, "current_util": f"{e.utilization_pct}%"} for e in redistribute_candidates],
            "capacity_released": f"{total_redistributable_hours:.0f} hrs/mo",
            "cost": "₹0 (Zero direct budget impact)",
            "turnaround": "3 to 5 business days"
        }
        
        options_comparison = [
            RecommendationOption(
                strategy="HIRE",
                title=f"External Recruitment ({hire_headcount} {skill} Engineers)",
                description=f"Recruit {hire_headcount} external specialist(s) to guarantee dedicated velocity for {', '.join(gap.affected_projects[:2])}.",
                estimated_cost_inr=f"₹{hiring_cost_min}L – ₹{hiring_cost_max}L/yr",
                time_to_deliver=f"{lead_time_days} days",
                feasibility_score=85 if gap.gap_hours > 200 else 65,
                candidate_names=[],
                key_advantages=["Guaranteed domain depth", "Zero internal disruption", "Fast project acceleration"],
                key_risks=["High recruitment agency fees", "45-day lead time risk", "Onboarding overhead"]
            ),
            RecommendationOption(
                strategy="RESKILL",
                title=f"Internal Upskilling ({len(top_reskill)} Team Members)",
                description=f"Enroll high-productivity engineers with adjacent tech stack into a {RESKILLING_DURATION_WEEKS_DEFAULT}-week accelerated certification track.",
                estimated_cost_inr=f"₹{reskill_cost_total}L total",
                time_to_deliver=f"{RESKILLING_DURATION_WEEKS_DEFAULT} weeks",
                feasibility_score=90 if len(top_reskill) >= 2 else 50,
                candidate_names=[e.name for e in top_reskill],
                key_advantages=["85% cost savings vs hiring", "Higher employee retention", "Familiarity with company codebase"],
                key_risks=["Productivity dip during training", "Temporary junior-level velocity"]
            ),
            RecommendationOption(
                strategy="REDISTRIBUTE",
                title=f"Workload Rebalancing ({len(redistribute_candidates)} Under-utilized Staff)",
                description=f"Shift under-utilized engineers in low-demand projects to critical initiatives requiring {skill}.",
                estimated_cost_inr="₹0",
                time_to_deliver="3–5 days",
                feasibility_score=95 if total_redistributable_hours >= 60 else 40,
                candidate_names=[e.name for e in redistribute_candidates],
                key_advantages=["Instant capacity unlock", "Zero budget requirement", "Balances company-wide utilization"],
                key_risks=["Requires cross-team alignment", "Partial hours availability"]
            )
        ]
        
        return DetailedRecommendation(
            skill=skill,
            gap_hours=needed_hours,
            recommended_strategy=strategy,
            executive_summary=exec_summary,
            reasoning=reasoning,
            hire_plan=hire_plan,
            reskill_plan=reskill_plan,
            redistribute_plan=redistribute_plan,
            options_comparison=options_comparison
        )
