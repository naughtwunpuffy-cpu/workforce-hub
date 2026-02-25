const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const DB_PATH = path.join(dataDir, 'database.json');

const defaultDB = {
  users: [], labour_overview: [], department_headcount: [], planned_vs_actual: [],
  recruitment: [], promotions_transfers: [], critical_skills: [], employee_relations: [],
  shaft_focus: [], kpis: [], commentary: []
};

let _db = null;
let _nextId = 1;

function loadDB() {
  if (_db) return _db;
  try {
    if (fs.existsSync(DB_PATH)) {
      _db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
      _nextId = 1;
      Object.values(_db).forEach(table => {
        if (Array.isArray(table)) table.forEach(row => { if (row.id >= _nextId) _nextId = row.id + 1; });
      });
    } else {
      _db = JSON.parse(JSON.stringify(defaultDB));
    }
  } catch { _db = JSON.parse(JSON.stringify(defaultDB)); }
  return _db;
}

function saveDB() { fs.writeFileSync(DB_PATH, JSON.stringify(_db, null, 2)); }
function nextId() { return _nextId++; }

const db = {
  getAll(table, filter) {
    const data = loadDB();
    if (!data[table]) return [];
    if (!filter) return data[table];
    return data[table].filter(row => Object.entries(filter).every(([k, v]) => row[k] === v));
  },
  getOne(table, filter) { return this.getAll(table, filter)[0] || null; },
  insert(table, record) {
    const data = loadDB();
    if (!data[table]) data[table] = [];
    const row = { id: nextId(), ...record, created_at: new Date().toISOString() };
    data[table].push(row);
    saveDB();
    return row;
  },
  count(table, filter) { return this.getAll(table, filter).length; },
  getDistinct(table, field) {
    const data = loadDB();
    if (!data[table]) return [];
    return [...new Set(data[table].map(r => r[field]))].sort().reverse();
  }
};

function initDB() {
  loadDB();
  if (db.count('users') === 0) {
    db.insert('users', { username: 'admin', password: bcrypt.hashSync('admin123', 10), full_name: 'System Administrator', role: 'admin' });
  }
  if (db.count('labour_overview') === 0) seedSampleData();
}

