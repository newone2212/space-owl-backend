const express = require('express');
const smToken = require('../controllers/smTokenControllers');

const router = express.Router();

//route to add tokens
router.post('/add',smToken.addtokens);

//route to get tokens
router.get('/get/:id', smToken.getTokens);

//route to add youtube tokens
router.patch('/add-yt/:id',smToken.ytTokens);

//route to add twitter-tokens
router.patch('/add-tw/:id',smToken.twTokens);

//route to add insta-tokens
router.patch('/add-insta/:id',smToken.instaTokens);

//route to add facebook-tokens
router.patch('/add-fb/:id',smToken.fbTokens);

//route to add linkedin-tokens
router.patch('/add-linkedin/:id',smToken.linkedinTokens);

//route to add pinterest-tokens
router.patch('/add-pinterest/:id',smToken.pinterestTokens);

//route to add pinterest-tokens
router.patch('/add-gmb/:id',smToken.gmbTokens);





module.exports = router
