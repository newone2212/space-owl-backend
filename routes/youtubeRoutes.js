const express = require("express");
const router = express.Router();
const youtube = require("../controllers/youtubeControllers");
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // specify the destination folder


// Route to schedule a video
router.post('/schedule',upload.single('file'), youtube.scheduleVideo);
router.get('/profile',youtube.userProfile);
router.post('/upload-video',upload.single('file'),youtube.uploadVideo);
router.post('/insights',youtube.getYouTubeInsights);
router.post('/channel-details',youtube.getChannelDetails);
router.post('/video-details',youtube.getVideoDetails);
router.post('/metrics',youtube.metrics);


module.exports = router;
