import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { fetchProjects } from '../services/api';
import ProjectDetailModal from '../components/ProjectDetailModal';

export default function ProjectsPage({ onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [activeModalProject, setActiveModalProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, [selectedStatus, selectedPriority]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects({
        status: selectedStatus,
        priority: selectedPriority,
        search: search
      });
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProjects();
  };

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
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Portfolio</h1>
          <p className="text-sm text-slate-500">
            16 active and upcoming enterprise client engagements mapped to technical capacity requirements
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium">
            Active Portfolio: <strong className="text-slate-900">{projects.length} Projects</strong>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project name or client..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Planning">Planning</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </form>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-2">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500">Loading project portfolio...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((prj) => (
            <div
              key={prj.id}
              onClick={() => setActiveModalProject(prj)}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-brand-400 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 leading-tight">{prj.name}</h3>
                    <span className="text-[10px] text-slate-400">{prj.client} • {prj.id}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getRiskBadge(prj.capacity_risk)}`}>
                    {prj.capacity_risk} Risk
                  </span>
                </div>

                {/* Progress bar */}
                <div className="my-3 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Delivered: {prj.delivered_hours}h</span>
                    <span>Total: {prj.estimated_effort_hours.toLocaleString()}h</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-brand-600 h-1.5 rounded-full"
                      style={{
                        width: `${Math.round((prj.delivered_hours / Math.max(1, prj.estimated_effort_hours)) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {Object.keys(prj.required_skills).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        prj.skill_gaps?.includes(skill)
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {skill} {prj.skill_gaps?.includes(skill) && '⚠️'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{prj.start_date} → {prj.end_date}</span>
                <span className="text-brand-600 font-semibold flex items-center hover:underline">
                  Details <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {activeModalProject && (
        <ProjectDetailModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      )}
    </div>
  );
}
