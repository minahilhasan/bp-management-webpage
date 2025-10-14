require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db, init } = require('./db');
const userRoutes = require('./routes/userRoutes');
const bpRoutes = require('./routes/bpRoutes');
const reminderRoutes = require("./routes/reminderRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

init();

app.use(cors({
  origin: 'http://localhost:3000', // React dev server
  credentials: true
}));
app.use(express.json());

// Helper: generate token
function generateToken(user) {
  // Include minimal info in token
  const payload = { id: user.id, email: user.email, name: user.name };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

app.use('/api/user', userRoutes);
app.use('/api/bp', bpRoutes);
app.use("/api/reminder", reminderRoutes);

// Registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, age, gender, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    // Simple email check
    const emailLower = email.toLowerCase();

    // Check if user exists
    db.get('SELECT id FROM users WHERE email = ?', [emailLower], async (err, row) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      if (row) return res.status(400).json({ message: 'Email already registered' });

      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      const stmt = db.prepare(`INSERT INTO users (name, age, gender, email, password_hash) VALUES (?, ?, ?, ?, ?)`);
      stmt.run(name, age || null, gender || null, emailLower, password_hash, function (err) {
        if (err) {
          return res.status(500).json({ message: 'DB insert error' });
        }
        const newUser = { id: this.lastID, name, email: emailLower };
        const token = generateToken(newUser);
        res.json({ user: newUser, token });
      });
      stmt.finalize();
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const emailLower = email.toLowerCase();
  db.get('SELECT * FROM users WHERE email = ?', [emailLower], async (err, user) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    const publicUser = { id: user.id, name: user.name, email: user.email, age: user.age, gender: user.gender };
    res.json({ user: publicUser, token });
  });
});

// Protected endpoint to verify token / get current user
app.get('/api/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token provided' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Token error' });

  const token = parts[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    // decoded contains the payload we set (id, email, name)
    db.get('SELECT id, name, email, age, gender FROM users WHERE id = ?', [decoded.id], (err, user) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ user });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
