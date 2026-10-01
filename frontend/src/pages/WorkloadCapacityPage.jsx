import React, { useState, useEffect } from 'react';
import { 
  Gauge, 
  AlertTriangle, 
  UserCheck, 
  UserMinus, 
  ArrowRight, 
  TrendingUp, 
  Layers, 
  Info,
  CheckCircle2,
  Users
} from 'lucide-react';
import { fetchCapacity } from '../services/api';

export default function WorkloadCapacityPage({ onOpenCopilot }) {
  const [capacityData, setCapacityData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCapacity();
  }, []);

  const loadCapacity = async () => {
    setLoading(true);
    try {
      const data = await fetchCapacity();
      setCapacityData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-2">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-slate-500">Calculating workload telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workload & Capacity Engine</h1>
          <p className="text-sm text-slate-500">
            Real formula calculations: Available Hours, Productivity Index, Effective Capacity, and Utilization Thresholds
          </p>
        </div>

        <button
          onClick={onOpenCopilot}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-lg text-xs font-semibold"
        >
          <span>Ask: "Which teams are overloaded?"</span>
        </button>
      </div>

      {/* Formula & Thresholds Explainer Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-2">
          <Info className="w-4 h-4 text-brand-600" />
          <span>Underlying Capacity Calculation Formulas</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700 block mb-1">1. Available Hours</span>
            <code className="text-brand-700 font-mono text-[11px] block bg-white p-1 rounded border">
              Working Hours – Leave – Allocated Hours
            </code>
            <p className="text-[10px] text-slate-500 mt-1">Standard baseline: 160 hrs/month</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700 block mb-1">2. Effective Capacity</span>
            <code className="text-brand-700 font-mono text-[11px] block bg-white p-1 rounded border">
              Available Hours × Productivity Factor
            </code>
            <p className="text-[10px] text-slate-500 mt-1">Adjusted for seniority & velocity (0.85x – 1.15x)</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700 block mb-1">3. Workforce Utilization</span>
            <code className="text-brand-700 font-mono text-[11px] block bg-white p-1 rounded border">
              Allocated Hours / Available Hours × 100
            </code>
            <p className="text-[10px] text-slate-500 mt-1">Current Company Average: {capacityData.average_utilization}%</p>
          </div>
        </div>

        {/* Threshold Bands */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="font-bold text-blue-800 block">&lt; 60%</span>
            <span className="text-[10px] text-blue-600">Under-utilized (Redistributable)</span>
          </div>
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span className="font-bold text-emerald-800 block">60% – 85%</span>
            <span className="text-[10px] text-emerald-600">Healthy Operational Band</span>
          </div>
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="font-bold text-amber-800 block">85% – 100%</span>
            <span className="text-[10px] text-amber-600">High Saturation Band</span>
          </div>
          <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg">
            <span className="font-bold text-rose-800 block">&gt; 100%</span>
            <span className="text-[10px] text-rose-600">Overloaded (Burnout Risk)</span>
          </div>
        </div>
      </div>

      {/* Overloaded vs Under-Utilized Staff Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overloaded Staff (>100%) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded bg-rose-100 text-rose-700">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-rose-900">
                Overloaded Employees ({capacityData.overloaded.length})
              </h3>
            </div>
            <span className="text-xs font-semibold text-rose-600">Burnout & SLA Risk</span>
          </div>

          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
            {capacityData.overloaded.map((emp) => (
              <div key={emp.id} className="p-3 bg-rose-50/50 rounded-lg border border-rose-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <strong className="text-slate-900">{emp.name}</strong> <span className="text-slate-400 font-mono">({emp.id})</span>
                    <span className="block text-[11px] text-slate-500">{emp.team} • {emp.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-rose-600 font-mono">{emp.utilization_pct}%</span>
                    <span className="block text-[10px] text-rose-700 font-medium">Overloaded</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-rose-100">
                  <span>Allocated: {emp.allocated_hours}h / 160h</span>
                  <span className="font-medium text-slate-700">Project: {emp.current_project}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Under-Utilized Staff (<60%) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded bg-blue-100 text-blue-700">
                <UserMinus className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-xs uppercase tracking-wider text-blue-900">
                Under-Utilized Staff ({capacityData.under_utilized.length})
              </h3>
            </div>
            <span className="text-xs font-semibold text-blue-600">Redistributable Capacity</span>
          </div>

          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
            {capacityData.under_utilized.map((emp) => (
              <div key={emp.id} className="p-3 bg-blue-50/50 rounded-lg border border-blue-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <strong className="text-slate-900">{emp.name}</strong> <span className="text-slate-400 font-mono">({emp.id})</span>
                    <span className="block text-[11px] text-slate-500">{emp.team} • {emp.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-blue-600 font-mono">{emp.utilization_pct}%</span>
                    <span className="block text-[10px] text-blue-700 font-medium">Under-utilized</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-blue-100">
                  <span className="font-semibold text-emerald-700">Free: {emp.available_hours} hrs/mo</span>
                  <span className="truncate max-w-[150px]">Skills: {emp.skills.slice(0, 2).join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
