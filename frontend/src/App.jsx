import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import WorkforceCopilotDrawer from './components/WorkforceCopilotDrawer';

// Pages
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import ProjectsPage from './pages/ProjectsPage';
import WorkloadCapacityPage from './pages/WorkloadCapacityPage';
import SkillsMatrixPage from './pages/SkillsMatrixPage';
import LeaveAvailabilityPage from './pages/LeaveAvailabilityPage';
import ScenarioSimulatorPage from './pages/ScenarioSimulatorPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ReportsPage from './pages/ReportsPage';

// Modals
import EmployeeDetailModal from './components/EmployeeDetailModal';
import ProjectDetailModal from './components/ProjectDetailModal';

import { resetDatabase } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleResetData = async () => {
    if (!window.confirm("Reset dataset back to baseline enterprise figures?")) return;
    setIsResetting(true);
    try {
      await resetDatabase();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert("Error resetting database: " + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onToggleCopilot={() => setCopilotOpen(!copilotOpen)}
        copilotOpen={copilotOpen}
        onResetData={handleResetData}
        isResetting={isResetting}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Center Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-65px)]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardPage
                key={refreshKey}
                setActiveTab={setActiveTab}
                onSelectEmployee={setSelectedEmployee}
                onSelectProject={setSelectedProject}
                onOpenCopilot={() => setCopilotOpen(true)}
              />
            )}

            {activeTab === 'employees' && (
              <EmployeesPage
                key={refreshKey}
                onSelectEmployee={setSelectedEmployee}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsPage
                key={refreshKey}
                onSelectProject={setSelectedProject}
              />
            )}

            {activeTab === 'capacity' && (
              <WorkloadCapacityPage
                key={refreshKey}
                onOpenCopilot={() => setCopilotOpen(true)}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsMatrixPage
                key={refreshKey}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'leave' && (
              <LeaveAvailabilityPage
                key={refreshKey}
              />
            )}

            {activeTab === 'scenario' && (
              <ScenarioSimulatorPage
                key={refreshKey}
                onOpenCopilot={() => setCopilotOpen(true)}
              />
            )}

            {activeTab === 'recommendations' && (
              <RecommendationsPage
                key={refreshKey}
                onOpenCopilot={() => setCopilotOpen(true)}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsPage
                key={refreshKey}
              />
            )}
          </div>
        </main>
      </div>

      {/* Slide-over Workforce Copilot Drawer */}
      <WorkforceCopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
      />

      {/* Standalone modals */}
      {selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
