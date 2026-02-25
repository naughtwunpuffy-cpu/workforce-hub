const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { db } = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'data', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  cb(null, ['.xlsx', '.xls', '.csv'].includes(ext));
}});

router.post('/', authenticate, requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const workbook = XLSX.readFile(req.file.path);
    const preview = {};
    workbook.SheetNames.forEach(name => {
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 });
      preview[name] = { headers: data[0] || [], rowCount: data.length - 1, sample: data.slice(1, 6) };
    });
    res.json({ filename: req.file.originalname, sheets: workbook.SheetNames, preview });
  } catch (e) {
    res.status(400).json({ error: 'Failed to read file: ' + e.message });
  }
});

router.post('/import', authenticate, requireAdmin, (req, res) => {
  const { filename, period } = req.body;
  if (!filename || !period) return res.status(400).json({ error: 'Filename and period required' });

  const safeName = filename.replace(/[^a-zA-Z0-9.]/g, '');
  const files = fs.readdirSync(uploadDir).filter(f => f.includes(safeName));
  if (files.length === 0) return res.status(404).json({ error: 'File not found. Please upload again.' });

  try {
    const workbook = XLSX.readFile(path.join(uploadDir, files[files.length - 1]));
    let imported = 0;

    workbook.SheetNames.forEach(sheetName => {
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      if (data.length === 0) return;
      const headers = Object.keys(data[0]).map(h => h.toLowerCase());

      if (headers.includes('category') && headers.includes('budget') && headers.includes('actual')) {
        data.forEach(row => {
          const budget = Number(row.Budget || row.budget) || 0;
          const actual = Number(row.Actual || row.actual) || 0;
          db.insert('labour_overview', { period, category: row.Category || row.category, budget, actual, variance: actual - budget, variance_pct: budget > 0 ? Math.round(((actual - budget) / budget) * 1000) / 10 : 0 });
          imported++;
        });
      }
      if (headers.includes('kpi_name') && headers.includes('actual_value')) {
        data.forEach(row => {
          db.insert('kpis', { period, kpi_name: row.kpi_name || row.KPI, actual_value: Number(row.actual_value || row.Actual) || 0, target_value: Number(row.target_value || row.Target) || 0, unit: row.unit || '%' });
          imported++;
        });
      }
    });
    res.json({ message: `Imported ${imported} records for period ${period}` });
  } catch (e) {
    res.status(400).json({ error: 'Import failed: ' + e.message });
  }
});

module.exports = router;
