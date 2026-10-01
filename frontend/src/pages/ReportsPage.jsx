import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  DollarSign, 
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { fetchReports } from '../services/api';

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await fetchReports();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!report) return;

    // Create CSV rows for Skill Gaps
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Type,Skill/Metric,Status,Required_Hours,Available_Hours,Gap_Hours\n";

    report.critical_gaps.forEach((g) => {
      csvContent += `Skill Gap,"${g.skill}",${g.status},${g.required_hours},${g.available_hours},${g.gap_hours}\n`;
    });

    report.team_utilizations.forEach((t) => {
      csvContent += `Team Utilization,"${t.team}",${t.status},${t.total_allocated_hours},${t.total_capacity_hours},${t.gap_hours}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `workforce_planning_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-2">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-slate-500">Generating formal workforce planning report...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workforce Planning Report</h1>
          <p className="text-sm text-slate-500">
            Executive audit report with capacity forecasts, hiring budgets, and internal optimization plans
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8 max-w-5xl mx-auto">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-slate-900 tracking-tight">Workforce Copilot</span>
              <span className="text-xs px-2 py-0.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-md font-semibold">
                Official Report
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Enterprise Capacity & Hiring Optimization Assessment</p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <div>Cycle: <strong className="text-slate-700">Q4 2026 – Q1 2027</strong></div>
            <div>Generated: {report.generated_at}</div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. Executive Summary
          </h2>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
            {report.executive_summary}
          </div>
        </section>

        {/* Section 2: Current Workforce Telemetry */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            2. Current Workforce Capacity Metrics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Total Headcount</span>
              <span className="text-xl font-bold text-slate-900">{report.total_employees}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Workforce Utilization</span>
              <span className="text-xl font-bold text-emerald-600">{report.current_utilization}%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Critical Deficits</span>
              <span className="text-xl font-bold text-rose-600">{report.critical_gaps.length}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Unavoidable Hires</span>
              <span className="text-xl font-bold text-brand-600">6 Specialist(s)</span>
            </div>
          </div>
        </section>

        {/* Section 3: Critical Skill Gaps & Causes */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            3. Critical Skill Deficits & Projected Shortages
          </h2>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Skill Track</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Required (hrs)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Available (hrs)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Net Deficit</th>
                  <th className="py-2.5 px-3 font-semibold">Shortage Date</th>
                  <th className="py-2.5 px-3 font-semibold">Impacted Projects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.critical_gaps.map((g, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{g.skill}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{g.required_hours}h</td>
                    <td className="py-2.5 px-3 text-right font-mono">{g.available_hours}h</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">+{g.gap_hours}h</td>
                    <td className="py-2.5 px-3 text-amber-700 font-medium">{g.shortage_date || 'Immediate'}</td>
                    <td className="py-2.5 px-3 text-slate-600">{g.affected_projects?.slice(0, 2).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Recommended Action Plans */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            4. Strategic Hiring, Reskilling & Redistribution Plan
          </h2>
          <div className="space-y-3">
            {report.recommendations_summary.map((rec, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <strong className="text-slate-900 text-sm">{rec.skill}</strong>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-100 text-brand-800">
                      Strategy: {rec.recommended_strategy}
                    </span>
                  </div>
                  <span className="font-mono text-rose-600 font-bold">+{rec.gap_hours} hrs</span>
                </div>
                <p className="text-slate-600 leading-relaxed mb-2">{rec.executive_summary}</p>
                <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-200 flex flex-wrap gap-x-4">
                  <span>Hiring Need: <strong>{rec.hire_plan?.headcount || 0} specialist(s)</strong></span>
                  <span>Cost Est.: <strong>{rec.hire_plan?.cost_range}</strong></span>
                  <span>Recruitment Start: <strong>{rec.hire_plan?.recommended_start}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Scenario Simulation Benchmark */}
        {report.scenario_benchmark && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              5. Stress-Test Scenario: Win 3 New Projects (+2,400 Hours)
            </h2>
            <div className="p-4 bg-brand-50/50 rounded-xl border border-brand-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-brand-900">Projected Peak Utilization:</span>
                <span className="font-bold text-rose-600 text-sm">{report.scenario_benchmark.new_utilization_pct}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-brand-900">Recommended External Hires:</span>
                <span className="font-bold text-slate-900">{report.scenario_benchmark.recommended_hires} specialists ({report.scenario_benchmark.estimated_hiring_cost_range})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-brand-900">Target Hiring Approval Deadline:</span>
                <span className="font-bold text-amber-700">{report.scenario_benchmark.recommended_hiring_deadline}</span>
              </div>
            </div>
          </section>
        )}

        {/* Report Footer */}
        <div className="border-t border-slate-200 pt-4 text-center text-[11px] text-slate-400">
          Generated automatically by Workforce Copilot • AI Capacity & Hiring Optimization Engine
        </div>
      </div>
    </div>
  );
}
