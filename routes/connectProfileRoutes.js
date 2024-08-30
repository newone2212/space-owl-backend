var express = require('express');
const ConnectProfile = require('../controllers/connectProfileControllers');


const router = express.Router();


router.post('/add-profile',ConnectProfile.addProfile);

router.get('/get-profile/:id' , ConnectProfile.GetProfiles);

router.patch('/update-profile/:id' , ConnectProfile.UpdateProfile);


module.exports = router