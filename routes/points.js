const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Mock DB

// VULNERABILITY: Insecure Direct Object Reference (IDOR) on Loyalty Points
router.get('/', async (req, res) => {
    // 1. Get the target user ID directly from the query parameter
    const requestedUserId = parseInt(req.query.id); 
    
    if (!requestedUserId) {
        return res.status(400).send('Missing user ID for points lookup.');
    }

    // INSECURE LOGIC: Fetching data based SOLELY on the input ID.
    // An attacker can change `id=X` to see any user's loyalty points.
    const insecureSql = `SELECT id, username, points FROM users WHERE id = ${requestedUserId}`;

    try {
        const results = db.query(insecureSql);
        
        if (results && results.length > 0) {
            const user = results[0];
            const message = (user.points > 1000) 
                ? "Wow! You are a Loyal Customer! You've unlocked the Secret Menu access."
                : "Keep buying snacks to earn more points!";
            
            res.render('points', { 
                targetUser: user,
                loyaltyMessage: message,
                // The 'loyal' user (ID 3) has over 1000 points.
                isLoyalUser: user.id === 3
            });
        } else {
            res.status(404).send('User not found.');
        }
    } catch (error) {
        console.error('Points view error:', error);
        res.status(500).send('A database error occurred.');
    }
});

module.exports = router;