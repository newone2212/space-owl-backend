const express = require('express');
const onboarding2 = require('../controllers/onBoarding2Controllers');

const router = express.Router();

//route to add onboarding 3
router.post('/add-onboarding2',onboarding2.addOnBoarding2);

//route to get onboarding 3
router.get('/get-onboarding2/:id', onboarding2.getOnBoarding2);




module.exports = router
