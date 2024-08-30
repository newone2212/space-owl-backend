const express = require('express');
const router = express.Router();
const multer = require('multer');
const facebookControllers = require('../controllers/facebookControllers');
const upload = multer({ dest: 'uploads/' });

router.post('/post-text', facebookControllers.uploadPost);
router.post('/post-image', facebookControllers.imagePost);
router.post('/schedule-post-text', facebookControllers.schedulePost);
router.post('/insights', facebookControllers.insights);
router.post('/postId', facebookControllers.postId);
router.post('/photosId', facebookControllers.photosId);
router.post('/videosId', facebookControllers.videosId);
router.post('/post-reaction', facebookControllers.pagePostReaction);
router.post('/about', facebookControllers.about);
router.post('/metrics', facebookControllers.metrics);

//facebook Conversations & send  Message
router.post("/GetConversation",facebookControllers.Psid);
router.post("/SendMessage",facebookControllers.SendPsid);

module.exports=router;