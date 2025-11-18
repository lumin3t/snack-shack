-- MySQL Schema for Snack Shack

-- Drop tables if they exist to allow for clean re-creation
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS snacks;

-- 1. Users Table (Intended for SQL Injection and IDOR)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Storing as hash, but SQLi bypasses this.
    email VARCHAR(255),
    role VARCHAR(50) DEFAULT 'customer', -- 'customer' or 'admin'
    points INT DEFAULT 0
);

-- 2. Snacks Table (Intended for Client-Controlled Price)
CREATE TABLE snacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    is_secret BOOLEAN DEFAULT FALSE
);

-- 3. Orders Table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    snack_id INT NOT NULL,
    quantity INT NOT NULL,
    -- VULNERABILITY: Storing the 'final_price' in the database (this is the client-submitted price).
    -- If the application uses this column for the final charge instead of the 'snacks.price', it enables price manipulation.
    client_submitted_price DECIMAL(10, 2) NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (snack_id) REFERENCES snacks(id)
);

-- 4. Feedback Table (Intended for Stored XSS)
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    subject VARCHAR(255),
    -- VULNERABILITY: The 'comment' will be stored without sanitization.
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sample Data (Users)
-- Passwords are set to 'password' for testing (hashed with a generic method, e.g., bcrypt $2b$10$)
INSERT INTO users (username, password_hash, email, role, points) VALUES
('chintu', '$2b$10$wJ1E4fB1D/SgHwE3d8Vb6.VpI6mSgHwE3d8Vb6.', 'chintu@shack.com', 'customer', 50),
('bunty', '$2b$10$wJ1E4fB1D/SgHwE3d8Vb6.VpI6mSgHwE3d8Vb6.', 'bunty@shack.com', 'customer', 250),
('loyal', '$2b$10$wJ1E4fB1D/SgHwE3d8Vb6.VpI6mSgHwE3d8Vb6.', 'loyal@shack.com', 'admin', 500),
('admin', '$2b$10$wJ1E4fB1D/SgHwE3d8Vb6.VpI6mSgHwE3d8Vb6.', 'admin@shack.com', 'admin', 9999);

-- Sample Data (Snacks)
INSERT INTO snacks (name, description, price, is_secret) VALUES
('Crispy Choco', 'The crunchiest chocolate bar around.', 1.99, FALSE),
('Spicy Chips', 'Extreme heat, extreme flavor.', 2.49, FALSE),
('Loyalty Lolly', 'A sweet treat for our loyal customers.', 0.99, FALSE),
('The Admin Delight', 'A forbidden snack, only for the eyes of the worthy.', 99.99, TRUE);