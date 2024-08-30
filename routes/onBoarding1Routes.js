const express = require('express');
const onboarding1 = require('../controllers/onBoarding1Controllers');

const router = express.Router();

//route to add onboarding 1
router.post('/add-onboarding1',onboarding1.addOnBoarding1);

//route to get onboarding 1
router.get('/get-onboarding1/:id', onboarding1.getOnBoarding1);




module.exports = router
