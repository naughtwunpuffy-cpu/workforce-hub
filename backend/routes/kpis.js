const express = require('express');
const { db } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const period = req.query.period || db.getDistinct('kpis', 'period')[0] || '2026-02';
  const data = db.getAll('kpis', { period });
  const labourCost = db.getOne('commentary', { period, section: 'labour_cost' });
  const recruitmentPipeline = db.getOne('commentary', { period, section: 'recruitment_pipeline' });
  const risks = db.getOne('commentary', { period, section: 'risks' });

  res.json({ period, data, highlights: {
    labourCost: labourCost?.content || '',
    recruitmentPipeline: recruitmentPipeline?.content || '',
    risks: risks?.content || ''
  }});
});

router.get('/summary', authenticate, (req, res) => {
  const period = req.query.period || db.getDistinct('kpis', 'period')[0] || '2026-02';
  const labour = db.getOne('labour_overview', { period, category: 'Total Combined' });
  const kpis = db.getAll('kpis', { period });
  const skills = db.getAll('critical_skills', { period });
  const erData = db.getAll('employee_relations', { period });

  const totalVacancies = skills.reduce((s, r) => s + r.vacancy, 0);
  const avgFill = skills.length > 0 ? Math.round(skills.reduce((s, r) => s + r.fill_rate, 0) / skills.length * 10) / 10 : 0;
  const pendingER = erData.reduce((s, r) => s + r.pending, 0);

  res.json({
    period,
    totalHeadcount: labour?.actual || 0,
    budgetHeadcount: labour?.budget || 0,
    fillRate: labour ? Math.round((labour.actual / labour.budget) * 100 * 10) / 10 : 0,
    criticalVacancies: totalVacancies,
    criticalFillRate: avgFill,
    pendingERCases: pendingER,
    kpis
  });
});

module.exports = router;
