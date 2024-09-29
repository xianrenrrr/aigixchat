const fs = require('fs');
const path = require('path');

// Define your project folder structure
const folders = [
  'src',
  'src/controllers',
  'src/models',
  'src/routes',
  'src/middleware',
  'src/config',
  'src/services',
  'public',
  'logs'
];

// Files to be created
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
    "mongoose": "^5.9.10"
  }
}`,
  'src/index.js': `
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Chatbox backend is running!');
});

app.listen(port, () => {
  console.log(\`Server is running on port \${port}\`);
});
`,
  'src/routes/chatRoutes.js': `
const express = require('express');
const router = express.Router();

// Define your chatbox-related routes here
router.get('/test', (req, res) => {
  res.json({ message: 'This is a test route' });
});

module.exports = router;
`,
  'src/controllers/chatController.js': `
// Chat controller logic
exports.getChatResponse = (req, res) => {
  // Add logic for handling user chat requests
  res.json({ message: 'Chat response logic goes here' });
};
`,
  'src/models/userModel.js': `
// Define your user schema/model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  query: String
});

module.exports = mongoose.model('User', userSchema);
`,
  'src/middleware/logger.js': `
// Logger middleware for requests
const logger = (req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
};

module.exports = logger;
`,
  'src/config/db.js': `
// MongoDB connection setup
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
`
};

// Create directories
folders.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created folder: ${dirPath}`);
  }
});

// Create files with basic content
Object.entries(files).forEach(([filename, content]) => {
  const filePath = path.join(__dirname, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content.trim());
    console.log(`Created file: ${filePath}`);
  }
});

console.log('Folder structure and files created successfully.');
