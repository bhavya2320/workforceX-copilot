import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  AlertTriangle, 
  UserX, 
  Sparkles, 
  ChevronRight,
  MapPin,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import { fetchEmployees } from '../services/api';
import EmployeeDetailModal from '../components/EmployeeDetailModal';

export default function EmployeesPage({ onSelectEmployee }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [activeModalEmployee, setActiveModalEmployee] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, [selectedTeam, selectedStatus, selectedSkill]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployees({
        team: selectedTeam,
        utilization_status: selectedStatus,
        skill: selectedSkill,
        search: search
      });
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadEmployees();
  };

  const getStatusBadge = (status) => {
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
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workforce Directory</h1>
          <p className="text-sm text-slate-500">
            120 staff profiles with live workload telemetry, productivity scores, and reallocation fitness
          </p>
        </div>

        {/* Quick status counter */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium">
            Total Shown: <strong className="text-slate-900">{employees.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role, ID, or team..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Team Dropdown */}
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Teams (10 Teams)</option>
            <option value="Engineering">Engineering</option>
            <option value="Data & AI">Data & AI</option>
            <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
            <option value="Product Management">Product Management</option>
            <option value="UX & Design">UX & Design</option>
            <option value="QA & Testing">QA & Testing</option>
            <option value="Enterprise Solutions">Enterprise Solutions</option>
            <option value="Cyber Security">Cyber Security</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="Growth & Innovation">Growth & Innovation</option>
          </select>

          {/* Utilization Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Utilizations</option>
            <option value="Under-utilized">Under-utilized (&lt;60%)</option>
            <option value="Healthy">Healthy (60–85%)</option>
            <option value="High Utilization">High (85–100%)</option>
            <option value="Overloaded">Overloaded (&gt;100%)</option>
          </select>

          {/* Skill Filter Dropdown */}
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Skills</option>
            <option value="Python">Python</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="DevOps">DevOps</option>
            <option value="Cloud (AWS/Azure)">Cloud (AWS/Azure)</option>
            <option value="React">React</option>
            <option value="Kubernetes">Kubernetes</option>
            <option value="Data Analysis">Data Analysis</option>
            <option value="UI/UX">UI/UX</option>
            <option value="QA & Automation">QA & Automation</option>
          </select>

          {/* Reset Filters */}
          {(selectedTeam || selectedStatus || selectedSkill || search) && (
            <button
              type="button"
              onClick={() => {
                setSelectedTeam('');
                setSelectedStatus('');
                setSelectedSkill('');
                setSearch('');
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Employees Grid Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-2">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500">Filtering employee workforce database...</span>
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
          <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">No employees match the specified filters</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting your filter parameters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => setActiveModalEmployee(emp)}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-brand-400 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 leading-tight">{emp.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">{emp.id} • {emp.team}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getStatusBadge(emp.utilization_status)}`}>
                    {emp.utilization_status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium mb-3">{emp.role}</p>

                {/* Utilization Metric Bar */}
                <div className="space-y-1 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Workload:</span>
                    <strong className="text-slate-900">{emp.utilization_pct}%</strong>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        emp.utilization_pct > 100
                          ? 'bg-rose-500'
                          : emp.utilization_pct > 85
                            ? 'bg-amber-500'
                            : emp.utilization_pct < 60
                              ? 'bg-blue-400'
                              : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, emp.utilization_pct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Free: {emp.available_hours}h</span>
                    <span>Productivity: {emp.productivity_score}x</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {emp.skills.slice(0, 3).map((skill, sIdx) => (
                    <span key={sIdx} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {skill}
                    </span>
                  ))}
                  {emp.skills.length > 3 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{emp.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[170px] text-slate-600">
                  {emp.current_project || 'Open to assignment'}
                </span>
                <span className="text-brand-600 font-semibold flex items-center hover:underline">
                  Profile <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employee Detail Modal */}
      {activeModalEmployee && (
        <EmployeeDetailModal
          employee={activeModalEmployee}
          onClose={() => setActiveModalEmployee(null)}
        />
      )}
    </div>
  );
}
