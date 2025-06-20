const express = require('express');
const path = require('path');
const session = require('express-session'); // Added for session management

const app = express();

// --- Middleware Setup ---
app.use(express.json()); // For parsing application/json
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// --- Session Middleware Configuration ---
app.use(session({
  secret: 'a-super-secret-key-that-is-long-and-secure', // A secret key to sign the session ID cookie
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something is stored
  cookie: {
    secure: false, // Use 'true' in a production environment with HTTPS
    httpOnly: true // Helps prevent XSS attacks
  }
}));

// --- Route Definitions ---
// Import the routers
const loginRoutes = require('./routes/loginRoutes'); // The new authentication router
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

// Use the routers with a base path
app.use('/api', loginRoutes); // Handles /api/login, /api/logout, etc.
app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);


// Export the app (to be started by bin/www or a similar script)
module.exports = app;
