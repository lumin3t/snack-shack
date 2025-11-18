// index.js - Main Express Server for Snack Shack

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// --- Middleware Setup ---
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// VULNERABILITY: DOM-based XSS via Cookie
// The theme cookie is not validated. While used for CSS linking, 
// a non-existent vulnerability (DOM XSS) is simulated here by exposing 
// the raw cookie value for client-side consumption without sanitization.
// The client-side JS (theme.js) demonstrates the unsafe use.
app.use((req, res, next) => {
    // Expose the raw, unsanitized theme cookie value to EJS templates.
    res.locals.theme = req.cookies.theme || 'main';
    
    // Set a mock user ID for simplified auth across the app.
    // In a real app, this would be a secure session token.
    res.locals.currentUserId = req.cookies.user_id ? parseInt(req.cookies.user_id) : null;
    next();
});

// Mock Authentication Check (Insecure)
function requireLogin(req, res, next) {
    if (res.locals.currentUserId) {
        next();
    } else {
        res.redirect('/login');
    }
}

// --- Route Imports ---
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const accountRoutes = require('./routes/account');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');
const feedbackRoutes = require('./routes/feedback');
const pointsRoutes = require('./routes/points');
const adminRoutes = require('./routes/admin');
const themeRoutes = require('./routes/theme');

// --- Route Mounting ---
app.use('/', authRoutes); 
app.use('/', themeRoutes); // Theme changing is public
app.use('/', requireLogin, homeRoutes); // Requires login
app.use('/account', requireLogin, accountRoutes);
app.use('/points', requireLogin, pointsRoutes);
app.use('/menu', requireLogin, menuRoutes);
app.use('/order', requireLogin, orderRoutes);
app.use('/feedback', requireLogin, feedbackRoutes);
app.use('/admin', requireLogin, adminRoutes); // Admin routes require login

app.listen(port, () => {
    console.log(`Snack Shack running at http://localhost:${port}`);
    console.log('*** WARNING: This application is intentionally vulnerable for educational purposes. ***');
    console.log("Try logging in using: username: 'chintu' OR 1=1 --', password: 'anything'");
});