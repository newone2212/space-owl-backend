const express = require('express');
const router = express.Router();
const multer = require('multer');
const instagramControllers = require('../controllers/instagramControllers');
const upload = multer({ dest: 'uploads/' });

router.get('/auth', instagramControllers.InstaLogin);
router.get('/handle-auth', instagramControllers.InstaCallback);
router.post('/profile',instagramControllers.profile);
router.post('/get-id',instagramControllers.getIdUsername);
router.post('/media-insights',instagramControllers.mediaInsight);
router.post('/impressions',instagramControllers.impressions);
router.post('/reach',instagramControllers.reach);
router.post('/interaction',instagramControllers.total_interactions);
router.post('/engage',instagramControllers.accounts_engaged);
router.post('/follower-unfollower',instagramControllers.followerUnfollower);
router.post('/likes-comments-shares',instagramControllers.likesCommentsShares);
router.post('/replies-profileViews',instagramControllers.repliesProfileviews);
router.post('/follower-demographics',instagramControllers.followerdemography);
router.post('/engaged-audience-demographics',instagramControllers.engagedAudienceDemography);
router.post('/reached-audience-demographics',instagramControllers.reachedAudienceDemography);
router.post('/post', instagramControllers.postToInstagram);
router.post('/schedule-post', instagramControllers.schedulePostToInstagram);
router.post('/ig-id', instagramControllers.mediaId);

module.exports=router;