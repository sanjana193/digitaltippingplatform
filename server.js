const express = require('express');
const path = require('path');
const Razorpay = require('razorpay');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your Razorpay key ID and key secret
const razorpay = new Razorpay({
    key_id: 'rzp_test_ZSzFKZBuOxUtdl', // Replace with your Razorpay Key ID
    key_secret: 'N552sUmQaQzVxhrouTgpbdLH' // Replace with your Razorpay Key Secret
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to create a Razorpay order
app.post('/create-order', async (req, res) => {
    const { amount, currency, receipt } = req.body;
    try {
        const order = await razorpay.orders.create({
            amount, // amount in smallest currency unit (e.g., for ₹500, amount = 50000 paise)
            currency,
            receipt
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the frontend application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
