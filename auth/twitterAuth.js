const express = require('express');
const passport = require('passport');
const router = express.Router();
const axios=require('axios');

require("dotenv").config();
const TwitterStrategy = require('passport-twitter').Strategy;

const TW_consumer_key=process.env.Tw_API_KEY;
const TW_consumer_secret=process.env.Tw_API_KEY_SECRET;
const TWITTER_CALLBACK_URL = 'https://oolook.azurewebsites.net/login/twitter/auth/callback'

passport.use(new TwitterStrategy({
  consumerKey: TW_consumer_key,
  consumerSecret: TW_consumer_secret,
  callbackURL: TWITTER_CALLBACK_URL
}, (token, tokenSecret, profile, done) => {
    // Verify callback logic
    // Here, you should check if the user is already in your database or create a new user entry
    // You should call done() with the user object or an error if applicable
    return done(null, profile);
  }));

router.get('/auth', passport.authenticate('twitter'));

router.get('/auth/callback', async (req, res) => {
    const appId = TW_consumer_key;
    const appSecret = TW_consumer_secret;
    const redirectUri = TWITTER_CALLBACK_URL;
    const oauthToken = req.query.oauth_token;
    const oauthVerifier = req.query.oauth_verifier;
  
    // Exchange the request token and verifier for an access token
    const url = `https://api.twitter.com/oauth/access_token?oauth_consumer_key=${appId}&oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`;
    
    try {
      const response = await axios.post(url, {}, {
        auth: {
          username: appId,
          password: appSecret,
        },
      });
  
      // Parse the response to get the access token and secret
      const tokenParts = response.data.split('&');
      const accessToken = tokenParts[0].split('=')[1];
      const accessTokenSecret = tokenParts[1].split('=')[1];
  
      // Now you can use accessToken and accessTokenSecret for Twitter API requests
      res.status(200).json({
        accessToken,
        accessTokenSecret,
      });
    } catch (error) {
      console.error('Error obtaining access token:', error.response ? error.response.data : error.message);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  });

  module.exports = router;


