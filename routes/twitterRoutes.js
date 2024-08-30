// routes/tweetRoutes.js
const express = require('express');
const tweetController = require('../controllers/twitterControllers');

const router = express.Router();

// Routes
router.post('/post', tweetController.postTweet);
router.get('/get-tweets', tweetController.getTweets);

module.exports = router;
