require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDB();

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/labour', require('./routes/labour'));
app.use('/api/recruitment', require('./routes/recruitment'));
app.use('/api/employee-relations', require('./routes/employeeRelations'));
app.use('/api/critical-skills', require('./routes/criticalSkills'));
app.use('/api/shafts', require('./routes/shafts'));
app.use('/api/kpis', require('./routes/kpis'));
app.use('/api/upload', require('./routes/upload'));

// Serve frontend in production
const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Workforce Hub API running on port ${PORT}`);
});
