const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || "temporary-secret-for-dev";

// JWT middleware
function authenticateToken(req, res, next) {
  // Skip JWT check for public routes
  const publicPaths = ['/health']; // add any other public endpoints here
  if (publicPaths.includes(req.path)) return next();

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Forbidden');
    req.user = user;
    next();
  });
}

// Apply middleware
app.use(authenticateToken);

// Protected route
app.get('/', (req, res) => {
  res.send(`Hello, ${req.user?.name || 'Guest'}`);
});

// Public route
app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
