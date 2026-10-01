"""
Realistic Seed Data Generator for Workforce Copilot
Simulates 120 employees, 20+ skills, 10 teams, 16 projects, leave records, and productivity scores.
"""
import random
from typing import List, Dict
from app.models.schemas import Employee, Project, SkillProficiency
from app.config import (
    MONTHLY_WORKING_HOURS,
    UTILIZATION_UNDER,
    UTILIZATION_HEALTHY_MAX,
    UTILIZATION_HIGH,
    FORECAST_MONTH_NAMES
)

TEAMS = [
    "Engineering",
    "Data & AI",
    "Cloud & Infrastructure",
    "Product Management",
    "UX & Design",
    "QA & Testing",
    "Enterprise Solutions",
    "Cyber Security",
    "Mobile Development",
    "Growth & Innovation"
]

SKILLS_POOL = [
    "Python", "Machine Learning", "Data Analysis", "DevOps", "Cloud (AWS/Azure)",
    "UI/UX", "Product Management", "QA & Automation", "React", "Node.js",
    "Kubernetes", "Java", "Go", "SQL / PostgreSQL", "NLP",
    "Cyber Security", "Solution Architecture", "CI/CD", "Agile Coaching", "Mobile / Flutter"
]

ROLES_BY_TEAM = {
    "Engineering": ["Senior Fullstack Engineer", "Backend Engineer", "Frontend Engineer", "Tech Lead", "Software Engineer"],
    "Data & AI": ["Senior ML Engineer", "Data Scientist", "Data Engineer", "AI Researcher", "BI Analyst"],
    "Cloud & Infrastructure": ["DevOps Engineer", "Cloud Architect", "SRE", "Infrastructure Engineer"],
    "Product Management": ["Lead Product Manager", "Technical Product Manager", "Associate Product Manager"],
    "UX & Design": ["Lead UI/UX Designer", "Product Designer", "User Researcher", "Visual Designer"],
    "QA & Testing": ["QA Automation Lead", "SDET", "QA Engineer", "Performance Test Engineer"],
    "Enterprise Solutions": ["Enterprise Architect", "Integration Engineer", "ERP Consultant"],
    "Cyber Security": ["Security Architect", "AppSec Engineer", "Compliance Specialist"],
    "Mobile Development": ["iOS Engineer", "Android Engineer", "Flutter Developer"],
    "Growth & Innovation": ["Innovation Lead", "Prototyping Engineer", "Growth Hacker"]
}

SKILLS_BY_TEAM = {
    "Engineering": ["React", "Node.js", "Java", "Python", "SQL / PostgreSQL", "CI/CD", "Go"],
    "Data & AI": ["Python", "Machine Learning", "Data Analysis", "NLP", "SQL / PostgreSQL"],
    "Cloud & Infrastructure": ["DevOps", "Cloud (AWS/Azure)", "Kubernetes", "CI/CD", "Solution Architecture"],
    "Product Management": ["Product Management", "Data Analysis", "Agile Coaching"],
    "UX & Design": ["UI/UX", "Visual Designer", "Product Management"],
    "QA & Testing": ["QA & Automation", "Python", "CI/CD", "SQL / PostgreSQL"],
    "Enterprise Solutions": ["Solution Architecture", "Java", "Cloud (AWS/Azure)", "SQL / PostgreSQL"],
    "Cyber Security": ["Cyber Security", "Cloud (AWS/Azure)", "DevOps", "Python"],
    "Mobile Development": ["Mobile / Flutter", "React", "Node.js", "UI/UX"],
    "Growth & Innovation": ["Python", "React", "Machine Learning", "Product Management"]
}

LOCATIONS = ["Bangalore, India", "Hyderabad, India", "Pune, India", "Remote (India)"]

FIRST_NAMES = [
    "Rahul", "Priya", "Amit", "Sneha", "Vikram", "Ananya", "Rohan", "Neha", "Arjun", "Pooja",
    "Siddharth", "Kavya", "Aditya", "Divya", "Karan", "Ishita", "Suresh", "Meera", "Varun", "Tanvi",
    "Naveen", "Swati", "Rajesh", "Aishwarya", "Manish", "Ritu", "Deepak", "Shweta", "Alok", "Nandini",
    "Gaurav", "Simran", "Akash", "Preeti", "Harsh", "Bhavna", "Kunal", "Pallavi", "Vivek", "Sonal",
    "Mayank", "Radhika", "Tarun", "Shilpa", "Sunil", "Payal", "Pranav", "Shruti", "Nitin", "Ankita"
]

