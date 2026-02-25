const express = require('express');
const { db } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const period = req.query.period || db.getDistinct('recruitment', 'period')[0] || '2026-02';
  const all = db.getAll('recruitment', { period });
  const recruitment = all.filter(r => r.record_type === 'recruitment');
  const terminations = all.filter(r => r.record_type === 'termination');
  const commentary = db.getOne('commentary', { period, section: 'recruitment_terminations' });
  res.json({ period, recruitment, terminations, commentary: commentary?.content || '' });
});

router.get('/promotions-transfers', authenticate, (req, res) => {
  const period = req.query.period || db.getDistinct('promotions_transfers', 'period')[0] || '2026-02';
  const all = db.getAll('promotions_transfers', { period });
  const promotions = all.filter(r => r.record_type === 'promotion');
  const transfers = all.filter(r => r.record_type === 'transfer');
  const commentary = db.getOne('commentary', { period, section: 'promotions_transfers' });
  res.json({ period, promotions, transfers, commentary: commentary?.content || '' });
});

module.exports = router;
