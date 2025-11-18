const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Mock DB

// Renders the login form
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// VULNERABILITY: SQL Injection (Authentication Bypass)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // INSECURE LOGIC: Building the SQL query using string concatenation.
    // The attacker can inject the bypass payload into `username`.
    const insecureSql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    try {
        // The mock DB's query function will simulate the successful bypass:
        // 'chintu' OR 1=1 --' will return a user.
        const results = db.query(insecureSql); 

        if (results && results.length > 0) {
            const user = results[0];
            // Set an insecure, unhashed user ID cookie for the session
            res.cookie('user_id', user.id, { httpOnly: true, maxAge: 900000 }); 
            console.log(`User ${user.username} (ID: ${user.id}) logged in.`);
            return res.redirect('/');
        }
        
        // No match found
        res.render('login', { error: 'Invalid username or password.' });
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { error: 'A server error occurred during login.' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('user_id');
    res.redirect('/login');
});

// Renders the register form (No vulnerability implemented here)
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

router.post('/register', (req, res) => {
    // Note: Registration logic is omitted for brevity, focusing on the login SQLi.
    res.render('login', { error: 'Registration successful! Please log in.' });
});

module.exports = router;