const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Mock DB

// Simple Admin Check (omitted for simplicity but usually required)

// VULNERABILITY: Stored XSS Sink
router.get('/feedback', async (req, res) => {
    // Admin check is omitted here, assuming the user who reaches this page is authorized (or bypassed)

    // Retrieve all feedback (potentially containing XSS payloads)
    const feedbackList = db.query('SELECT * FROM feedback');

    // INSECURE RENDERING: The EJS template will use `<%- feedback.comment %>`
    // to output the content, which renders the raw, unsanitized HTML.
    
    res.render('admin-feedback', { feedback: feedbackList });
});

module.exports = router;