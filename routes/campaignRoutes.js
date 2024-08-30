const express = require('express');
const campaign = require('../controllers/campaignControllers');

const router = express.Router();

//route to create campaign
router.post('/create-campaign',campaign.addCampaign);

//route to get campaign
router.get('/get-campaign/:id', campaign.getCampaign);




module.exports = router
