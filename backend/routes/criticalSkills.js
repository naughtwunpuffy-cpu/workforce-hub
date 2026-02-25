const express = require('express');
const { db } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const period = req.query.period || db.getDistinct('critical_skills', 'period')[0] || '2026-02';
  const data = db.getAll('critical_skills', { period });
  const commentary = db.getOne('commentary', { period, section: 'critical_skills' });

  const totalRequired = data.reduce((s, r) => s + r.required, 0);
  const totalInPost = data.reduce((s, r) => s + r.in_post, 0);
  const totalVacancy = data.reduce((s, r) => s + r.vacancy, 0);
  const overallFillRate = totalRequired > 0 ? Math.round((totalInPost / totalRequired) * 1000) / 10 : 0;

  res.json({ period, data, commentary: commentary?.content || '', overallFillRate, totalVacancy });
});

module.exports = router;
