const express = require('express');
const router = express.Router();

require("dotenv").config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Replace these values with your Google Cloud Console credentials
const GOOGLE_CLIENT_ID = process.env.GMB_Client_Id;
const GOOGLE_CLIENT_SECRET = process.env.GMB_Client_Secret;
const CALLBACK_URL = 'https://oolook.azurewebsites.net/gmb/profile';

// Use the GoogleStrategy within Passport.
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
    // Check for errors during authentication
    if (!profile || profile.error) {
      return done(new Error('Invalid Credentials'));
    }
  
    // Store user information as needed
    return done(null, profile);
  }
));

// Routes
router.get('/auth',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/business.manage', 'https://www.googleapis.com/auth/plus.business.manage'] })
);

router.get('/auth/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/login');
  }
);

module.exports = router;
