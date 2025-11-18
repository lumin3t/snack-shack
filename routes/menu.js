const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Mock DB

// Standard Menu View
router.get('/', async (req, res) => {
    // Show only non-secret snacks
    const publicSnacks = db.snacks.filter(s => !s.is_secret);
    res.render('menu', { snacks: publicSnacks });
});

// Individual Snack View (Links to Buy Route)
router.get('/:id', async (req, res) => {
    const snackId = parseInt(req.params.id);
    const snack = db.snacks.find(s => s.id === snackId);

    if (!snack) {
        return res.status(404).send('Snack not found.');
    }
    
    res.render('snack', { snack: snack });
});


// VULNERABILITY: Secret Menu Access Bypass
router.get('/secret-menu/premium=true', async (req, res) => {
    // This endpoint has a simple, hardcoded check in the URL path.
    // The key to accessing it is knowing the exact path, which is leaked in robots.txt.
    
    const secretSnack = db.snacks.find(s => s.is_secret);

    res.render('secret-menu', { 
        secretSnack: secretSnack,
        message: 'Congratulations! You found the hidden path and have unlocked the Premium Menu.'
    });
});

// Blocked /secret-menu path
router.get('/secret-menu', (req, res) => {
    res.status(403).send("You don't have access to the Secret Menu. You must be a premium member.");
});


module.exports = router;