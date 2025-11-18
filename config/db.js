// config/db.js - Mock In-Memory Database and Vulnerable Query Function

// Simulates the users table from the SQL schema
const users = [
    // Passwords are NOT HASHED, this is an additional vulnerability for the demo
    // The SQLi vulnerability bypasses the password anyway.
    { id: 1, username: 'chintu', password: 'password123', email: 'chintu@shack.com', role: 'customer', points: 50 },
    { id: 2, username: 'bunty', password: 'password123', email: 'bunty@shack.com', role: 'customer', points: 250 },
    { id: 3, username: 'loyal', password: 'securepassword', email: 'loyal@shack.com', role: 'customer', points: 5000 },
    { id: 4, username: 'admin', password: 'adminpass', email: 'admin@shack.com', role: 'admin', points: 9999 }
];

// Simulates the snacks table
const snacks = [
    { id: 101, name: 'Crispy Choco Bar', description: 'Crunchy chocolate goodness.', price: 1.99, is_secret: false },
    { id: 102, name: 'Spicy Chips XL', description: 'Extreme heat, extreme flavor.', price: 2.49, is_secret: false },
    { id: 103, name: 'Loyalty Lolly', description: 'A sweet treat for our loyal customers.', price: 0.99, is_secret: false },
    { id: 104, name: 'The Admin Delight', description: 'A forbidden, premium snack.', price: 99.99, is_secret: true }
];

// Simulates the feedback table (for Stored XSS)
const feedback = [];

// Simulates the orders table (for Price Manipulation)
const orders = [];


// --- VULNERABLE MOCK QUERY FUNCTION ---
// This function simulates an INSECURE database query execution.
function vulnerableQuery(sql) {
    console.log("Executing VULNERABLE Query:", sql.trim());

    // --- VULNERABILITY: SQL Injection Simulation ---
    // If the query is a SELECT on 'users' with 'username' and 'password' in WHERE clause,
    // we simulate the SQL Injection vulnerability by manually checking for the bypass payload.
    if (sql.includes("SELECT * FROM users WHERE username = '") && sql.includes("AND password = '")) {
        
        // **FIXED LOGIC**: Check for the common authentication bypass pattern.
        // The expected payload is: ' OR 1=1 -- 
        // We look for ' OR 1=1' followed by the SQL comment terminator '--'.
        if (sql.includes("' OR 1=1 --")) {
            console.log("!!! SQL INJECTION BYPASS DETECTED !!!");
            // Return the first user (chintu) to simulate a successful bypass login.
            return [users[0]]; 
        }

        // Standard vulnerable login check (no hashing, simple match)
        const parts = sql.match(/username = '(.+)' AND password = '(.+)'/);
        if (parts && parts.length === 3) {
            const username = parts[1];
            const password = parts[2];
            const foundUser = users.find(u => u.username === username && u.password === password);
            return foundUser ? [foundUser] : [];
        }
    }
    
    // --- VULNERABILITY: IDOR Simulation (Generic SELECT by ID) ---
    if (sql.includes("SELECT * FROM users WHERE id = ")) {
        const id = parseInt(sql.match(/id = (\d+)/)?.[1]);
        if (id) {
            const foundUser = users.find(u => u.id === id);
            return foundUser ? [foundUser] : [];
        }
    }

    // --- Generic Mock Operations for other parts of the app ---
    if (sql.includes("SELECT * FROM snacks")) {
        return snacks;
    }
    
    if (sql.includes("SELECT * FROM feedback")) {
        return feedback.slice().reverse(); // Show newest first
    }
    
    return []; // Default return
}

// Simple mock for inserting data (e.g., feedback, orders)
function mockInsert(table, data) {
    if (table === 'feedback') {
        const newId = feedback.length + 1;
        feedback.push({ id: newId, ...data, created_at: new Date().toISOString() });
        return true;
    }
    if (table === 'orders') {
        const newId = orders.length + 1;
        orders.push({ id: newId, ...data, created_at: new Date().toISOString() });
        return true;
    }
    return false;
}

module.exports = {
    query: vulnerableQuery, // The vulnerable SQL execution function
    insert: mockInsert,
    users: users,
    snacks: snacks,
    feedback: feedback,
    orders: orders,
};