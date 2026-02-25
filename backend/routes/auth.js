const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  const user = db.getOne('users', { username });
  if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, full_name: user.full_name },
    process.env.JWT_SECRET, { expiresIn: '24h' }
  );
  res.json({ token, user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role } });
});

router.get('/me', authenticate, (req, res) => {
  const user = db.getOne('users', { id: req.user.id });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, username: user.username, full_name: user.full_name, role: user.role });
});

router.post('/register', authenticate, requireAdmin, (req, res) => {
  const { username, password, full_name, role } = req.body;
  if (!username || !password || !full_name) return res.status(400).json({ error: 'All fields required' });
  if (db.getOne('users', { username })) return res.status(400).json({ error: 'Username already exists' });

  const user = db.insert('users', { username, password: bcrypt.hashSync(password, 10), full_name, role: role || 'viewer' });
  res.json({ id: user.id, username, full_name, role: role || 'viewer' });
});

module.exports = router;
