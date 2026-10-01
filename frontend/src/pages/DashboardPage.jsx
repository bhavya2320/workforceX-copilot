import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Briefcase, 
  UserPlus, 
  AlertTriangle, 
  UserMinus, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle,
  Clock,
  Layers,
  Activity,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import { fetchDashboard } from '../services/api';

export default function DashboardPage({ setActiveTab, onSelectEmployee, onSelectProject, onOpenCopilot }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboard();
      setData(res);
    } catch (err) {
      setError(err.message || 'Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-600">Loading workforce telemetry and capacity matrix...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-rose-800 my-6">
        <h3 className="font-bold text-base mb-1">Failed to load dashboard data</h3>
        <p className="text-xs mb-4">{error}</p>
        <button
          onClick={loadDashboard}
          className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const getHeatmapColor = (status) => {
    switch (status) {
      case 'Critical Gap':
        return 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
      case 'Moderate Gap':
        return 'bg-amber-100 text-amber-800 border-amber-200 font-semibold';
      case 'Balanced':
        return 'bg-blue-50 text-blue-700 border-blue-200 font-medium';
      case 'Surplus':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTeamBadgeColor = (status) => {
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
    <div className="space-y-6 pb-12">
      {/* Page Title & Action Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workforce Capacity Dashboard</h1>
          <p className="text-sm text-slate-500">
            Real-time supply vs demand analytics, skill gap forecasting, and hiring decision engine
          </p>
        </div>

        {/* Hackathon Demo Quick Launcher */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('scenario')}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-brand-600/25 transition-all"
          >
            <Sliders className="w-4 h-4 text-amber-300" />
            <span>Launch Scenario Simulator</span>
            <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded font-extrabold ml-1">
              DEMO
            </span>
          </button>
        </div>
      </div>

      {/* Critical Executive Alerts Bar */}
      {data.alerts && data.alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.alerts.map((alert, i) => (
            <div 
              key={i} 
              className={`p-3.5 rounded-xl border flex items-start space-x-3 text-xs ${
                alert.type === 'critical' 
                  ? 'bg-rose-50/70 border-rose-200/80 text-rose-900' 
                  : alert.type === 'warning'
                    ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
                    : 'bg-indigo-50/70 border-indigo-200/80 text-indigo-900'
              }`}
            >
              <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                alert.type === 'critical' ? 'text-rose-600' : alert.type === 'warning' ? 'text-amber-600' : 'text-indigo-600'
              }`} />
              <div className="flex-1">
                <span className="font-bold block mb-0.5">{alert.title}</span>
                <span className="opacity-90">{alert.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Employees */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Headcount</span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{data.total_employees}</div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center">
            <span>Across 10 core teams</span>
          </p>
        </div>

        {/* Current Utilization */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Workforce Util.</span>
            <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{data.current_utilization}%</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            Healthy Target (60–85%)
          </p>
        </div>

        {/* Upcoming Projects */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active & Pipeline</span>
            <div className="p-1.5 bg-brand-100 rounded-lg text-brand-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{data.upcoming_projects_count}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            16 Total Portfolio Projects
          </p>
        </div>

        {/* Projected Hiring Need */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Hiring Need</span>
            <div className="p-1.5 bg-rose-100 rounded-lg text-rose-600">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600">{data.projected_hiring_need}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Unavoidable specialist hires
          </p>
        </div>

        {/* Critical Skill Gaps */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Critical Gaps</span>
            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600">{data.critical_skill_gaps_count}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Python, ML, DevOps, Cloud
          </p>
        </div>

        {/* Under-utilized Employees */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Under-utilized</span>
            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
              <UserMinus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600">{data.under_utilized_count}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Redistributable capacity
          </p>
        </div>
      </div>

      {/* Row 2: Capacity vs Demand Chart & Team Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capacity vs Demand Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Workforce Capacity vs Project Demand</h2>
              <p className="text-xs text-slate-500">6-Month Monthly Available Hours vs Project Demand vs Pipeline Forecast</p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                Shortage: Jan–Feb 2027
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.capacity_vs_demand} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val, name) => [`${val.toLocaleString()} hrs`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="available_capacity" 
                  name="Available Capacity (hrs)" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorCap)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="project_demand" 
                  name="Project Demand (hrs)" 
                  stroke="#6366f1" 
                  fillOpacity={1} 
                  fill="url(#colorDemand)" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="forecasted_demand" 
                  name="Forecasted Demand (Pipeline)" 
                  stroke="#f43f5e" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Utilization Progress Bars (1 col) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Team Workload Distribution</h2>
              <p className="text-xs text-slate-500">Utilization % across 10 functional groups</p>
            </div>
            <button 
              onClick={() => setActiveTab('capacity')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center"
            >
              Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3.5 overflow-y-auto max-h-[300px] pr-1">
            {data.team_utilizations.map((team, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{team.team}</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-slate-900">{team.utilization_pct}%</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${getTeamBadgeColor(team.status)}`}>
                      {team.status}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      team.utilization_pct > 100 
                        ? 'bg-rose-500' 
                        : team.utilization_pct > 85 
                          ? 'bg-amber-500' 
                          : team.utilization_pct < 60 
                            ? 'bg-blue-400' 
                            : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${Math.min(100, team.utilization_pct)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{team.headcount} employees</span>
                  <span>{team.total_allocated_hours.toLocaleString()} / {team.total_capacity_hours.toLocaleString()} hrs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Skill Gap Heatmap (Next 6 Months) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Skill Gap Forecast Heatmap (Next 6 Months)</h2>
            <p className="text-xs text-slate-500">
              Monthly supply-demand matrix. Highlights impending skill shortages before project kickoff.
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-300"></span>
              <span className="text-slate-600">Surplus</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-300"></span>
              <span className="text-slate-600">Balanced</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-300"></span>
              <span className="text-slate-600">Moderate Gap</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-100 border border-rose-300"></span>
              <span className="text-slate-600">Critical Gap</span>
            </span>
          </div>
        </div>

        {/* Heatmap Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
                <th className="py-2.5 px-3 font-semibold w-48">Skill Track</th>
                {data.skill_gap_heatmap[0] && Object.keys(data.skill_gap_heatmap[0].months).map((m, idx) => (
                  <th key={idx} className="py-2.5 px-3 font-semibold text-center">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.skill_gap_heatmap.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-800 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                    <span>{row.skill}</span>
                  </td>
                  {Object.entries(row.months).map(([month, metric], mIdx) => (
                    <td key={mIdx} className="py-2 px-2 text-center">
                      <div 
                        title={`Demand: ${metric.demand}h | Supply: ${metric.supply}h | Net Gap: ${metric.gap}h`}
                        className={`py-1.5 px-2 rounded-lg border text-[11px] transition-all cursor-pointer hover:shadow-xs ${getHeatmapColor(metric.status)}`}
                      >
                        <div>{metric.status}</div>
                        <div className="text-[10px] opacity-75 font-mono mt-0.5">
                          {metric.gap > 0 ? `+${metric.gap}h` : `${metric.gap}h`}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4: Top Skill Gaps Table & Upcoming Projects View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skill Gaps */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Critical Skill Shortages & Root Causes</h2>
              <p className="text-xs text-slate-500">Identified bottlenecks with project impact</p>
            </div>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center"
            >
              Optimization Plans <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {data.top_skill_gaps.map((gap, gIdx) => (
              <div 
                key={gIdx}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-300 bg-slate-50/40 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xs text-slate-900">{gap.skill}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                      gap.status === 'Critical Gap' 
                        ? 'bg-rose-100 text-rose-700 border-rose-200' 
                        : gap.status === 'Moderate Gap'
                          ? 'bg-amber-100 text-amber-700 border-amber-200'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}>
                      {gap.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-rose-600 font-mono">
                    +{gap.gap_hours} hrs deficit
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Demand: <strong className="text-slate-700">{gap.required_hours}h</strong></span>
                  <span>Available: <strong className="text-slate-700">{gap.available_hours}h</strong></span>
                  {gap.shortage_date && (
                    <span className="text-amber-700 font-medium">Shortage: {gap.shortage_date}</span>
                  )}
                </div>

                {gap.affected_projects && gap.affected_projects.length > 0 && (
                  <div className="text-[11px] text-slate-600 pt-1.5 border-t border-slate-200/60 flex items-center space-x-1">
                    <span className="text-slate-400">Impacting:</span>
                    <span className="font-medium text-slate-700 truncate">
                      {gap.affected_projects.slice(0, 3).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Projects Snapshot */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Key Projects & Capacity Risk</h2>
              <p className="text-xs text-slate-500">Pipeline & active initiatives needing resources</p>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center"
            >
              All Projects <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {data.upcoming_projects.slice(0, 5).map((prj, pIdx) => (
              <div 
                key={pIdx}
                onClick={() => onSelectProject && onSelectProject(prj)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-400 hover:shadow-xs bg-white cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h3 className="font-semibold text-xs text-slate-900">{prj.name}</h3>
                    <p className="text-[11px] text-slate-500">{prj.client}</p>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      prj.capacity_risk === 'Critical' 
                        ? 'bg-rose-100 text-rose-700' 
                        : prj.capacity_risk === 'High'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {prj.capacity_risk} Risk
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                      {prj.priority}
                    </span>
                  </div>
                </div>

                {/* Tags for required skills */}
                <div className="flex flex-wrap gap-1 my-2">
                  {Object.keys(prj.required_skills).slice(0, 4).map((s, sIdx) => (
                    <span 
                      key={sIdx}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        prj.skill_gaps?.includes(s) 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold' 
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {s} {prj.skill_gaps?.includes(s) && '⚠️'}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-100">
                  <span>Effort: <strong className="text-slate-700">{prj.estimated_effort_hours.toLocaleString()} hrs</strong></span>
                  <span>Timeline: {prj.start_date} → {prj.end_date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
