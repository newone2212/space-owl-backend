const express = require('express');
const passport = require('passport');
const router = express.Router();
const axios=require('axios');

require("dotenv").config();

const InstagramStrategy = require('passport-facebook').Strategy;


const FB_APP_ID = process.env.FB_App_Id;
const FB_APP_SECRET = process.env.FB_App_Secret;

passport.use(
    new InstagramStrategy(
      {
        clientID: FB_APP_ID,
        clientSecret: FB_APP_SECRET,
        callbackURL:'https://oolook.azurewebsites.net/login/fb/auth/callback', // Replace with your callback URL
      },
      (accessToken, refreshToken, profile, done) => {
        // You can store the user profile information in your database or session here.
        // For this example, we'll just pass the profile data to the done() function.
        return done(null, profile);
      }
    )
);

// Google authentication route
router.get('/auth', passport.authenticate('facebook'));

// Google authentication callback route
router.get(
  '/auth/callback',
  (req, res) => {
    
    const appId = FB_APP_ID;
    const appSecret = FB_APP_SECRET;
    const redirectUri = 'https://oolook.azurewebsites.net/login/fb/auth/callback';
    const authorizationCode = req.query.code;
    const url = `https://graph.facebook.com/v14.0/oauth/access_token? +
    client_id=${appId}& +
    client_secret=${appSecret}& +
    code=${authorizationCode}& +
    redirect_uri=${redirectUri}`;
    console.log(url)
    axios.get(url)
    .then(response => {
      const accessToken = response.data.access_token;
      console.log(`Access Token: ${accessToken}`);
      const url2 =`https://graph.facebook.com/v14.0/me/accounts?fields=id,name,access_token&access_token=${accessToken}`

      axios.get(url2).then(response => {
        res.status(200).json({
          data:response.data.data,
          userToken:accessToken
        })
      }).catch(error => {
        res.status(400).json({
          'error' : error
        })
        console.log(error)

      })
      // Now you can use the access token to make requests to the Facebook Graph API
    })
    .catch(error => {
      console.error('Error obtaining access token:', error.response ? error.response.data : error.message);
    });
    // res.redirect('/login/fb/success');
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
    res.send(`Welcome, ${req.user.displayName}! <a href="logout">Logout</a>`);
  } else {
    res.redirect('/');
  }
});

module.exports = router;
