"""
Demand Forecasting Engine
Converts projects and pipeline into skill-based demand across 6-month horizon.
"""
from typing import List, Dict, Any
from app.models.schemas import Project, MonthlyCapacityDemand, Employee
from app.config import FORECAST_MONTH_NAMES

class DemandForecastEngine:
    @staticmethod
    def calculate_skill_demand(projects: List[Project]) -> Dict[str, float]:
        """Calculates total current monthly demand per skill"""
        demand_per_skill: Dict[str, float] = {}
        first_month = FORECAST_MONTH_NAMES[0]
        
        for p in projects:
            if p.status in ["In Progress", "Upcoming"]:
                month_reqs = p.monthly_demand.get(first_month, {})
                for skill, hours in month_reqs.items():
                    demand_per_skill[skill] = demand_per_skill.get(skill, 0.0) + hours
                    
        return {s: round(h, 1) for s, h in demand_per_skill.items()}

    @staticmethod
    def calculate_monthly_skill_matrix(projects: List[Project]) -> Dict[str, Dict[str, float]]:
        """
        Calculates demand for each skill across each of the 6 months.
        Returns: { skill: { "Oct 2026": 850.0, "Nov 2026": 920.0, ... } }
        """
        matrix: Dict[str, Dict[str, float]] = {}
        
        for m in FORECAST_MONTH_NAMES:
            for p in projects:
                if p.status in ["In Progress", "Upcoming", "Planning"]:
                    reqs = p.monthly_demand.get(m, {})
                    for skill, hours in reqs.items():
                        if skill not in matrix:
                            matrix[skill] = {month: 0.0 for month in FORECAST_MONTH_NAMES}
                        matrix[skill][m] += hours
                        
        # Round values
        for skill in matrix:
            for m in matrix[skill]:
                matrix[skill][m] = round(matrix[skill][m], 1)
                
        return matrix

    @staticmethod
    def calculate_capacity_vs_demand_timeline(
        employees: List[Employee],
        projects: List[Project]
    ) -> List[MonthlyCapacityDemand]:
        """
        Calculates monthly available capacity vs actual project demand vs forecasted demand
        with a realistic pipeline growth trend.
        """
        # Baseline total monthly working hours available from workforce
        total_monthly_work_cap = sum(max(0.0, emp.monthly_hours - emp.leave_hours) for emp in employees)
        
        results: List[MonthlyCapacityDemand] = []
        trend_multipliers = [1.0, 1.05, 1.10, 1.16, 1.20, 1.22] # Q4 & Q1 enterprise project ramp-up
        
        for idx, month in enumerate(FORECAST_MONTH_NAMES):
            # Sum demand from all active projects in this month
            project_demand_total = 0.0
            for p in projects:
                month_skills = p.monthly_demand.get(month, {})
                project_demand_total += sum(month_skills.values())
                
            project_demand_total = round(project_demand_total, 1)
            # Forecasted demand includes pipeline / new incoming requests
            forecasted_demand_total = round(project_demand_total * trend_multipliers[idx], 1)
            
            # Leave variations per month (e.g. Dec holiday season has slight capacity dip)
            month_capacity = total_monthly_work_cap
            if "Dec" in month:
                month_capacity = round(total_monthly_work_cap * 0.92, 1)
            elif "Jan" in month:
                month_capacity = round(total_monthly_work_cap * 0.96, 1)
            else:
                month_capacity = round(total_monthly_work_cap, 1)
                
            gap = round(project_demand_total - month_capacity, 1)
            is_shortage = project_demand_total > month_capacity or (gap > -500.0 and idx >= 3)
            
            results.append(MonthlyCapacityDemand(
                month=month,
                available_capacity=month_capacity,
                project_demand=project_demand_total,
                forecasted_demand=forecasted_demand_total,
                gap=gap,
                is_shortage=is_shortage
            ))
            
        return results
