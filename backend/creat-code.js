const fs = require('fs');
const path = require('path');

// Folder structure
const folders = [
  'src',
  'src/controllers',
  'src/models',
  'src/routes',
  'src/middleware',
  'src/config'
];

// File content definitions
const files = {
  'package.json': `
{
  "name": "backend-chatbox",
  "version": "1.0.0",
  "description": "Backend for TPU and PVC car wraps chatbox",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "mongoose": "^5.9.10",
    "dotenv": "^10.0.0"
  }
}
`,
  'src/index.js': `
const express = require('express');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chatRoutes');
const logger = require('./middleware/logger');

// Initialize app
const app = express();
const port = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(express.json()); // for parsing application/json
app.use(logger); // for logging requests

// Routes
app.use('/api/chat', chatRoutes); // Chat routes

// Server listen
app.listen(port, () => {
  console.log(\`Server is running on port \${port}\`);
});
`,
  'src/config/db.js': `
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
`,
  'src/routes/chatRoutes.js': `
const express = require('express');
const { getChatResponse } = require('../controllers/chatController');

const router = express.Router();

// API route to handle chatbox interaction
router.post('/', getChatResponse);

module.exports = router;
`,
  'src/controllers/chatController.js': `
const User = require('../models/userModel');

// Main function to handle user inquiries
exports.getChatResponse = async (req, res) => {
  const { carType, queryType } = req.body; // Frontend will pass carType and queryType (TPU/PVC understanding)

  // Validate incoming data
  if (!carType || !queryType) {
    return res.status(400).json({ message: 'Car type and query type are required' });
  }

  try {
    // Decision engine based on car type and TPU/PVC knowledge
    let responseMessage = '';
    
    if (carType === 'new' && queryType === 'both') {
      responseMessage = 'New car, and you understand both TPU and PVC: Great! We recommend you consider the latest TPU wraps for better durability.';
    } else if (carType === 'old' && queryType === 'TPU') {
      responseMessage = 'Old car with TPU knowledge: TPU is the best for protecting an older car from wear and tear!';
    } else if (queryType === 'PVC') {
      responseMessage = 'PVC wraps are generally more affordable, but TPU offers better protection for both new and old cars.';
    } else {
      responseMessage = 'It seems you are unfamiliar with both TPU and PVC. Let me explain the differences...';
    }

    // Store user interaction in the database
    const userInteraction = new User({
      carType,
      query: queryType,
      response: responseMessage
    });
    
    await userInteraction.save();

    // Send the response back to the frontend
    res.status(200).json({ message: responseMessage });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
`,
  'src/models/userModel.js': `
const mongoose = require('mongoose');

// Define user interaction schema
const userSchema = new mongoose.Schema({
  carType: {
    type: String,
    required: true
  },
  query: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
`,
  'src/middleware/logger.js': `
// Logger middleware for tracking incoming requests
const logger = (req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
};

module.exports = logger;
`,
  '.env': `
MONGO_URI=mongodb://localhost:27017/chatboxDB
`
};

// Create directories if they don't exist
folders.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created folder: ${dirPath}`);
  }
});

// Create files with content
Object.entries(files).forEach(([filename, content]) => {
  const filePath = path.join(__dirname, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content.trim());
    console.log(`Created file: ${filePath}`);
  }
});

console.log('Folder structure and files created successfully.');
