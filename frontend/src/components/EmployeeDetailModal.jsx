import React from 'react';
import { 
  X, 
  User, 
  Briefcase, 
  MapPin, 
  Clock, 
  TrendingUp, 
  CalendarOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function EmployeeDetailModal({ employee, onClose }) {
  if (!employee) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Overloaded':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'High Utilization':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Healthy':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Under-utilized':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-brand-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-brand-600/40 border border-brand-400/40 flex items-center justify-center text-lg font-bold">
              {employee.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold">{employee.name}</h3>
                <span className="text-xs px-2 py-0.5 bg-white/10 rounded font-mono">
                  {employee.id}
                </span>
              </div>
              <p className="text-xs text-slate-300">{employee.role} • {employee.team}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Current Workload
              </span>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold text-slate-900">{employee.utilization_pct}%</span>
              </div>
              <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded mt-1 border ${getStatusColor(employee.utilization_status)}`}>
                {employee.utilization_status}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Productivity Factor
              </span>
              <div className="text-xl font-extrabold text-brand-600">{employee.productivity_score}x</div>
              <span className="text-[10px] text-slate-500 mt-1 block">Velocity multiplier</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Available Capacity
              </span>
              <div className="text-xl font-extrabold text-emerald-600">{employee.available_hours} hrs</div>
              <span className="text-[10px] text-slate-500 mt-1 block">Effective: {employee.effective_capacity}h</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Planned Leave
              </span>
              <div className="text-xl font-extrabold text-slate-700">{employee.leave_hours} hrs</div>
              <span className="text-[10px] text-slate-500 mt-1 block">Next 30 days</span>
            </div>
          </div>

          {/* Allocation & Assigned Project */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Project Assignment</h4>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-brand-600" />
                <span className="font-semibold text-slate-900">
                  {employee.current_project || 'Available for Project Allocation'}
                </span>
              </div>
              <span className="text-slate-500">
                Allocated: <strong className="text-slate-900">{employee.allocated_hours} hrs/mo</strong>
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div 
                className={`h-2 rounded-full ${
                  employee.utilization_pct > 100 
                    ? 'bg-rose-500' 
                    : employee.utilization_pct > 85 
                      ? 'bg-amber-500' 
                      : employee.utilization_pct < 60 
                        ? 'bg-blue-400' 
                        : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, employee.utilization_pct)}%` }}
              />
            </div>
          </div>

          {/* Skill Proficiency Matrix */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Technical Competencies</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {employee.skill_details && employee.skill_details.length > 0 ? (
                employee.skill_details.map((s, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">{s.skill}</span>
                      <span className="text-[10px] text-slate-400 block">{s.years_experience} yrs experience</span>
                    </div>
                    <span className="px-2 py-0.5 bg-brand-50 text-brand-700 border border-brand-200 rounded text-[10px] font-bold">
                      {s.proficiency}
                    </span>
                  </div>
                ))
              ) : (
                employee.skills.map((s, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs font-semibold text-slate-800">
                    {s}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Optimization Potentials: Redistribution & Reskilling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Redistribution Eligibility */}
            <div className={`p-4 rounded-xl border ${
              employee.potential_for_redistribution 
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center space-x-2 mb-1.5">
                <CheckCircle2 className={`w-4 h-4 ${employee.potential_for_redistribution ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">Redistribution Potential</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {employee.potential_for_redistribution
                  ? `Holds ${employee.available_hours}h spare capacity. Eligible to absorb high-priority backlog immediately.`
                  : 'Currently operating within healthy/full utilization limits.'}
              </p>
            </div>

            {/* Reskilling Pathways */}
            <div className="p-4 rounded-xl border bg-amber-50/60 border-amber-200 text-amber-900">
              <div className="flex items-center space-x-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold">Reskilling Pathways</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {employee.reskilling_candidates && employee.reskilling_candidates.length > 0 ? (
                  <span>
                    High adjacent aptitude for: <strong>{employee.reskilling_candidates.join(', ')}</strong>.
                  </span>
                ) : (
                  'Core skill track matches strategic enterprise baseline.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{employee.location}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
