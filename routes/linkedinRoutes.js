const express = require('express');
const router = express.Router();
const multer = require('multer');
const linkedinController = require('../controllers/linkedinControllers');
const upload = multer({ dest: 'uploads/' });

// LinkedIn routes

router.get('/auth/linkedin', linkedinController.linkedinLogin);
router.get('/auth/linkedin/callback', linkedinController.linkedinCallback);
// Define route for scheduling LinkedIn post
router.post('/schedule-post', linkedinController.scheduleLinkedInPost);
// Define routes for LinkedIn-related actions
router.get('/posts', linkedinController.getLinkedInPosts);
// Define route for getting LinkedIn inbox
router.get('/inbox', linkedinController.getLinkedInInbox);


module.exports = router;
