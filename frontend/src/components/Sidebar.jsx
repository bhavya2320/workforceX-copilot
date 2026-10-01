import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Gauge, 
  Layers, 
  CalendarOff, 
  Sliders, 
  Sparkles, 
  FileText,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users, badge: '120' },
    { id: 'projects', label: 'Projects', icon: Briefcase, badge: '16' },
    { id: 'capacity', label: 'Workload & Capacity', icon: Gauge },
    { id: 'skills', label: 'Skills Matrix & Gaps', icon: Layers, alertDot: true },
    { id: 'leave', label: 'Leave & Availability', icon: CalendarOff },
    { 
      id: 'scenario', 
      label: 'Scenario Simulator', 
      icon: Sliders, 
      highlight: true, 
      badge: 'WOW DEMO' 
    },
    { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles, badge: 'Hire/Reskill' },
    { id: 'reports', label: 'Planning Reports', icon: FileText }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800">
      {/* Platform Title in sidebar */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <BrainCircuit className="w-4 h-4 text-brand-400" />
          <span>Workforce Intelligence</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold' 
                  : item.highlight 
                    ? 'text-brand-300 hover:bg-slate-800/80 bg-brand-950/40 border border-brand-800/40' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-brand-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              
              <div className="flex items-center space-x-1.5">
                {item.alertDot && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                )}
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    item.highlight 
                      ? 'bg-amber-400 text-slate-950 font-extrabold animate-pulse'
                      : isActive 
                        ? 'bg-brand-700 text-brand-100' 
                        : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Quick Summary Pill at bottom */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400">Avg Utilization</span>
          <span className="font-semibold text-emerald-400">81.8%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '81.8%' }}></div>
        </div>
        <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>4 Skill Gaps</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>6 Hires Req.</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
