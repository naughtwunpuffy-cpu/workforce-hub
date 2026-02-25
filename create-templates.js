const XLSX = require('./backend/node_modules/xlsx');
const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, 'Excel_Templates');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function createWorkbook(sheets) {
  const wb = XLSX.utils.book_new();
  sheets.forEach(({ name, data }) => {
    const ws = XLSX.utils.aoa_to_sheet(data);
    // Set column widths
    const maxCols = Math.max(...data.map(r => r.length));
    ws['!cols'] = Array.from({ length: maxCols }, () => ({ wch: 18 }));
    ws['!cols'][0] = { wch: 28 };
    XLSX.utils.book_append_sheet(wb, ws, name);
  });
  return wb;
}

// ============================================
// 1. LABOUR OVERVIEW
// ============================================
const labourWB = createWorkbook([
  {
    name: 'Labour Overview',
    data: [
      ['Category', 'Budget', 'Actual', 'Variance', 'Var %'],
      ['Own Employees', 12500, 11890, -610, -4.9],
      ['Contractors', 4200, 4050, -150, -3.6],
      ['Total Combined', 16700, 15940, -760, -4.6],
    ]
  },
  {
    name: 'Own Employees by Dept',
    data: [
      ['Department', 'Employee_Type', 'Budget', 'Actual', 'Variance'],
      ['Mining Operations', 'own', 6800, 6420, -380],
      ['Engineering', 'own', 2100, 2050, -50],
      ['Processing', 'own', 1800, 1720, -80],
      ['Support Services', 'own', 1800, 1700, -100],
    ]
  },
  {
    name: 'Contractors by Category',
    data: [
      ['Department', 'Employee_Type', 'Budget', 'Actual', 'Variance'],
      ['Shaft Sinking', 'contractor', 1200, 1150, -50],
      ['Maintenance', 'contractor', 1500, 1450, -50],
      ['Specialist Services', 'contractor', 1500, 1450, -50],
    ]
  },
  {
    name: 'Planned vs Actual',
    data: [
      ['Category', 'Planned', 'Actual', 'Variance', 'Var %', 'Prior Month', 'MoM Change'],
      ['Own Employees', 12500, 11890, -610, -4.9, 11950, -60],
      ['Contractors', 4200, 4050, -150, -3.6, 4100, -50],
      ['Combined Total', 16700, 15940, -760, -4.6, 16050, -110],
    ]
  }
]);
XLSX.writeFile(labourWB, path.join(outDir, '01_Labour_Overview.xlsx'));
console.log('Created: 01_Labour_Overview.xlsx');

// ============================================
// 2. RECRUITMENT & TERMINATIONS
// ============================================
const recruitWB = createWorkbook([
  {
    name: 'New Recruits',
    data: [
      ['Metric', 'Current_FY_Value', 'Prior_FY_Value', 'Variance', 'Record_Type'],
      ['Total New Hires', 342, 289, 53, 'recruitment'],
      ['Critical Skills Recruited', 48, 35, 13, 'recruitment'],
      ['Avg Time to Fill (Days)', 67, 78, -11, 'recruitment'],
      ['Offer Acceptance Rate', 82, 76, 6, 'recruitment'],
    ]
  },
  {
    name: 'Terminations',
    data: [
      ['Metric', 'Current_FY_Value', 'Prior_FY_Value', 'Variance', 'Record_Type'],
      ['Total Terminations', 198, 210, -12, 'termination'],
      ['Voluntary Resignations', 89, 95, -6, 'termination'],
      ['Dismissals', 42, 51, -9, 'termination'],
      ['Attrition Rate', 6.2, 7.1, -0.9, 'termination'],
    ]
  }
]);
XLSX.writeFile(recruitWB, path.join(outDir, '02_Recruitment_Terminations.xlsx'));
console.log('Created: 02_Recruitment_Terminations.xlsx');

// ============================================
// 3. PROMOTIONS & TRANSFERS
// ============================================
const promoWB = createWorkbook([
  {
    name: 'Promotions',
    data: [
      ['Category', 'Current_FY', 'Prior_FY', 'Variance', 'Record_Type'],
      ['Total Promotions', 156, 132, 24, 'promotion'],
      ['Management Level', 18, 15, 3, 'promotion'],
      ['Supervisory Level', 45, 38, 7, 'promotion'],
      ['Operational Level', 93, 79, 14, 'promotion'],
    ]
  },
  {
    name: 'Internal Transfers',
    data: [
      ['Category', 'Current_FY', 'Prior_FY', 'Variance', 'Record_Type'],
      ['Total Transfers', 89, 72, 17, 'transfer'],
      ['Inter-Departmental', 34, 28, 6, 'transfer'],
      ['Inter-Shaft/Site', 38, 30, 8, 'transfer'],
      ['Lateral Moves', 17, 14, 3, 'transfer'],
    ]
  }
]);
XLSX.writeFile(promoWB, path.join(outDir, '03_Promotions_Transfers.xlsx'));
console.log('Created: 03_Promotions_Transfers.xlsx');

