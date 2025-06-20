
const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.post('/login', async (req, res) => {
  // Now we expect both username and password from the request body
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {

    const [rows] = await db.execute(
      'SELECT user_id, username, role FROM Users WHERE username = ? AND password_hash = ?',
      [username, password]
    );

    if (rows.length > 0) {
      // User found, credentials are valid. Store user info in the session.
      const user = rows[0];
      req.session.user = {
        id: user.user_id,
        username: user.username,
        role: user.role
      };
      // Send back a success response with the user's role for redirection
      res.json({ success: true, role: user.role });
    } else {
      // User not found or password incorrect, send an unauthorized error
      res.status(401).json({ success: false, error: 'Invalid username or password.' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

router.get('/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out.' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

module.exports = router;
