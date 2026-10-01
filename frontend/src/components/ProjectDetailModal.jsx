import React from 'react';
import { 
  X, 
  Briefcase, 
  Calendar, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function ProjectDetailModal({ project, onClose }) {
  if (!project) return null;

  const remainingEffort = Math.max(0, project.estimated_effort_hours - project.delivered_hours);
  const completionPct = Math.round((project.delivered_hours / Math.max(1, project.estimated_effort_hours)) * 100);

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-brand-600/40 border border-brand-400/40 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-brand-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold">{project.name}</h3>
                <span className="text-xs px-2 py-0.5 bg-white/10 rounded font-mono">
                  {project.id}
                </span>
              </div>
              <p className="text-xs text-slate-300">{project.client} • {project.status}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Capacity Risk
              </span>
              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded border ${getRiskBadge(project.capacity_risk)}`}>
                {project.capacity_risk} Risk
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Delivery SLA Status</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Staffing Need
              </span>
              <div className="text-lg font-bold text-slate-900">
                {project.assigned_employee_ids?.length || 0} / {project.number_of_employees_needed}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Engineers Assigned</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total Effort
              </span>
              <div className="text-lg font-bold text-brand-600">
                {project.estimated_effort_hours.toLocaleString()} hrs
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Remaining: {remainingEffort}h</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Priority
              </span>
              <div className="text-lg font-bold text-slate-900">{project.priority}</div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Contract Tier</span>
            </div>
          </div>

          {/* Delivery Progress Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Project Execution Progress</span>
              <span className="font-bold text-slate-900">{completionPct}% ({project.delivered_hours} / {project.estimated_effort_hours} hrs)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-brand-600 h-2 rounded-full" style={{ width: `${completionPct}%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-2">
              <span>Start: {project.start_date}</span>
              <span>Deadline: {project.end_date}</span>
            </div>
          </div>

          {/* Required Skills & Hours Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Skill Demands & Impending Gaps
            </h4>
            <div className="space-y-2">
              {Object.entries(project.required_skills).map(([skill, hours], idx) => {
                const hasGap = project.skill_gaps?.includes(skill);
                return (
                  <div 
                    key={idx}
                    className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                      hasGap 
                        ? 'bg-rose-50/60 border-rose-200 text-rose-900' 
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Layers className={`w-4 h-4 ${hasGap ? 'text-rose-500' : 'text-slate-400'}`} />
                      <span className="font-semibold">{skill}</span>
                      {hasGap && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-700 border border-rose-300 rounded">
                          CRITICAL SHORTAGE
                        </span>
                      )}
                    </div>
                    <div className="font-mono font-bold">
                      {hours.toLocaleString()} total hrs
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