// ============================================
// 4. CRITICAL SKILLS
// ============================================
const skillsWB = createWorkbook([
  {
    name: 'Critical Skills',
    data: [
      ['Skill_Name', 'Required', 'In_Post', 'Vacancy', 'Fill_Rate', 'Risk_Level'],
      ['Engineers/Artisans', 320, 285, 35, 89.1, 'High'],
      ['Geologists', 45, 38, 7, 84.4, 'High'],
      ['Metallurgists', 28, 25, 3, 89.3, 'Medium'],
      ['Mine Overseers', 85, 78, 7, 91.8, 'Medium'],
      ['Shift Supervisors', 190, 172, 18, 90.5, 'High'],
    ]
  }
]);
XLSX.writeFile(skillsWB, path.join(outDir, '04_Critical_Skills.xlsx'));
console.log('Created: 04_Critical_Skills.xlsx');

// ============================================
// 5. EMPLOYEE RELATIONS
// ============================================
const erWB = createWorkbook([
  {
    name: 'Employee Relations',
    data: [
      ['ER_Category', 'Opened', 'Resolved', 'Pending', 'Prior_Month'],
      ['Disciplinary Cases', 45, 38, 12, 42],
      ['Grievances', 23, 19, 8, 20],
      ['CCMA Referrals', 8, 5, 6, 7],
      ['Incapacity Cases', 12, 9, 5, 10],
      ['Absenteeism Cases', 67, 52, 22, 58],
    ]
  }
]);
XLSX.writeFile(erWB, path.join(outDir, '05_Employee_Relations.xlsx'));
console.log('Created: 05_Employee_Relations.xlsx');

// ============================================
// 6. SHAFT FOCUS
// ============================================
const shaftWB = createWorkbook([
  {
    name: 'Key Shafts',
    data: [
      ['Shaft_Name', 'Headcount', 'Vacancies', 'Attrition_Pct', 'ER_Cases', 'Key_Issue'],
      ['1 Shaft', 2850, 145, 7.2, 18, 'High attrition in stoping crews'],
      ['4 Shaft', 2200, 98, 5.8, 12, 'Critical skills shortage - artisans'],
      ['6 Shaft', 1950, 112, 8.1, 22, 'Elevated absenteeism rate'],
      ['10 Shaft', 2680, 87, 4.5, 9, 'Development crew understaffed'],
      ['11 Shaft', 2310, 134, 6.9, 15, 'ER backlog - disciplinary cases'],
      ['14 Shaft', 1890, 76, 5.2, 8, 'Contractor ratio above target'],
    ]
  }
]);
XLSX.writeFile(shaftWB, path.join(outDir, '06_Shaft_Focus.xlsx'));
console.log('Created: 06_Shaft_Focus.xlsx');

// ============================================
// 7. HR KPIs
// ============================================
const kpiWB = createWorkbook([
  {
    name: 'KPIs',
    data: [
      ['KPI_Name', 'Actual_Value', 'Target_Value', 'Unit'],
      ['Absenteeism Rate', 6.8, 5.0, '%'],
      ['Labour Turnover', 6.2, 5.5, '%'],
      ['Training Compliance', 87, 95, '%'],
      ['Vacancy Rate', 4.6, 3.0, '%'],
      ['Time to Fill', 67, 45, 'days'],
      ['ER Resolution Rate', 79, 90, '%'],
      ['Overtime %', 8.3, 7.0, '%'],
      ['Critical Fill Rate', 89, 95, '%'],
    ]
  }
]);
XLSX.writeFile(kpiWB, path.join(outDir, '07_HR_KPIs.xlsx'));
console.log('Created: 07_HR_KPIs.xlsx');

