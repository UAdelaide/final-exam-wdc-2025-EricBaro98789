const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login (dummy version)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE email = ? AND password_hash = ?
    `, [email, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});


// --- ADDED: Endpoint to get dogs for the logged-in owner ---
//
router.get('/my-dogs', async (req, res) => {
  // 1. Check if a user is logged in by looking at the session
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authorized. Please log in.' });
  }

  try {
    const ownerId = req.session.user.id;
    // 2. Fetch the ID and name of dogs owned by the logged-in user
    const [dogs] = await db.query('SELECT dog_id, name FROM Dogs WHERE owner_id = ?', [ownerId]);
    res.json(dogs);
  } catch (error) {
    console.error('Failed to fetch user dogs:', error);
    res.status(500).json({ error: 'Failed to fetch your dogs' });
  }
});

// --- ADDED: Endpoint to get all dogs for the homepage display ---
//
router.get('/all-dogs', async (req, res) => {
  try {
    // This query joins the Dogs and Users tables to get the dog's name, size,
    // and the owner's username, which is exactly what the frontend needs.
    const [rows] = await db.query(`
      SELECT d.dog_id, d.name, d.size, u.username as owner_username
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
      ORDER BY d.dog_id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch all dogs:', error);
    res.status(500).json({ error: 'Failed to fetch all dogs' });
  }
});

module.exports = router;
