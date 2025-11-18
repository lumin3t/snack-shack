const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Mock DB

router.get('/', (req, res) => {
    res.render('feedback', { message: null });
});

// VULNERABILITY: Stored Cross-Site Scripting (XSS)
router.post('/', async (req, res) => {
    const { subject, comment } = req.body;
    
    // INSECURE LOGIC: Storing the user input directly without any sanitization.
    // If 'comment' contains a `<script>` tag, it will be executed when rendered.
    
    const feedbackData = {
        user_id: res.locals.currentUserId,
        subject: subject,
        comment: comment // Stored unsanitized XSS payload
    };
    
    db.insert('feedback', feedbackData);
    
    res.render('feedback', { message: 'Thank you for your feedback! An admin will review it shortly.' });
});

module.exports = router;