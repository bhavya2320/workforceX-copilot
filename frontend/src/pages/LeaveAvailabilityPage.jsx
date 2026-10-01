import React, { useState, useEffect } from 'react';
import { 
  CalendarOff, 
  Calendar, 
  Clock, 
  Users, 
  AlertTriangle, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { fetchEmployees } from '../services/api';

export default function LeaveAvailabilityPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const employeesOnLeave = employees.filter((e) => e.leave_hours > 0);
  const totalLeaveHours = employees.reduce((sum, e) => sum + e.leave_hours, 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave & Availability Tracker</h1>
        <p className="text-sm text-slate-500">
          Planned employee absences and their dynamic deduction from available delivery hours
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Leave Booked
          </span>
          <div className="text-2xl font-bold text-slate-900">{totalLeaveHours} hrs</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Equivalent to ~{Math.round(totalLeaveHours / 160)} full-time employee months
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Staff with Scheduled Leave
          </span>
          <div className="text-2xl font-bold text-brand-600">{employeesOnLeave.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Out of 120 total staff ({Math.round((employeesOnLeave.length / 120) * 100)}%)
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            December Holiday Reserve
          </span>
          <div className="text-2xl font-bold text-amber-600">-8% Capacity</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Automated seasonal reduction factor applied
          </p>
        </div>
      </div>

      {/* Staff on Leave Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Scheduled Leave Records (Next 60 Days)
          </h2>
          <span className="text-xs text-slate-400">Deducted from Effective Working Hours</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
                <th className="py-2.5 px-4 font-semibold">Employee</th>
                <th className="py-2.5 px-3 font-semibold">Team</th>
                <th className="py-2.5 px-3 font-semibold">Assigned Project</th>
                <th className="py-2.5 px-3 font-semibold text-right">Leave Days</th>
                <th className="py-2.5 px-3 font-semibold text-right">Hours Deducted</th>
                <th className="py-2.5 px-4 font-semibold text-right">Net Available Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employeesOnLeave.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-slate-900">
                    {emp.name} <span className="text-slate-400 font-mono">({emp.id})</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{emp.team}</td>
                  <td className="py-2.5 px-3 text-slate-600">{emp.current_project || 'None'}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-700">
                    {Math.round(emp.leave_hours / 8)} days
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                    -{emp.leave_hours} hrs
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-600">
                    {emp.available_hours} hrs
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
