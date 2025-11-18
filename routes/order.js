const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Mock DB

// VULNERABILITY: Client-Controlled Price Manipulation
router.post('/', async (req, res) => {
    // Get parameters from the POST body
    const { snackId, quantity, price } = req.body; 
    
    const parsedSnackId = parseInt(snackId);
    const parsedQuantity = parseInt(quantity);
    const clientPrice = parseFloat(price);

    if (isNaN(parsedSnackId) || isNaN(parsedQuantity) || isNaN(clientPrice)) {
        return res.status(400).send('Invalid order parameters.');
    }

    // INSECURE LOGIC: The server trusts the 'price' sent from the client.
    // Mitigation would involve: const realSnack = db.snacks.find(s => s.id === parsedSnackId);
    // and then using `realSnack.price * parsedQuantity` for the total.
    
    const finalTotal = clientPrice * parsedQuantity;
    
    const orderData = {
        user_id: res.locals.currentUserId,
        snack_id: parsedSnackId,
        quantity: parsedQuantity,
        client_submitted_price: finalTotal // The manipulated price is saved!
    };
    
    db.insert('orders', orderData);
    
    res.render('buy', { 
        snackId, 
        quantity, 
        price: clientPrice,
        finalTotal: finalTotal.toFixed(2),
        message: 'Order recorded! You paid the price you specified.'
    });
});

module.exports = router;