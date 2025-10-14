const jwt = require('jsonwebtoken');
const { db } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: 'No token provided' });

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token)
    return res.status(401).json({ message: 'Invalid token format' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });

    db.get('SELECT id, name, email FROM users WHERE id = ?', [decoded.id], (err, user) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (!user) return res.status(404).json({ message: 'User not found' });

      req.user = user;
      next();
    });
  });
}

module.exports = authMiddleware;
