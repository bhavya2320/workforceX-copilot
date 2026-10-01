import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Play, 
  TrendingUp, 
  UserPlus, 
  Users, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  ArrowRight, 
  RotateCcw,
  Briefcase,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { runScenario } from '../services/api';

const SCENARIO_PRESETS = [
  {
    id: 'win_projects',
    title: 'Win 3 New Projects',
    badge: 'STAR DEMO',
    desc: 'Simulate closing 3 enterprise client deals (+2,400 hrs) in Python, ML & DevOps.',
    icon: Briefcase,
    type: 'win_projects',
    defaults: { number_of_projects: 3, additional_effort_hours: 2400, skills: ['Python', 'Machine Learning', 'DevOps'] }
  },
  {
    id: 'attrition',
    title: 'Senior Attrition (6 Engineers)',
    badge: 'Risk Analysis',
    desc: 'Simulate departure of 6 critical tech leads & senior staff across teams.',
    icon: Users,
    type: 'attrition',
    defaults: { attrition_count: 6 }
  },
  {
    id: 'increased_leave',
    title: 'Peak Holiday Season (+25% Leave)',
    badge: 'Seasonal',
    desc: 'Simulate December year-end holiday surge reducing workforce capacity.',
    icon: Calendar,
    type: 'increased_leave',
    defaults: { leave_increase_pct: 25 }
  },
  {
    id: 'reduced_productivity',
    title: 'Tech Debt Impact (-15% Velocity)',
    badge: 'Efficiency',
    desc: 'Simulate delivery friction caused by legacy code migrations.',
    icon: AlertTriangle,
    type: 'reduced_productivity',
    defaults: { productivity_drop_pct: 15 }
  },
  {
    id: 'lose_projects',
    title: 'Project Cancellations (-2 Projects)',
    badge: 'Contraction',
    desc: 'Simulate client budget freezes and freeing up staff capacity.',
    icon: RotateCcw,
    type: 'lose_projects',
    defaults: {}
  }
];

