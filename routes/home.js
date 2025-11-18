const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Mock DB

// Homepage/Dashboard after login
router.get('/', (req, res) => {
    const user = db.users.find(u => u.id === res.locals.currentUserId);
    
    if (!user) {
        return res.redirect('/logout');
    }
    
    res.render('index', { user: user });
});

module.exports = router;