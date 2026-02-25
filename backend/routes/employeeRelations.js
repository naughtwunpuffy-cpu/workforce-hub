const express = require('express');
const { db } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const period = req.query.period || db.getDistinct('employee_relations', 'period')[0] || '2026-02';
  const data = db.getAll('employee_relations', { period });
  const commentary = db.getOne('commentary', { period, section: 'employee_relations' });

  const totalOpened = data.reduce((s, r) => s + r.opened, 0);
  const totalResolved = data.reduce((s, r) => s + r.resolved, 0);
  const resolutionRate = totalOpened > 0 ? Math.round((totalResolved / totalOpened) * 100) : 0;

  res.json({ period, data, commentary: commentary?.content || '', resolutionRate });
});

module.exports = router;
