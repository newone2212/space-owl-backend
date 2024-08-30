const express = require('express');
const onboarding3 = require('../controllers/onBoarding3Controllers');
const router = express.Router();
const upload = require('../middlewares/multer');

//route to add onboarding 3
router.post('/add-onboarding3', upload.fields([
    { name: 'brand_logo', maxCount: 1 },
    { name: 'brand_photos', maxCount: 1 },
    { name: 'brand_videos', maxCount: 1 },
  ]),onboarding3.addOnBoarding3);

//route to get onboarding 3
router.get('/get-onboarding3/:id', onboarding3.getOnBoarding3);




module.exports = router
