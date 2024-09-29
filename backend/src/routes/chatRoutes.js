const express = require('express');
const { getChatResponse } = require('../controllers/chatController');

const router = express.Router();

// Define the POST route for chat interactions
router.post('/', getChatResponse);

module.exports = router;
