const BASE_URL = 'http://localhost:8000/api';

export async function fetchDashboard() {
  const res = await fetch(`${BASE_URL}/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
  return res.json();
}

export async function fetchEmployees(params = {}) {
  const query = new URLSearchParams();
  if (params.team) query.append('team', params.team);
  if (params.role) query.append('role', params.role);
  if (params.skill) query.append('skill', params.skill);
  if (params.utilization_status) query.append('utilization_status', params.utilization_status);
  if (params.search) query.append('search', params.search);

  const res = await fetch(`${BASE_URL}/employees?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
}

export async function fetchEmployee(id) {
  const res = await fetch(`${BASE_URL}/employees/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch employee ${id}`);
  return res.json();
}

export async function fetchProjects(params = {}) {
  const query = new URLSearchParams();
  if (params.status) query.append('status', params.status);
  if (params.priority) query.append('priority', params.priority);
  if (params.search) query.append('search', params.search);

  const res = await fetch(`${BASE_URL}/projects?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchProject(id) {
  const res = await fetch(`${BASE_URL}/projects/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch project ${id}`);
  return res.json();
}

export async function fetchCapacity() {
  const res = await fetch(`${BASE_URL}/capacity`);
  if (!res.ok) throw new Error('Failed to fetch capacity metrics');
  return res.json();
}

export async function fetchSkillGaps() {
  const res = await fetch(`${BASE_URL}/skill-gaps`);
  if (!res.ok) throw new Error('Failed to fetch skill gaps');
  return res.json();
}

export async function fetchRecommendations() {
  const res = await fetch(`${BASE_URL}/recommendations`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}

export async function runScenario(scenarioData) {
  const res = await fetch(`${BASE_URL}/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scenarioData)
  });
  if (!res.ok) throw new Error('Failed to run scenario simulation');
  return res.json();
}

export async function chatWithCopilot(query) {
  const res = await fetch(`${BASE_URL}/copilot/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error('Failed to communicate with Workforce Copilot');
  return res.json();
}

export async function fetchReports() {
  const res = await fetch(`${BASE_URL}/reports`);
  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
}

export async function resetDatabase() {
  const res = await fetch(`${BASE_URL}/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset database');
  return res.json();
}
