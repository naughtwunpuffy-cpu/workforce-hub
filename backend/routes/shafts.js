const express = require('express');
const { db } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const period = req.query.period || db.getDistinct('shaft_focus', 'period')[0] || '2026-02';
  const data = db.getAll('shaft_focus', { period });
  const commentary = db.getOne('commentary', { period, section: 'shaft_focus' });
  res.json({ period, data, commentary: commentary?.content || '' });
});

module.exports = router;
