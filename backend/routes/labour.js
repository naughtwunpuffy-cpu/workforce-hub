const express = require('express');
const { db } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/overview', authenticate, (req, res) => {
  const period = req.query.period || db.getDistinct('labour_overview', 'period')[0] || '2026-02';
  const data = db.getAll('labour_overview', { period });
  const commentary = db.getOne('commentary', { period, section: 'labour_overview' });
  res.json({ period, data, commentary: commentary?.content || '' });
});

router.get('/departments', authenticate, (req, res) => {
  const period = req.query.period || db.getDistinct('department_headcount', 'period')[0] || '2026-02';
  const all = db.getAll('department_headcount', { period });
  const ownEmployees = all.filter(r => r.employee_type === 'own');
  const contractors = all.filter(r => r.employee_type === 'contractor');
  const commentary = db.getOne('commentary', { period, section: 'contractors_vs_own' });
  res.json({ period, ownEmployees, contractors, commentary: commentary?.content || '' });
});

router.get('/planned-vs-actual', authenticate, (req, res) => {
  const period = req.query.period || db.getDistinct('planned_vs_actual', 'period')[0] || '2026-02';
  const data = db.getAll('planned_vs_actual', { period });
  const commentary = db.getOne('commentary', { period, section: 'planned_vs_actual' });
  res.json({ period, data, commentary: commentary?.content || '' });
});

router.get('/periods', authenticate, (req, res) => {
  res.json(db.getDistinct('labour_overview', 'period'));
});

module.exports = router;