// ============================================
// 8. COMMENTARY
// ============================================
const commentaryWB = createWorkbook([
  {
    name: 'Commentary',
    data: [
      ['Section', 'Content'],
      ['labour_overview', 'Total headcount remains 4.6% below budget driven primarily by mining operations vacancies. Recruitment pipeline active with 85 offers pending acceptance.'],
      ['contractors_vs_own', 'Contractor ratio at 25.4% - marginally above the 25% strategic target. Shaft sinking contractors performing within scope. Recommend review of maintenance contractor renewal terms.'],
      ['planned_vs_actual', 'Month-on-month decline of 110 employees driven by natural attrition outpacing recruitment. Engineering fill rate improving but mining operations remains the key concern.'],
      ['labour_cost', 'Labour cost 3.2% under budget due to vacancies. Overtime spend trending upward at 8.3% vs 7% target - concentrated in 6 Shaft and 1 Shaft.'],
      ['recruitment_pipeline', '42 open positions in active recruitment. 18 offers extended pending acceptance. Average time-to-fill improved by 11 days YoY. Critical skills pipeline strengthened with graduate intake program.'],
      ['risks', '1. 6 Shaft absenteeism at 9.2% requires intervention - HR team deploying wellness program by March.\n2. Artisan pipeline insufficient for FY27 requirements - apprenticeship intake to increase by 20%.\n3. CCMA referral backlog growing - external legal support contracted to clear within 60 days.'],
      ['recruitment_terminations', 'Recruitment pace improved with 342 YTD hires vs 289 prior year. Voluntary resignation rate declining, suggesting improved retention efforts. Dismissals down 17.6% YoY.'],
      ['promotions_transfers', 'Promotion rate increased 18% YoY reflecting improved succession planning. Inter-shaft transfers up, supporting operational flexibility. Graduate-to-permanent conversion rate at 78%.'],
      ['critical_skills', 'Engineers/Artisans remain highest risk with 89.1% fill rate. Geologist recruitment challenging due to market scarcity. Mine Overseer pipeline strengthened through internal development program.'],
      ['employee_relations', 'ER caseload up 8% MoM driven by absenteeism cases. Resolution rate at 79% below 90% target. CCMA referral increase requires focused legal intervention. Disciplinary turnaround improved to 14 days average.'],
      ['shaft_focus', '1. 6 Shaft: Deploy targeted wellness and absenteeism management program - HR Manager to lead, deadline 31 March.\n2. 1 Shaft: Recruit 12 stoping crew members through accelerated pipeline - Recruitment Lead, deadline 15 March.\n3. 11 Shaft: Clear ER backlog through weekly dedicated hearings - ER Manager, deadline 28 February.'],
    ]
  }
]);
XLSX.writeFile(commentaryWB, path.join(outDir, '08_Commentary.xlsx'));
console.log('Created: 08_Commentary.xlsx');

