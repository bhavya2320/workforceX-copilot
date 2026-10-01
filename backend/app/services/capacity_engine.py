"""
Workforce Capacity Engine
Performs real calculations for:
- Available Hours = Working Hours - Leave Hours - Existing Project Allocation
- Effective Capacity = Available Hours * Productivity Factor
- Utilization = Allocated Hours / (Working Hours - Leave Hours) * 100
- Skill and Team level aggregations
"""
from typing import List, Dict, Any
from app.models.schemas import Employee, TeamUtilization
from app.config import (
    MONTHLY_WORKING_HOURS,
    UTILIZATION_UNDER,
    UTILIZATION_HEALTHY_MAX,
    UTILIZATION_HIGH
)

class CapacityEngine:
    @staticmethod
    def calculate_employee_metrics(emp: Employee) -> Employee:
        effective_working_hours = max(1.0, emp.monthly_hours - emp.leave_hours)
        emp.available_hours = max(0.0, round(effective_working_hours - emp.allocated_hours, 1))
        emp.effective_capacity = round(emp.available_hours * emp.productivity_score, 1)
        
        utilization = (emp.allocated_hours / effective_working_hours) * 100.0
        emp.utilization_pct = round(utilization, 1)
        
        if emp.utilization_pct < UTILIZATION_UNDER:
            emp.utilization_status = "Under-utilized"
            emp.potential_for_redistribution = True
        elif emp.utilization_pct <= UTILIZATION_HEALTHY_MAX:
            emp.utilization_status = "Healthy"
            emp.potential_for_redistribution = False
        elif emp.utilization_pct <= UTILIZATION_HIGH:
            emp.utilization_status = "High Utilization"
            emp.potential_for_redistribution = False
        else:
            emp.utilization_status = "Overloaded"
            emp.potential_for_redistribution = False
            
        return emp

    @staticmethod
    def calculate_team_utilizations(employees: List[Employee]) -> List[TeamUtilization]:
        team_data: Dict[str, Dict[str, float]] = {}
        
        for emp in employees:
            if emp.team not in team_data:
                team_data[emp.team] = {
                    "count": 0,
                    "allocated_hours": 0.0,
                    "available_working_hours": 0.0,
                    "free_hours": 0.0
                }
            
            work_capacity = max(1.0, emp.monthly_hours - emp.leave_hours)
            team_data[emp.team]["count"] += 1
            team_data[emp.team]["allocated_hours"] += emp.allocated_hours
            team_data[emp.team]["available_working_hours"] += work_capacity
            team_data[emp.team]["free_hours"] += emp.available_hours

        results: List[TeamUtilization] = []
        for team, data in team_data.items():
            count = int(data["count"])
            tot_allocated = round(data["allocated_hours"], 1)
            tot_work_cap = round(data["available_working_hours"], 1)
            util_pct = round((tot_allocated / tot_work_cap) * 100.0, 1) if tot_work_cap > 0 else 0.0
            
            if util_pct < UTILIZATION_UNDER:
                status = "Under-utilized"
            elif util_pct <= UTILIZATION_HEALTHY_MAX:
                status = "Healthy"
            elif util_pct <= UTILIZATION_HIGH:
                status = "High Utilization"
            else:
                status = "Overloaded"
                
            gap = round(tot_allocated - tot_work_cap, 1)
            
            results.append(TeamUtilization(
                team=team,
                headcount=count,
                utilization_pct=util_pct,
                status=status,
                total_capacity_hours=tot_work_cap,
                total_allocated_hours=tot_allocated,
                gap_hours=gap
            ))
            
        # Sort by highest utilization
        results.sort(key=lambda x: x.utilization_pct, reverse=True)
        return results

    @staticmethod
    def calculate_skill_supply(employees: List[Employee]) -> Dict[str, Dict[str, float]]:
        """
        Calculates available skill hours and total capacity hours across employees.
        Returns: { skill_name: {"total_capacity": float, "effective_available": float, "headcount": int} }
        """
        skill_supply: Dict[str, Dict[str, float]] = {}
        
        for emp in employees:
            num_skills = max(1, len(emp.skills))
            # Distribute employee's effective hours across their skills
            hours_per_skill = (emp.monthly_hours - emp.leave_hours) / num_skills
            free_hours_per_skill = emp.effective_capacity / num_skills
            
            for skill in emp.skills:
                if skill not in skill_supply:
                    skill_supply[skill] = {
                        "total_capacity": 0.0,
                        "effective_available": 0.0,
                        "headcount": 0
                    }
                skill_supply[skill]["total_capacity"] += hours_per_skill
                skill_supply[skill]["effective_available"] += free_hours_per_skill
                skill_supply[skill]["headcount"] += 1
                
        # Round values
        for skill in skill_supply:
            skill_supply[skill]["total_capacity"] = round(skill_supply[skill]["total_capacity"], 1)
            skill_supply[skill]["effective_available"] = round(skill_supply[skill]["effective_available"], 1)
            
        return skill_supply
