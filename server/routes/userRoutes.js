const express = require('express');
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const bcrypt = require('bcrypt');  
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// ✅ Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // decoded payload
    next();
  });
}

// ✅ PUT /api/user/update
router.put('/update', authenticateToken, (req, res) => {
  const { name, age, gender, email } = req.body;
  const userId = req.user.id;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const query = `UPDATE users SET name = ?, age = ?, gender = ?, email = ? WHERE id = ?`;
  db.run(query, [name, age || null, gender || null, email.toLowerCase(), userId], function (err) {
    if (err) {
      console.error('DB Update Error:', err);
      return res.status(500).json({ message: 'Database update failed' });
    }

    // Fetch updated user to return
    db.get(`SELECT id, name, email, age, gender FROM users WHERE id = ?`, [userId], (err, updatedUser) => {
      if (err) return res.status(500).json({ message: 'Error fetching updated user' });
      res.json({ message: 'Profile updated successfully', user: updatedUser });
    });
  });
});


// ✅ Change password route
router.put('/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // 1. Get the user
  db.get('SELECT password_hash FROM users WHERE id = ?', [userId], async (err, user) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });

    // 3. Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update in DB
    db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hashedNewPassword, userId], (err2) => {
      if (err2) return res.status(500).json({ message: 'Failed to update password' });
      res.json({ message: 'Password updated successfully' });
    });
  });
});


module.exports = router;