function seedSampleData() {
  const p = '2026-02';
  db.insert('labour_overview', { period: p, category: 'Own Employees', budget: 12500, actual: 11890, variance: -610, variance_pct: -4.9 });
  db.insert('labour_overview', { period: p, category: 'Contractors', budget: 4200, actual: 4050, variance: -150, variance_pct: -3.6 });
  db.insert('labour_overview', { period: p, category: 'Total Combined', budget: 16700, actual: 15940, variance: -760, variance_pct: -4.6 });

  db.insert('department_headcount', { period: p, department: 'Mining Operations', employee_type: 'own', budget: 6800, actual: 6420, variance: -380 });
  db.insert('department_headcount', { period: p, department: 'Engineering', employee_type: 'own', budget: 2100, actual: 2050, variance: -50 });
  db.insert('department_headcount', { period: p, department: 'Processing', employee_type: 'own', budget: 1800, actual: 1720, variance: -80 });
  db.insert('department_headcount', { period: p, department: 'Support Services', employee_type: 'own', budget: 1800, actual: 1700, variance: -100 });
  db.insert('department_headcount', { period: p, department: 'Shaft Sinking', employee_type: 'contractor', budget: 1200, actual: 1150, variance: -50 });
  db.insert('department_headcount', { period: p, department: 'Maintenance', employee_type: 'contractor', budget: 1500, actual: 1450, variance: -50 });
  db.insert('department_headcount', { period: p, department: 'Specialist Services', employee_type: 'contractor', budget: 1500, actual: 1450, variance: -50 });

  db.insert('planned_vs_actual', { period: p, category: 'Own Employees', planned: 12500, actual: 11890, variance: -610, variance_pct: -4.9, prior_month: 11950, mom_change: -60 });
  db.insert('planned_vs_actual', { period: p, category: 'Contractors', planned: 4200, actual: 4050, variance: -150, variance_pct: -3.6, prior_month: 4100, mom_change: -50 });
  db.insert('planned_vs_actual', { period: p, category: 'Combined Total', planned: 16700, actual: 15940, variance: -760, variance_pct: -4.6, prior_month: 16050, mom_change: -110 });

  db.insert('recruitment', { period: p, metric: 'Total New Hires', current_fy_value: 342, prior_fy_value: 289, variance: 53, record_type: 'recruitment' });
  db.insert('recruitment', { period: p, metric: 'Critical Skills Recruited', current_fy_value: 48, prior_fy_value: 35, variance: 13, record_type: 'recruitment' });
  db.insert('recruitment', { period: p, metric: 'Avg Time to Fill (Days)', current_fy_value: 67, prior_fy_value: 78, variance: -11, record_type: 'recruitment' });
  db.insert('recruitment', { period: p, metric: 'Offer Acceptance Rate', current_fy_value: 82, prior_fy_value: 76, variance: 6, record_type: 'recruitment' });
  db.insert('recruitment', { period: p, metric: 'Total Terminations', current_fy_value: 198, prior_fy_value: 210, variance: -12, record_type: 'termination' });
  db.insert('recruitment', { period: p, metric: 'Voluntary Resignations', current_fy_value: 89, prior_fy_value: 95, variance: -6, record_type: 'termination' });
  db.insert('recruitment', { period: p, metric: 'Dismissals', current_fy_value: 42, prior_fy_value: 51, variance: -9, record_type: 'termination' });
  db.insert('recruitment', { period: p, metric: 'Attrition Rate', current_fy_value: 6.2, prior_fy_value: 7.1, variance: -0.9, record_type: 'termination' });

  db.insert('promotions_transfers', { period: p, category: 'Total Promotions', current_fy: 156, prior_fy: 132, variance: 24, record_type: 'promotion' });
  db.insert('promotions_transfers', { period: p, category: 'Management Level', current_fy: 18, prior_fy: 15, variance: 3, record_type: 'promotion' });
  db.insert('promotions_transfers', { period: p, category: 'Supervisory Level', current_fy: 45, prior_fy: 38, variance: 7, record_type: 'promotion' });
  db.insert('promotions_transfers', { period: p, category: 'Operational Level', current_fy: 93, prior_fy: 79, variance: 14, record_type: 'promotion' });
  db.insert('promotions_transfers', { period: p, category: 'Total Transfers', current_fy: 89, prior_fy: 72, variance: 17, record_type: 'transfer' });
  db.insert('promotions_transfers', { period: p, category: 'Inter-Departmental', current_fy: 34, prior_fy: 28, variance: 6, record_type: 'transfer' });
  db.insert('promotions_transfers', { period: p, category: 'Inter-Shaft/Site', current_fy: 38, prior_fy: 30, variance: 8, record_type: 'transfer' });
  db.insert('promotions_transfers', { period: p, category: 'Lateral Moves', current_fy: 17, prior_fy: 14, variance: 3, record_type: 'transfer' });

  db.insert('critical_skills', { period: p, skill_name: 'Engineers/Artisans', required: 320, in_post: 285, vacancy: 35, fill_rate: 89.1, risk_level: 'High' });
  db.insert('critical_skills', { period: p, skill_name: 'Geologists', required: 45, in_post: 38, vacancy: 7, fill_rate: 84.4, risk_level: 'High' });
  db.insert('critical_skills', { period: p, skill_name: 'Metallurgists', required: 28, in_post: 25, vacancy: 3, fill_rate: 89.3, risk_level: 'Medium' });
  db.insert('critical_skills', { period: p, skill_name: 'Mine Overseers', required: 85, in_post: 78, vacancy: 7, fill_rate: 91.8, risk_level: 'Medium' });
  db.insert('critical_skills', { period: p, skill_name: 'Shift Supervisors', required: 190, in_post: 172, vacancy: 18, fill_rate: 90.5, risk_level: 'High' });

  db.insert('employee_relations', { period: p, er_category: 'Disciplinary Cases', opened: 45, resolved: 38, pending: 12, prior_month: 42 });
  db.insert('employee_relations', { period: p, er_category: 'Grievances', opened: 23, resolved: 19, pending: 8, prior_month: 20 });
  db.insert('employee_relations', { period: p, er_category: 'CCMA Referrals', opened: 8, resolved: 5, pending: 6, prior_month: 7 });
  db.insert('employee_relations', { period: p, er_category: 'Incapacity Cases', opened: 12, resolved: 9, pending: 5, prior_month: 10 });
  db.insert('employee_relations', { period: p, er_category: 'Absenteeism Cases', opened: 67, resolved: 52, pending: 22, prior_month: 58 });

  db.insert('shaft_focus', { period: p, shaft_name: '1 Shaft', headcount: 2850, vacancies: 145, attrition_pct: 7.2, er_cases: 18, key_issue: 'High attrition in stoping crews' });
  db.insert('shaft_focus', { period: p, shaft_name: '4 Shaft', headcount: 2200, vacancies: 98, attrition_pct: 5.8, er_cases: 12, key_issue: 'Critical skills shortage - artisans' });
  db.insert('shaft_focus', { period: p, shaft_name: '6 Shaft', headcount: 1950, vacancies: 112, attrition_pct: 8.1, er_cases: 22, key_issue: 'Elevated absenteeism rate' });
  db.insert('shaft_focus', { period: p, shaft_name: '10 Shaft', headcount: 2680, vacancies: 87, attrition_pct: 4.5, er_cases: 9, key_issue: 'Development crew understaffed' });
  db.insert('shaft_focus', { period: p, shaft_name: '11 Shaft', headcount: 2310, vacancies: 134, attrition_pct: 6.9, er_cases: 15, key_issue: 'ER backlog - disciplinary cases' });
  db.insert('shaft_focus', { period: p, shaft_name: '14 Shaft', headcount: 1890, vacancies: 76, attrition_pct: 5.2, er_cases: 8, key_issue: 'Contractor ratio above target' });

  db.insert('kpis', { period: p, kpi_name: 'Absenteeism Rate', actual_value: 6.8, target_value: 5.0, unit: '%' });
  db.insert('kpis', { period: p, kpi_name: 'Labour Turnover', actual_value: 6.2, target_value: 5.5, unit: '%' });
  db.insert('kpis', { period: p, kpi_name: 'Training Compliance', actual_value: 87, target_value: 95, unit: '%' });
  db.insert('kpis', { period: p, kpi_name: 'Vacancy Rate', actual_value: 4.6, target_value: 3.0, unit: '%' });
  db.insert('kpis', { period: p, kpi_name: 'Time to Fill', actual_value: 67, target_value: 45, unit: 'days' });
  db.insert('kpis', { period: p, kpi_name: 'ER Resolution Rate', actual_value: 79, target_value: 90, unit: '%' });
  db.insert('kpis', { period: p, kpi_name: 'Overtime %', actual_value: 8.3, target_value: 7.0, unit: '%' });
  db.insert('kpis', { period: p, kpi_name: 'Critical Fill Rate', actual_value: 89, target_value: 95, unit: '%' });

  db.insert('commentary', { period: p, section: 'labour_overview', content: 'Total headcount remains 4.6% below budget driven primarily by mining operations vacancies. Recruitment pipeline active with 85 offers pending acceptance.' });
  db.insert('commentary', { period: p, section: 'contractors_vs_own', content: 'Contractor ratio at 25.4% - marginally above the 25% strategic target. Shaft sinking contractors performing within scope. Recommend review of maintenance contractor renewal terms.' });
  db.insert('commentary', { period: p, section: 'planned_vs_actual', content: 'Month-on-month decline of 110 employees driven by natural attrition outpacing recruitment. Engineering fill rate improving but mining operations remains the key concern.' });
  db.insert('commentary', { period: p, section: 'labour_cost', content: 'Labour cost 3.2% under budget due to vacancies. Overtime spend trending upward at 8.3% vs 7% target - concentrated in 6 Shaft and 1 Shaft.' });
  db.insert('commentary', { period: p, section: 'recruitment_pipeline', content: '42 open positions in active recruitment. 18 offers extended pending acceptance. Average time-to-fill improved by 11 days YoY. Critical skills pipeline strengthened with graduate intake program.' });
  db.insert('commentary', { period: p, section: 'risks', content: '1. 6 Shaft absenteeism at 9.2% requires intervention - HR team deploying wellness program by March.\n2. Artisan pipeline insufficient for FY27 requirements - apprenticeship intake to increase by 20%.\n3. CCMA referral backlog growing - external legal support contracted to clear within 60 days.' });
  db.insert('commentary', { period: p, section: 'recruitment_terminations', content: 'Recruitment pace improved with 342 YTD hires vs 289 prior year. Voluntary resignation rate declining, suggesting improved retention efforts. Dismissals down 17.6% YoY.' });
  db.insert('commentary', { period: p, section: 'promotions_transfers', content: 'Promotion rate increased 18% YoY reflecting improved succession planning. Inter-shaft transfers up, supporting operational flexibility. Graduate-to-permanent conversion rate at 78%.' });
  db.insert('commentary', { period: p, section: 'critical_skills', content: 'Engineers/Artisans remain highest risk with 89.1% fill rate. Geologist recruitment challenging due to market scarcity. Mine Overseer pipeline strengthened through internal development program.' });
  db.insert('commentary', { period: p, section: 'employee_relations', content: 'ER caseload up 8% MoM driven by absenteeism cases. Resolution rate at 79% below 90% target. CCMA referral increase requires focused legal intervention. Disciplinary turnaround improved to 14 days average.' });
  db.insert('commentary', { period: p, section: 'shaft_focus', content: '1. 6 Shaft: Deploy targeted wellness and absenteeism management program - HR Manager to lead, deadline 31 March.\n2. 1 Shaft: Recruit 12 stoping crew members through accelerated pipeline - Recruitment Lead, deadline 15 March.\n3. 11 Shaft: Clear ER backlog through weekly dedicated hearings - ER Manager, deadline 28 February.' });
}

module.exports = { db, initDB };
