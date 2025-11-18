const express = require('express');
const router = express.Router();

// Route to set the theme cookie
// VULNERABILITY: Cookie manipulation is leveraged here.
router.get('/set-theme', (req, res) => {
    const theme = req.query.name || 'main';

    // Set the cookie based on the URL parameter. No validation is performed.
    // An attacker can set theme=dark or theme=nonexistent to control client-side behavior.
    res.cookie('theme', theme, { maxAge: 900000, httpOnly: false });
    
    // Redirect back to the previous page or home
    res.redirect(req.headers.referer || '/');
});

module.exports = router;