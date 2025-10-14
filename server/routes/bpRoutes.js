const express = require('express');
const { db } = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ➕ Add a new BP reading
router.post('/add', authMiddleware, (req, res) => {
  const { systolic, diastolic } = req.body;
  if (!systolic || !diastolic) {
    return res.status(400).json({ message: 'Both readings required' });
  }

  let status = 'Normal';
  if (systolic > 130 || diastolic > 90) status = 'High';
  else if (systolic < 110 || diastolic < 70) status = 'Low';

  const stmt = db.prepare(`
    INSERT INTO bp_records (user_id, systolic, diastolic, status)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(req.user.id, systolic, diastolic, status, function (err) {
    if (err) return res.status(500).json({ message: 'DB insert error' });
    res.json({
      message: 'BP recorded successfully',
      bp: { id: this.lastID, systolic, diastolic, status }
    });
  });

  stmt.finalize();
});

// 📊 Get last 20 readings
router.get('/history', authMiddleware, (req, res) => {
  db.all(
    `SELECT systolic, diastolic, status, created_at
     FROM bp_records
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 20`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(rows);
    }
  );
});

// 🕐 Get latest reading
router.get('/latest', authMiddleware, (req, res) => {
  db.get(
    `SELECT systolic, diastolic, status, created_at
     FROM bp_records
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [req.user.id],
    (err, row) => {
      if (err) return res.status(500).json({ message: 'DB error' });
    
      res.json(row || null);
    }
  );
});

module.exports = router;