// ============================================
// 9. MASTER TEMPLATE - ALL IN ONE
// ============================================
const masterWB = createWorkbook([
  {
    name: 'Labour Overview',
    data: [
      ['Category', 'Budget', 'Actual'],
      ['Own Employees', 12500, 11890],
      ['Contractors', 4200, 4050],
      ['Total Combined', 16700, 15940],
    ]
  },
  {
    name: 'Departments',
    data: [
      ['Department', 'Employee_Type', 'Budget', 'Actual'],
      ['Mining Operations', 'own', 6800, 6420],
      ['Engineering', 'own', 2100, 2050],
      ['Processing', 'own', 1800, 1720],
      ['Support Services', 'own', 1800, 1700],
      ['Shaft Sinking', 'contractor', 1200, 1150],
      ['Maintenance', 'contractor', 1500, 1450],
      ['Specialist Services', 'contractor', 1500, 1450],
    ]
  },
  {
    name: 'Planned vs Actual',
    data: [
      ['Category', 'Planned', 'Actual', 'Prior_Month'],
      ['Own Employees', 12500, 11890, 11950],
      ['Contractors', 4200, 4050, 4100],
      ['Combined Total', 16700, 15940, 16050],
    ]
  },
  {
    name: 'Recruitment',
    data: [
      ['Metric', 'Current_FY_Value', 'Prior_FY_Value', 'Record_Type'],
      ['Total New Hires', 342, 289, 'recruitment'],
      ['Critical Skills Recruited', 48, 35, 'recruitment'],
      ['Avg Time to Fill (Days)', 67, 78, 'recruitment'],
      ['Offer Acceptance Rate', 82, 76, 'recruitment'],
      ['Total Terminations', 198, 210, 'termination'],
      ['Voluntary Resignations', 89, 95, 'termination'],
      ['Dismissals', 42, 51, 'termination'],
      ['Attrition Rate', 6.2, 7.1, 'termination'],
    ]
  },
  {
    name: 'Promotions Transfers',
    data: [
      ['Category', 'Current_FY', 'Prior_FY', 'Record_Type'],
      ['Total Promotions', 156, 132, 'promotion'],
      ['Management Level', 18, 15, 'promotion'],
      ['Supervisory Level', 45, 38, 'promotion'],
      ['Operational Level', 93, 79, 'promotion'],
      ['Total Transfers', 89, 72, 'transfer'],
      ['Inter-Departmental', 34, 28, 'transfer'],
      ['Inter-Shaft/Site', 38, 30, 'transfer'],
      ['Lateral Moves', 17, 14, 'transfer'],
    ]
  },
  {
    name: 'Critical Skills',
    data: [
      ['Skill_Name', 'Required', 'In_Post', 'Vacancy', 'Fill_Rate', 'Risk_Level'],
      ['Engineers/Artisans', 320, 285, 35, 89.1, 'High'],
      ['Geologists', 45, 38, 7, 84.4, 'High'],
      ['Metallurgists', 28, 25, 3, 89.3, 'Medium'],
      ['Mine Overseers', 85, 78, 7, 91.8, 'Medium'],
      ['Shift Supervisors', 190, 172, 18, 90.5, 'High'],
    ]
  },
  {
    name: 'Employee Relations',
    data: [
      ['ER_Category', 'Opened', 'Resolved', 'Pending', 'Prior_Month'],
      ['Disciplinary Cases', 45, 38, 12, 42],
      ['Grievances', 23, 19, 8, 20],
      ['CCMA Referrals', 8, 5, 6, 7],
      ['Incapacity Cases', 12, 9, 5, 10],
      ['Absenteeism Cases', 67, 52, 22, 58],
    ]
  },
  {
    name: 'Shaft Focus',
    data: [
      ['Shaft_Name', 'Headcount', 'Vacancies', 'Attrition_Pct', 'ER_Cases', 'Key_Issue'],
      ['1 Shaft', 2850, 145, 7.2, 18, 'High attrition in stoping crews'],
      ['4 Shaft', 2200, 98, 5.8, 12, 'Critical skills shortage - artisans'],
      ['6 Shaft', 1950, 112, 8.1, 22, 'Elevated absenteeism rate'],
      ['10 Shaft', 2680, 87, 4.5, 9, 'Development crew understaffed'],
      ['11 Shaft', 2310, 134, 6.9, 15, 'ER backlog - disciplinary cases'],
      ['14 Shaft', 1890, 76, 5.2, 8, 'Contractor ratio above target'],
    ]
  },
  {
    name: 'KPIs',
    data: [
      ['KPI_Name', 'Actual_Value', 'Target_Value', 'Unit'],
      ['Absenteeism Rate', 6.8, 5.0, '%'],
      ['Labour Turnover', 6.2, 5.5, '%'],
      ['Training Compliance', 87, 95, '%'],
      ['Vacancy Rate', 4.6, 3.0, '%'],
      ['Time to Fill', 67, 45, 'days'],
      ['ER Resolution Rate', 79, 90, '%'],
      ['Overtime %', 8.3, 7.0, '%'],
      ['Critical Fill Rate', 89, 95, '%'],
    ]
  },
  {
    name: 'Commentary',
    data: [
      ['Section', 'Content'],
      ['labour_overview', 'Insert key observations on total labour numbers here'],
      ['contractors_vs_own', 'Insert contractor vs own employee analysis here'],
      ['planned_vs_actual', 'Insert planned vs actual performance analysis here'],
      ['labour_cost', 'Insert labour cost commentary here'],
      ['recruitment_pipeline', 'Insert recruitment pipeline status here'],
      ['risks', '1. Insert risk 1\n2. Insert risk 2\n3. Insert risk 3'],
      ['recruitment_terminations', 'Insert recruitment/termination analysis here'],
      ['promotions_transfers', 'Insert promotions/transfers analysis here'],
      ['critical_skills', 'Insert critical skills analysis here'],
      ['employee_relations', 'Insert ER analysis here'],
      ['shaft_focus', '1. Insert shaft 1 action plan\n2. Insert shaft 2 action plan\n3. Insert shaft 3 action plan'],
    ]
  }
]);
XLSX.writeFile(masterWB, path.join(outDir, '00_MASTER_Template_All_In_One.xlsx'));
console.log('Created: 00_MASTER_Template_All_In_One.xlsx');

console.log('\n=== ALL TEMPLATES CREATED ===');
console.log('Location:', outDir);
