"""
Pydantic Schemas for Workforce Copilot
"""
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class SkillProficiency(BaseModel):
    skill: str
    proficiency: str  # "Beginner", "Intermediate", "Advanced", "Expert"
    years_experience: float = 2.0

class Employee(BaseModel):
    id: str
    name: str
    role: str
    team: str
    skills: List[str]
    skill_details: List[SkillProficiency] = []
    weekly_hours: int = 40
    monthly_hours: int = 160
    productivity_score: float = 1.0  # 0.75 - 1.25
    current_project: Optional[str] = None
    allocated_hours: float = 130.0
    leave_hours: float = 0.0
    location: str = "Bangalore, India"
    
    # Computed metrics
    available_hours: float = 30.0
    effective_capacity: float = 30.0
    utilization_pct: float = 81.25
    utilization_status: str = "Healthy"  # Under-utilized, Healthy, High, Overloaded
    
    potential_for_redistribution: bool = False
    reskilling_candidates: List[str] = []

class Project(BaseModel):
    id: str
    name: str
    client: str
    start_date: str
    end_date: str
    status: str  # "In Progress", "Upcoming", "Planning"
    priority: str  # "Critical", "High", "Medium"
    required_skills: Dict[str, float]  # Skill name -> Total hours required
    monthly_demand: Dict[str, Dict[str, float]] = {}  # Month -> {Skill: Hours}
    assigned_employee_ids: List[str] = []
    number_of_employees_needed: int = 4
    estimated_effort_hours: float = 1200.0
    delivered_hours: float = 0.0
    capacity_risk: str = "Low"  # "Low", "Medium", "High", "Critical"
    skill_gaps: List[str] = []

class SkillGapItem(BaseModel):
    skill: str
    required_hours: float
    available_hours: float
    gap_hours: float  # required - available (> 0 means shortage)
    status: str       # "Surplus", "Balanced", "Moderate Gap", "Critical Gap"
    monthly_trend: Dict[str, float] = {}
    affected_projects: List[str] = []
    shortage_date: Optional[str] = None

class TeamUtilization(BaseModel):
    team: str
    headcount: int
    utilization_pct: float
    status: str
    total_capacity_hours: float
    total_allocated_hours: float
    gap_hours: float

class RecommendationOption(BaseModel):
    strategy: str  # "HIRE", "RESKILL", "REDISTRIBUTE"
    title: str
    description: str
    estimated_cost_inr: str
    time_to_deliver: str
    feasibility_score: int  # 0 - 100
    candidate_names: List[str] = []
    key_advantages: List[str] = []
    key_risks: List[str] = []

class DetailedRecommendation(BaseModel):
    skill: str
    gap_hours: float
    recommended_strategy: str  # "HIRE", "RESKILL", "REDISTRIBUTE", "HYBRID"
    executive_summary: str
    reasoning: List[str]
    hire_plan: Optional[Dict[str, Any]] = None
    reskill_plan: Optional[Dict[str, Any]] = None
    redistribute_plan: Optional[Dict[str, Any]] = None
    options_comparison: List[RecommendationOption] = []

class MonthlyCapacityDemand(BaseModel):
    month: str
    available_capacity: float
    project_demand: float
    forecasted_demand: float
    gap: float
    is_shortage: bool

class DashboardData(BaseModel):
    total_employees: int
    current_utilization: float
    upcoming_projects_count: int
    projected_hiring_need: int
    critical_skill_gaps_count: int
    under_utilized_count: int
    overloaded_count: int
    capacity_vs_demand: List[MonthlyCapacityDemand]
    skill_gap_heatmap: List[Dict[str, Any]]
    team_utilizations: List[TeamUtilization]
    top_skill_gaps: List[SkillGapItem]
    upcoming_projects: List[Project]
    alerts: List[Dict[str, str]]

class ScenarioRequest(BaseModel):
    scenario_type: str  # "win_projects", "lose_projects", "attrition", "increased_leave", "reduced_productivity", "custom"
    number_of_projects: Optional[int] = 3
    additional_effort_hours: Optional[float] = 2400.0
    start_date: Optional[str] = "2026-11-01"
    target_skills: Optional[List[str]] = ["Python", "Machine Learning", "DevOps"]
    attrition_count: Optional[int] = 5
    leave_increase_pct: Optional[float] = 25.0
    productivity_drop_pct: Optional[float] = 15.0
    priority: Optional[str] = "High"

class ScenarioResult(BaseModel):
    scenario_name: str
    description: str
    current_capacity_hours: float
    new_capacity_hours: float
    current_demand_hours: float
    new_demand_hours: float
    demand_delta_hours: float
    current_utilization_pct: float
    new_utilization_pct: float
    critical_skills_affected: List[str]
    recommended_hires: int
    recommended_reskills: int
    recommended_redistributions: int
    estimated_hiring_cost_range: str
    estimated_reskilling_cost: str
    recommended_hiring_deadline: str
    shortage_months: List[str]
    action_plan: List[str]
    monthly_comparison: List[Dict[str, Any]]
    reskill_candidates: List[Dict[str, Any]]
    redistribute_candidates: List[Dict[str, Any]]

class CopilotQuery(BaseModel):
    query: str
    context_filters: Optional[Dict[str, Any]] = None

class CopilotResponse(BaseModel):
    query: str
    answer: str
    key_metrics: Dict[str, Any] = {}
    suggested_actions: List[str] = []
    follow_up_questions: List[str] = []
