import React from 'react';
import { 
  Bot, 
  Sparkles, 
  RotateCcw, 
  Calendar, 
  Bell, 
  Building2, 
  Search,
  CheckCircle2
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  onToggleCopilot, 
  copilotOpen, 
  onResetData, 
  isResetting 
}) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">Workforce Copilot</span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 rounded-full">
                AI Capacity Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">Intelligent Workforce Capacity & Hiring Optimization</p>
          </div>
        </div>

        {/* Middle Stats & Planning Cycle */}
        <div className="hidden lg:flex items-center space-x-4 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600">
          <div className="flex items-center space-x-1.5 font-medium text-slate-700">
            <Calendar className="w-4 h-4 text-brand-600" />
            <span>Cycle: Q4 2026 – Q1 2027</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center space-x-1 text-slate-600">
            <span className="font-semibold text-slate-800">120</span> Employees
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center space-x-1 text-slate-600">
            <span className="font-semibold text-slate-800">16</span> Projects
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Reset Demo Data button */}
          <button
            onClick={onResetData}
            disabled={isResetting}
            title="Reset dataset back to hackathon baseline"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-brand-600' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Reset Baseline</span>
          </button>

          {/* AI Workforce Copilot Button */}
          <button
            onClick={onToggleCopilot}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-medium text-xs transition-all shadow-sm ${
              copilotOpen 
                ? 'bg-brand-700 text-white ring-2 ring-brand-400/50 shadow-brand-500/25' 
                : 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:from-brand-700 hover:to-indigo-700 shadow-brand-600/20'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Workforce Copilot</span>
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
              AI
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
