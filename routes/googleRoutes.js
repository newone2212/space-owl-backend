const express = require("express");
const router = express.Router();
const google = require("../controllers/googleControllers");
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // specify the destination folder


// Route to schedule a video
// router.post('/schedule',upload.single('file'), google.scheduleVideo);
router.get('/profile',google.userProfile);
// router.post('/upload-video',upload.single('file'),youtube.uploadVideo);
router.post('/insights',google.getInsights);
router.post('/accounts',google.accountId);
// router.post('/channel-details',youtube.getChannelDetails);
// router.post('/video-details',youtube.getVideoDetails);
// router.post('/metrics',youtube.metrics);


module.exports = router;