export default function ScenarioSimulatorPage({ onOpenCopilot }) {
  const [selectedType, setSelectedType] = useState('win_projects');
  const [numProjects, setNumProjects] = useState(3);
  const [effortHours, setEffortHours] = useState(2400);
  const [startDate, setStartDate] = useState('2026-11-01');
  const [priority, setPriority] = useState('Critical');
  const [selectedSkills, setSelectedSkills] = useState(['Python', 'Machine Learning', 'DevOps']);
  const [attritionCount, setAttritionCount] = useState(6);
  const [leavePct, setLeavePct] = useState(25);
  const [prodDropPct, setProdDropPct] = useState(15);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Automatically execute the default "Win 3 New Projects" demo on mount
  useEffect(() => {
    executeSimulation('win_projects');
  }, []);

  const handleSelectPreset = (preset) => {
    setSelectedType(preset.type);
    if (preset.type === 'win_projects') {
      setNumProjects(3);
      setEffortHours(2400);
    } else if (preset.type === 'attrition') {
      setAttritionCount(6);
    } else if (preset.type === 'increased_leave') {
      setLeavePct(25);
    } else if (preset.type === 'reduced_productivity') {
      setProdDropPct(15);
    }
  };

  const executeSimulation = async (typeOverride) => {
    setLoading(true);
    setError(null);
    const activeType = typeOverride || selectedType;

    const payload = {
      scenario_type: activeType,
      number_of_projects: parseInt(numProjects) || 3,
      additional_effort_hours: parseFloat(effortHours) || 2400.0,
      start_date: startDate,
      target_skills: selectedSkills,
      attrition_count: parseInt(attritionCount) || 5,
      leave_increase_pct: parseFloat(leavePct) || 25.0,
      productivity_drop_pct: parseFloat(prodDropPct) || 15.0,
      priority: priority
    };

    try {
      const data = await runScenario(payload);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Simulation execution failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter(s => s !== skill));
      }
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title & Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workforce Scenario Simulator</h1>
            <span className="px-2.5 py-0.5 text-xs font-extrabold bg-amber-400 text-slate-950 rounded-full animate-pulse">
              HACKATHON DEMO FEATURE
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Simulate future business events: project wins, client cancellations, attrition, and supply shocks.
          </p>
        </div>

        {/* Ask Copilot Button */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center space-x-2 px-3.5 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-lg text-xs font-semibold transition-colors"
        >
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>Ask Copilot: "Can we avoid hiring?"</span>
        </button>
      </div>

      {/* Preset Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {SCENARIO_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isSelected = selectedType === preset.type;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-brand-50/70 border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                  preset.badge === 'STAR DEMO' 
                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {preset.badge}
                </span>
              </div>
              <h3 className="font-semibold text-xs text-slate-900 mb-1">{preset.title}</h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{preset.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Simulation Controls Form */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold text-slate-900">Configure Scenario Parameters</h2>
          </div>
          <span className="text-xs text-slate-400">Deterministic calculation engine</span>
        </div>

        {/* Conditional Inputs based on Selected Preset */}
        {(selectedType === 'win_projects' || selectedType === 'custom') && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Number of New Projects: <span className="text-brand-600 font-bold">{numProjects}</span>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={numProjects}
                onChange={(e) => setNumProjects(e.target.value)}
                className="w-full accent-brand-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 Project</span>
                <span>8 Projects</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Effort Hours: <span className="text-brand-600 font-bold">{effortHours.toLocaleString()}h</span>
              </label>
              <input
                type="range"
                min="800"
                max="5000"
                step="200"
                value={effortHours}
                onChange={(e) => setEffortHours(e.target.value)}
                className="w-full accent-brand-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>800h</span>
                <span>5,000h</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contract Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="Critical">Critical (SLA Backed)</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </div>
          </div>
        )}

        {selectedType === 'attrition' && (
          <div className="max-w-md mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Number of Departing Engineers: <span className="text-rose-600 font-bold">{attritionCount}</span>
            </label>
            <input
              type="range"
              min="1"
              max="15"
              value={attritionCount}
              onChange={(e) => setAttritionCount(e.target.value)}
              className="w-full accent-rose-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 Engineer</span>
              <span>15 Engineers</span>
            </div>
          </div>
        )}

        {selectedType === 'increased_leave' && (
          <div className="max-w-md mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Leave Increase: <span className="text-brand-600 font-bold">+{leavePct}%</span>
            </label>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={leavePct}
              onChange={(e) => setLeavePct(e.target.value)}
              className="w-full accent-brand-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        )}

        {selectedType === 'reduced_productivity' && (
          <div className="max-w-md mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Velocity Loss: <span className="text-amber-600 font-bold">-{prodDropPct}%</span>
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={prodDropPct}
              onChange={(e) => setProdDropPct(e.target.value)}
              className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        )}

        {/* Skills Selector for Project Win */}
        {(selectedType === 'win_projects' || selectedType === 'custom') && (
          <div className="mb-4">
            <span className="block text-xs font-semibold text-slate-700 mb-1.5">Required Skill Demands</span>
            <div className="flex flex-wrap gap-1.5">
              {['Python', 'Machine Learning', 'DevOps', 'Cloud (AWS/Azure)', 'React', 'Kubernetes', 'Java'].map((skill) => {
                const active = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      active
                        ? 'bg-brand-600 text-white border-brand-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {skill} {active && '✓'}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Run Simulation Action Button */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-500">
            Clicking will re-compute capacity, recalculate gaps, and solve for optimal hire/reskill/redistribute ratios.
          </p>
          <button
            onClick={() => executeSimulation()}
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-brand-600/25 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-white" />
                <span>RUN SIMULATION</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulation Results Display */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Result Banner */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white border border-slate-800 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold uppercase">
                    Simulation Executed
                  </span>
                  <span className="text-xs text-slate-400">Timeline Impact</span>
                </div>
                <h2 className="text-lg font-bold text-white">{result.scenario_name}</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">{result.description}</p>
              </div>

              {/* Deadline Callout */}
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 text-right">
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                  Recommended Hiring Deadline
                </span>
                <span className="text-sm font-extrabold text-white flex items-center justify-end space-x-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{result.recommended_hiring_deadline}</span>
                </span>
                <span className="text-[10px] text-slate-300 block mt-0.5">
                  Accounts for 45-day recruitment notice
                </span>
              </div>
            </div>
          </div>

          {/* Key Simulation Impact Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Added Demand */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Additional Demand
              </span>
              <div className="text-2xl font-bold text-brand-600">
                {result.demand_delta_hours >= 0 ? `+${result.demand_delta_hours.toLocaleString()}` : result.demand_delta_hours.toLocaleString()} hrs
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                New peak monthly load: {result.new_demand_hours.toLocaleString()} hrs
              </p>
            </div>

            {/* Utilization Surge */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                New Org Utilization
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-rose-600">{result.new_utilization_pct}%</span>
                <span className="text-xs text-slate-400 line-through">from {result.current_utilization_pct}%</span>
              </div>
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {result.new_utilization_pct > 100 ? 'Severe Overload Risk' : 'High Saturation'}
              </p>
            </div>

            {/* Critical Skills Affected */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Critical Skills Bottleneck
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {result.critical_skills_affected.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Budget Impact */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Estimated Hiring Budget
              </span>
              <div className="text-xl font-bold text-slate-900">{result.estimated_hiring_cost_range}</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Reskilling investment: {result.estimated_reskilling_cost}
              </p>
            </div>
          </div>

          {/* Triple-Pillar Recommendation Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recommended Optimization Solution</h3>
                <p className="text-xs text-slate-500">
                  Balanced approach combining external hiring, internal upskilling, and zero-cost redistribution
                </p>
              </div>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Hire Pillar */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-800">1. External Hire</span>
                    <span className="p-1 rounded bg-rose-100 text-rose-700">
                      <UserPlus className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-rose-700 mb-1">{result.recommended_hires}</div>
                  <p className="text-xs font-semibold text-rose-900">Specialist Engineers</p>
                  <p className="text-[11px] text-rose-700/90 mt-2 leading-relaxed">
                    Dedicated talent for Python, ML, and Cloud architecture.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-rose-200 text-[11px] font-medium text-rose-800">
                  Est. Cost: {result.estimated_hiring_cost_range}
                </div>
              </div>

              {/* Reskill Pillar */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">2. Internal Reskill</span>
                    <span className="p-1 rounded bg-amber-100 text-amber-700">
                      <Sparkles className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-amber-700 mb-1">{result.recommended_reskills}</div>
                  <p className="text-xs font-semibold text-amber-900">Adjacent Engineers</p>
                  <p className="text-[11px] text-amber-700/90 mt-2 leading-relaxed">
                    6-week accelerated track from Java/QA to Python & Machine Learning.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-amber-200 text-[11px] font-medium text-amber-800">
                  Training Investment: {result.estimated_reskilling_cost}
                </div>
              </div>

              {/* Redistribute Pillar */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">3. Redistribute</span>
                    <span className="p-1 rounded bg-emerald-100 text-emerald-700">
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-700 mb-1">{result.recommended_redistributions}</div>
                  <p className="text-xs font-semibold text-emerald-900">Under-utilized Staff</p>
                  <p className="text-[11px] text-emerald-700/90 mt-2 leading-relaxed">
                    Instant reallocation of spare hours from low-demand project teams.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-emerald-200 text-[11px] font-medium text-emerald-800">
                  Direct Cost: ₹0 (Immediate unlock)
                </div>
              </div>
            </div>

            {/* Monthly Capacity vs Simulated Demand Chart */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-700 mb-2">Monthly Demand Comparison (Base vs Simulated)</h4>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.monthly_comparison} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      formatter={(val, name) => [`${val.toLocaleString()} hrs`, name]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="base_demand" name="Baseline Demand (hrs)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="simulated_demand" name="Simulated Demand (hrs)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="available_capacity" name="Available Capacity (hrs)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Action Plan & Specific Candidates Identified */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Step-by-Step Action Plan */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Executive Action Plan</span>
              </h3>
              <div className="space-y-2.5">
                {result.action_plan.map((step, sIdx) => (
                  <div key={sIdx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-800 leading-relaxed">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Identified Internal Talent Matches */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Identified Internal Candidates</span>
              </h3>

              <div className="space-y-3">
                {/* Reskill Candidates */}
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                    Ready for Reskilling:
                  </span>
                  <div className="space-y-1.5">
                    {result.reskill_candidates.map((c, cIdx) => (
                      <div key={cIdx} className="flex items-center justify-between p-2 rounded-lg bg-amber-50/50 border border-amber-100 text-xs">
                        <div>
                          <strong className="text-slate-800">{c.name}</strong> <span className="text-slate-400">({c.team})</span>
                        </div>
                        <div className="flex items-center space-x-1 text-[11px] text-amber-800 font-medium">
                          <span>Target:</span>
                          <span className="px-1.5 py-0.5 bg-amber-100 rounded font-bold">{c.target_skill}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Redistribute Candidates */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                    Ready for Workload Redistribution:
                  </span>
                  <div className="space-y-1.5">
                    {result.redistribute_candidates.map((c, cIdx) => (
                      <div key={cIdx} className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs">
                        <div>
                          <strong className="text-slate-800">{c.name}</strong> <span className="text-slate-400">({c.team})</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px]">
                          <span className="text-slate-500">Util: {c.current_utilization}</span>
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                            +{c.available_hours}h free
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
