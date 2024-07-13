const express = require('express');
const path = require('path');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Razorpay configuration
const razorpay = new Razorpay({
  key_id: 'rzp_test_ZSzFKZBuOxUtdl',
  key_secret: 'N552sUmQaQzVxhrouTgpbdLH',
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Route to create an order
app.post('/create-order', async (req, res) => {
  const { customerID, amount, currency = 'INR', receipt } = req.body;

  try {
    // Fetch customer details from your database using customerID if needed

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
    });

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Serve the index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
