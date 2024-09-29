const express = require('express');
const cors = require('cors'); // Import CORS

const connectDB = require('./config/db');
const chatRoutes = require('./routes/chatRoutes');
const logger = require('./middleware/logger');

// Initialize app
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json()); // for parsing application/json
app.use(logger);

// Routes
app.use('/api/chat', chatRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