LAST_NAMES = [
    "Sharma", "Verma", "Patel", "Gupta", "Reddy", "Mehta", "Nair", "Iyer", "Rao", "Joshi",
    "Deshmukh", "Chopra", "Bhat", "Malhotra", "Kulkarni", "Singh", "Das", "Menon", "Saxena", "Choudhury"
]

def generate_employees() -> List[Employee]:
    employees: List[Employee] = []
    random.seed(42)  # Deterministic seed for reproducible enterprise demo
    
    # We will generate 120 employees distributed across teams
    # Team distribution:
    team_distribution = {
        "Engineering": 28,
        "Data & AI": 20,
        "Cloud & Infrastructure": 14,
        "Product Management": 10,
        "UX & Design": 10,
        "QA & Testing": 12,
        "Enterprise Solutions": 8,
        "Cyber Security": 6,
        "Mobile Development": 7,
        "Growth & Innovation": 5
    }
    
    emp_idx = 1
    for team, count in team_distribution.items():
        for i in range(count):
            first = FIRST_NAMES[(emp_idx * 7 + i) % len(FIRST_NAMES)]
            last = LAST_NAMES[(emp_idx * 3 + i) % len(LAST_NAMES)]
            name = f"{first} {last}"
            emp_id = f"EMP-{emp_idx:03d}"
            
            roles = ROLES_BY_TEAM[team]
            role = roles[i % len(roles)]
            
            primary_skills = SKILLS_BY_TEAM[team]
            # Pick 2-4 primary skills + 1-2 cross functional
            emp_skills = list(set(random.sample(primary_skills, min(3, len(primary_skills))) + random.sample(SKILLS_POOL, 1)))
            
            skill_details = []
            for s in emp_skills:
                prof = "Advanced" if "Senior" in role or "Lead" in role else random.choice(["Intermediate", "Advanced", "Expert", "Beginner"])
                skill_details.append(SkillProficiency(
                    skill=s,
                    proficiency=prof,
                    years_experience=round(random.uniform(1.5, 7.5), 1)
                ))
            
            # Productivity score: 0.85 to 1.18
            productivity = round(random.choice([0.88, 0.92, 0.95, 1.0, 1.05, 1.10, 1.15]), 2)
            
            # Workload tuning to create realistic cohorts:
            # 1. Overloaded: ~15% (>100% or ~105-125%)
            # 2. Healthy / High: ~73% (75-95%)
            # 3. Under-utilized: ~12% (35-58%)
            cohort_rand = random.random()
            if cohort_rand < 0.14:
                # Under-utilized
                allocated_hours = round(random.uniform(50.0, 90.0), 1)  # 31% - 56%
            elif cohort_rand > 0.85:
                # Overloaded
                allocated_hours = round(random.uniform(165.0, 195.0), 1) # 103% - 122%
            else:
                # Healthy / High
                allocated_hours = round(random.uniform(115.0, 150.0), 1) # 72% - 94%
            
            leave_hours = round(random.choice([0.0, 0.0, 0.0, 8.0, 16.0, 24.0]), 1)
            
            available_hours = max(0.0, round(MONTHLY_WORKING_HOURS - leave_hours - allocated_hours, 1))
            effective_capacity = round(available_hours * productivity, 1)
            
            # Utilization formula: Allocated Hours / (Working Hours - Leave Hours) * 100
            effective_working_hours = max(1.0, MONTHLY_WORKING_HOURS - leave_hours)
            utilization_pct = round((allocated_hours / effective_working_hours) * 100.0, 1)
            
            if utilization_pct < UTILIZATION_UNDER:
                utilization_status = "Under-utilized"
                potential_redistribute = True
            elif utilization_pct <= UTILIZATION_HEALTHY_MAX:
                utilization_status = "Healthy"
                potential_redistribute = False
            elif utilization_pct <= UTILIZATION_HIGH:
                utilization_status = "High Utilization"
                potential_redistribute = False
            else:
                utilization_status = "Overloaded"
                potential_redistribute = False
            
            # Identify reskilling target skills based on team and missing tech
            reskill_targets = []
            if "Python" in emp_skills and "Machine Learning" not in emp_skills:
                reskill_targets.append("Machine Learning")
            if "DevOps" in emp_skills and "Kubernetes" not in emp_skills:
                reskill_targets.append("Kubernetes")
            if "Cloud (AWS/Azure)" in emp_skills and "DevOps" not in emp_skills:
                reskill_targets.append("DevOps")
            if "React" in emp_skills and "Python" not in emp_skills:
                reskill_targets.append("Python")
            if "QA & Automation" in emp_skills and "Python" not in emp_skills:
                reskill_targets.append("Python")
            
            employees.append(Employee(
                id=emp_id,
                name=name,
                role=role,
                team=team,
                skills=emp_skills,
                skill_details=skill_details,
                weekly_hours=40,
                monthly_hours=MONTHLY_WORKING_HOURS,
                productivity_score=productivity,
                current_project=None,  # Will be mapped from projects
                allocated_hours=allocated_hours,
                leave_hours=leave_hours,
                location=random.choice(LOCATIONS),
                available_hours=available_hours,
                effective_capacity=effective_capacity,
                utilization_pct=utilization_pct,
                utilization_status=utilization_status,
                potential_for_redistribution=potential_redistribute,
                reskilling_candidates=reskill_targets[:2]
            ))
            emp_idx += 1
            
    return employees

