import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { fetchSkillGaps } from '../services/api';

export default function SkillsMatrixPage({ setActiveTab }) {
  const [skillGaps, setSkillGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadGaps();
  }, []);

  const loadGaps = async () => {
    setLoading(true);
    try {
      const data = await fetchSkillGaps();
      setSkillGaps(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Critical Gap':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Moderate Gap':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Balanced':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Surplus':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredSkills = skillGaps.filter((s) => {
    const matchesSearch = s.skill.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus ? s.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Skills Matrix & Gap Analysis</h1>
          <p className="text-sm text-slate-500">
            Total Available Capacity vs Total Required Capacity across 20+ specialized technologies
          </p>
        </div>

        <button
          onClick={() => setActiveTab('recommendations')}
          className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          View Optimization Strategy
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skill name (e.g. Python, Machine Learning, DevOps)..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Gap Statuses</option>
          <option value="Critical Gap">Critical Gap (&gt;200h deficit)</option>
          <option value="Moderate Gap">Moderate Gap (40–200h deficit)</option>
          <option value="Balanced">Balanced (-50 to +40h)</option>
          <option value="Surplus">Surplus (&lt;-50h)</option>
        </select>
      </div>

      {/* Skills Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-2">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500">Evaluating skill supply and demand telemetry...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
                  <th className="py-3 px-4 font-semibold">Skill Competency</th>
                  <th className="py-3 px-3 font-semibold text-right">Required (Demand)</th>
                  <th className="py-3 px-3 font-semibold text-right">Available (Supply)</th>
                  <th className="py-3 px-3 font-semibold text-right">Capacity Gap</th>
                  <th className="py-3 px-3 font-semibold text-center">Status</th>
                  <th className="py-3 px-3 font-semibold">Shortage Commences</th>
                  <th className="py-3 px-4 font-semibold">Impacted Projects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSkills.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
                      <span>{item.skill}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-700">
                      {item.required_hours.toLocaleString()} hrs
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-700">
                      {item.available_hours.toLocaleString()} hrs
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span className={item.gap_hours > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                        {item.gap_hours > 0 ? `+${item.gap_hours} hrs` : `${item.gap_hours} hrs`}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {item.shortage_date ? (
                        <span className="text-amber-700 font-medium">{item.shortage_date}</span>
                      ) : (
                        <span className="text-slate-400">None detected</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.affected_projects && item.affected_projects.length > 0 ? (
                        <span className="truncate max-w-[200px] block" title={item.affected_projects.join(', ')}>
                          {item.affected_projects.slice(0, 2).join(', ')}
                          {item.affected_projects.length > 2 && ` +${item.affected_projects.length - 2} more`}
                        </span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
