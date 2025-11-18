const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Mock DB

// VULNERABILITY: Insecure Direct Object Reference (IDOR)
router.get('/', async (req, res) => {
    // 1. Get the target user ID directly from the query parameter
    const requestedUserId = parseInt(req.query.id); 
    
    // Ensure the ID is a valid number
    if (!requestedUserId) {
        return res.status(400).send('Missing account ID.');
    }

    // INSECURE LOGIC: Fetching user data based SOLELY on the input ID.
    // There is NO check that `requestedUserId` matches `res.locals.currentUserId`.
    const insecureSql = `SELECT * FROM users WHERE id = ${requestedUserId}`;

    try {
        const results = db.query(insecureSql);
        
        if (results && results.length > 0) {
            const user = results[0];
            // Render the account page with the accessed user's data
            res.render('account', { 
                targetUser: user,
                isCurrentUser: user.id === res.locals.currentUserId
            });
        } else {
            res.status(404).send('User not found.');
        }
    } catch (error) {
        console.error('Account view error:', error);
        res.status(500).send('A database error occurred.');
    }
});

module.exports = router;