def generate_projects() -> List[Project]:
    """Generates 16 realistic projects with skill-hour requirements and monthly distribution"""
    projects_def = [
        {
            "id": "PRJ-101",
            "name": "Banking AI Platform",
            "client": "Apex Global Bank",
            "start_date": "2026-10-01",
            "end_date": "2027-03-31",
            "status": "In Progress",
            "priority": "Critical",
            "required_skills": {"Python": 1400.0, "Machine Learning": 1100.0, "SQL / PostgreSQL": 600.0, "Cloud (AWS/Azure)": 500.0},
            "employees_needed": 8,
            "estimated_effort": 3600.0,
            "delivered": 600.0,
            "capacity_risk": "High",
            "skill_gaps": ["Machine Learning", "Python"]
        },
        {
            "id": "PRJ-102",
            "name": "SME Finance App",
            "client": "FinGrowth Corp",
            "start_date": "2026-09-15",
            "end_date": "2027-01-31",
            "status": "In Progress",
            "priority": "High",
            "required_skills": {"React": 900.0, "Node.js": 750.0, "UI/UX": 400.0, "QA & Automation": 450.0},
            "employees_needed": 6,
            "estimated_effort": 2500.0,
            "delivered": 750.0,
            "capacity_risk": "Low",
            "skill_gaps": []
        },
        {
            "id": "PRJ-103",
            "name": "Data Analytics Portal",
            "client": "Metrix Retail",
            "start_date": "2026-10-15",
            "end_date": "2027-02-28",
            "status": "In Progress",
            "priority": "High",
            "required_skills": {"Python": 800.0, "Data Analysis": 900.0, "SQL / PostgreSQL": 600.0, "React": 500.0},
            "employees_needed": 6,
            "estimated_effort": 2800.0,
            "delivered": 300.0,
            "capacity_risk": "Medium",
            "skill_gaps": ["Python"]
        },
        {
            "id": "PRJ-104",
            "name": "Fraud Detection Model",
            "client": "SafePay International",
            "start_date": "2026-11-01",
            "end_date": "2027-03-31",
            "status": "Upcoming",
            "priority": "Critical",
            "required_skills": {"Machine Learning": 1200.0, "Python": 1000.0, "DevOps": 400.0, "Cloud (AWS/Azure)": 400.0},
            "employees_needed": 7,
            "estimated_effort": 3000.0,
            "delivered": 0.0,
            "capacity_risk": "Critical",
            "skill_gaps": ["Machine Learning", "DevOps"]
        },
        {
            "id": "PRJ-105",
            "name": "Customer Intelligence Platform",
            "client": "OmniMedia Ltd",
            "start_date": "2026-11-15",
            "end_date": "2027-04-15",
            "status": "Upcoming",
            "priority": "High",
            "required_skills": {"NLP": 600.0, "Python": 700.0, "React": 500.0, "DevOps": 350.0},
            "employees_needed": 5,
            "estimated_effort": 2150.0,
            "delivered": 0.0,
            "capacity_risk": "High",
            "skill_gaps": ["NLP", "DevOps"]
        },
        {
            "id": "PRJ-106",
            "name": "Cloud Migration Project",
            "client": "Legacy Logistics",
            "start_date": "2026-10-01",
            "end_date": "2027-02-15",
            "status": "In Progress",
            "priority": "Critical",
            "required_skills": {"Cloud (AWS/Azure)": 1100.0, "Kubernetes": 800.0, "DevOps": 900.0, "CI/CD": 400.0},
            "employees_needed": 7,
            "estimated_effort": 3200.0,
            "delivered": 600.0,
            "capacity_risk": "Critical",
            "skill_gaps": ["DevOps", "Cloud (AWS/Azure)"]
        },
        {
            "id": "PRJ-107",
            "name": "Healthcare Claims AI",
            "client": "Aegis Health",
            "start_date": "2026-12-01",
            "end_date": "2027-05-31",
            "status": "Upcoming",
            "priority": "High",
            "required_skills": {"Machine Learning": 900.0, "Python": 750.0, "Cyber Security": 500.0, "QA & Automation": 400.0},
            "employees_needed": 6,
            "estimated_effort": 2550.0,
            "delivered": 0.0,
            "capacity_risk": "High",
            "skill_gaps": ["Machine Learning"]
        },
        {
            "id": "PRJ-108",
            "name": "Retail Omni-channel Engine",
            "client": "UrbanCart Inc",
            "start_date": "2026-10-01",
            "end_date": "2027-01-15",
            "status": "In Progress",
            "priority": "Medium",
            "required_skills": {"React": 600.0, "Java": 700.0, "SQL / PostgreSQL": 400.0, "QA & Automation": 300.0},
            "employees_needed": 5,
            "estimated_effort": 2000.0,
            "delivered": 500.0,
            "capacity_risk": "Low",
            "skill_gaps": []
        },
        {
            "id": "PRJ-109",
            "name": "Supply Chain Optimization",
            "client": "GlobalFreight Hub",
            "start_date": "2026-11-01",
            "end_date": "2027-03-15",
            "status": "Upcoming",
            "priority": "High",
            "required_skills": {"Python": 700.0, "Data Analysis": 800.0, "Solution Architecture": 400.0},
            "employees_needed": 5,
            "estimated_effort": 1900.0,
            "delivered": 0.0,
            "capacity_risk": "Medium",
            "skill_gaps": ["Python"]
        },
        {
            "id": "PRJ-110",
            "name": "Core Banking Modernization",
            "client": "Heritage Trust Bank",
            "start_date": "2026-09-01",
            "end_date": "2027-03-31",
            "status": "In Progress",
            "priority": "Critical",
            "required_skills": {"Java": 1200.0, "Solution Architecture": 800.0, "Cloud (AWS/Azure)": 700.0, "DevOps": 500.0},
            "employees_needed": 8,
            "estimated_effort": 3200.0,
            "delivered": 800.0,
            "capacity_risk": "Medium",
            "skill_gaps": ["DevOps"]
        },
        {
            "id": "PRJ-111",
            "name": "Zero Trust Security Rollout",
            "client": "Sentinel Cyber",
            "start_date": "2026-10-15",
            "end_date": "2027-02-28",
            "status": "In Progress",
            "priority": "High",
            "required_skills": {"Cyber Security": 1000.0, "Cloud (AWS/Azure)": 600.0, "DevOps": 400.0},
            "employees_needed": 5,
            "estimated_effort": 2000.0,
            "delivered": 350.0,
            "capacity_risk": "Medium",
            "skill_gaps": []
        },
        {
            "id": "PRJ-112",
            "name": "NeoBank Mobile App",
            "client": "Pulse Payments",
            "start_date": "2026-11-01",
            "end_date": "2027-04-30",
            "status": "Upcoming",
            "priority": "High",
            "required_skills": {"Mobile / Flutter": 1100.0, "UI/UX": 500.0, "Node.js": 600.0, "QA & Automation": 400.0},
            "employees_needed": 6,
            "estimated_effort": 2600.0,
            "delivered": 0.0,
            "capacity_risk": "Medium",
            "skill_gaps": []
        },
        {
            "id": "PRJ-113",
            "name": "Automated Compliance Scanner",
            "client": "ReguTech Labs",
            "start_date": "2026-12-01",
            "end_date": "2027-04-15",
            "status": "Upcoming",
            "priority": "Medium",
            "required_skills": {"Python": 600.0, "Cyber Security": 500.0, "SQL / PostgreSQL": 400.0},
            "employees_needed": 4,
            "estimated_effort": 1500.0,
            "delivered": 0.0,
            "capacity_risk": "Low",
            "skill_gaps": []
        },
        {
            "id": "PRJ-114",
            "name": "Real-time Telemetry Lake",
            "client": "AeroStream Data",
            "start_date": "2026-10-01",
            "end_date": "2027-02-28",
            "status": "In Progress",
            "priority": "High",
            "required_skills": {"Go": 800.0, "Kubernetes": 600.0, "Data Analysis": 500.0, "DevOps": 400.0},
            "employees_needed": 5,
            "estimated_effort": 2300.0,
            "delivered": 400.0,
            "capacity_risk": "Medium",
            "skill_gaps": []
        },
        {
            "id": "PRJ-115",
            "name": "Enterprise HR Insights",
            "client": "Internal Core",
            "start_date": "2026-10-01",
            "end_date": "2027-01-31",
            "status": "In Progress",
            "priority": "Medium",
            "required_skills": {"React": 500.0, "Python": 600.0, "UI/UX": 300.0},
            "employees_needed": 4,
            "estimated_effort": 1400.0,
            "delivered": 350.0,
            "capacity_risk": "Low",
            "skill_gaps": []
        },
        {
            "id": "PRJ-116",
            "name": "Algorithmic Trading Gateway",
            "client": "Quantum Capital",
            "start_date": "2027-01-01",
            "end_date": "2027-05-31",
            "status": "Planning",
            "priority": "Critical",
            "required_skills": {"Go": 900.0, "Python": 800.0, "Cloud (AWS/Azure)": 500.0, "DevOps": 500.0},
            "employees_needed": 6,
            "estimated_effort": 2700.0,
            "delivered": 0.0,
            "capacity_risk": "High",
            "skill_gaps": ["Python", "DevOps"]
        }
    ]
    
    projects: List[Project] = []
    
    for p in projects_def:
        # Generate monthly demand breakdown across 6 forecast months
        monthly_demand: Dict[str, Dict[str, float]] = {}
        for m in FORECAST_MONTH_NAMES:
            monthly_demand[m] = {}
            for skill, total_hours in p["required_skills"].items():
                # Spread total hours across active months
                # Most projects run 4-6 months
                monthly_demand[m][skill] = round(total_hours / 5.0, 1)
                
        projects.append(Project(
            id=p["id"],
            name=p["name"],
            client=p["client"],
            start_date=p["start_date"],
            end_date=p["end_date"],
            status=p["status"],
            priority=p["priority"],
            required_skills=p["required_skills"],
            monthly_demand=monthly_demand,
            assigned_employee_ids=[],
            number_of_employees_needed=p["employees_needed"],
            estimated_effort_hours=p["estimated_effort"],
            delivered_hours=p["delivered"],
            capacity_risk=p["capacity_risk"],
            skill_gaps=p["skill_gaps"]
        ))
        
    return projects

class DataStore:
    """In-memory data store with reset capability"""
    def __init__(self):
        self.employees: List[Employee] = []
        self.projects: List[Project] = []
        self.reset()
        
    def reset(self):
        self.employees = generate_employees()
        self.projects = generate_projects()
        
        # Link some employees to projects
        project_names = [p.name for p in self.projects if p.status == "In Progress"]
        for i, emp in enumerate(self.employees):
            if emp.utilization_pct > 40:
                assigned_prj = project_names[i % len(project_names)]
                emp.current_project = assigned_prj
                # Also assign employee ID to project
                for p in self.projects:
                    if p.name == assigned_prj and len(p.assigned_employee_ids) < p.number_of_employees_needed:
                        p.assigned_employee_ids.append(emp.id)

# Singleton global instance
db = DataStore()
