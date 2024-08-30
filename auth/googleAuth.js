const express = require('express');
const passport = require('passport');
const router = express.Router();
var token;

require("dotenv").config();

const GoogleStrategy = require('passport-google-oauth20').Strategy;


const GOOGLE_CLIENT_ID = process.env.Yt_Client_ID;
const GOOGLE_CLIENT_SECRET = process.env.Yt_Client_Secret;

passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL:'https://oolook.azurewebsites.net/youtube/profile', // Replace with your callback URL
      },
      (accessToken, refreshToken, profile, done) => {
        // You can store the user profile information in your database or session here.
        // For this example, we'll just pass the profile data to the done() function.
        return done(null, profile);
      }
    )
);

// Google authentication route
router.get('/auth', passport.authenticate('google', { scope: [    'https://www.googleapis.com/auth/youtube.readonly',
'https://www.googleapis.com/auth/youtube.upload',] }));

// Google authentication callback route
router.get(
  '/auth/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    token=req.query.code
    // Successful authentication, redirect to a success page or do something else
    res.redirect('/login/google/success');
  }
);

// Logout route
router.get('/logout', async (req, res) => {
    try {
      await new Promise((resolve, reject) => {
        req.logout((err) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
      res.redirect('/login');
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
  });
// Protected route (requires authentication)
router.get('/success', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome, <br> ${req.user.displayName} <br> ${token}! <a href="logout">Logout</a>`);
  } else {
    res.redirect('/');
  }
});

module.exports = router;
