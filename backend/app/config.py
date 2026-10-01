"""
Configuration constants and workforce capacity thresholds
"""

# Capacity Utilization Thresholds (%)
UTILIZATION_UNDER = 60.0        # < 60% = Under-utilized
UTILIZATION_HEALTHY_MIN = 60.0  # 60% - 85% = Healthy
UTILIZATION_HEALTHY_MAX = 85.0
UTILIZATION_HIGH = 100.0        # 85% - 100% = High utilization
                                # > 100% = Overloaded

# Standard Working Hours
STANDARD_WEEKLY_HOURS = 40
MONTHLY_WORKING_HOURS = 160     # 4 weeks * 40 hours

# Cost & Lead Time Benchmarks (in INR Lakhs & Days)
HIRING_ANNUAL_COST_MIN_LAKHS = 18.0
HIRING_ANNUAL_COST_MAX_LAKHS = 30.0
HIRING_LEAD_TIME_DAYS_DEFAULT = 45

RESKILLING_COST_PER_EMPLOYEE_LAKHS = 1.25  # ~₹1,25,000
RESKILLING_DURATION_WEEKS_DEFAULT = 6

REDISTRIBUTION_COST_LAKHS = 0.0
REDISTRIBUTION_TRANSITION_DAYS = 7

# Forecast Horizon Months
FORECAST_MONTHS_COUNT = 6
FORECAST_MONTH_NAMES = ["Oct 2026", "Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027"]
