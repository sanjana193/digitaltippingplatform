const express = require('express');
const path = require('path');
const cors = require('cors'); // Import CORS middleware

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: 'https://digitaltippingplatform.vercel.app/',
  methods: ['GET', 'POST'], // Optional: Restrict which HTTP methods are allowed
  allowedHeaders: ['Content-Type', 'Authorization'], // Optional: Specify which headers are allowed
};

// Middleware to allow cross-origin requests from all origins
app.use(cors(corsOptions));

// Middleware to set Content-Security-Policy header
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// Middleware to set Strict-Transport-Security header
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload;');
  next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for all routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
