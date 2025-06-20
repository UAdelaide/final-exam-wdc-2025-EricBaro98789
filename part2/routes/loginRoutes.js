const express = require('express');
const router = express.Router();
// Assuming your database connection pool is exported from here
const db = require('../models/db');

// --- API endpoint to handle user login ---
// This route validates a user by username and creates a session on success.
router.post('/login', async (req, res) => {
  const { username } = req.body;

  // Basic validation
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Check if the user exists in the database
    const [rows] = await db.execute('SELECT user_id, username, role FROM Users WHERE username = ?', [username]);

    if (rows.length > 0) {
      // User found, store user info in the session
      const user = rows[0];
      req.session.user = {
        id: user.user_id,
        username: user.username,
        role: user.role
      };
      // Send back a success response with the user's role for redirection
      res.json({ success: true, role: user.role });
    } else {
      // User not found, send an unauthorized error
      res.status(401).json({ success: false, error: 'User not found.' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// --- API endpoint to check for an active session ---
// This allows the frontend to see if a user is already logged in on page load.
router.get('/check-session', (req, res) => {
  if (req.session.user) {
    // If a user is found in the session, return their data
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    // Otherwise, indicate that no user is logged in
    res.json({ loggedIn: false });
  }
});

// --- API endpoint to handle user logout ---
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out.' });
    }
    res.clearCookie('connect.sid'); // Clears the session cookie
    res.json({ success: true });
  });
});

module.exports = router;
