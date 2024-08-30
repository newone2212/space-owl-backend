const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');


const googleAuth = require('../auth/googleAuth');
const fbAuth = require('../auth/fbAuth');
const twitterAuth = require('../auth/twitterAuth');
const instaAuth = require('../auth/instaAuth');
const gmbAuth = require('../auth/gmbauth');


// Passport session setup
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Twitter authentication strategy

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, please log in with google: <a href="/login/google/auth">Login with google</a> <br> Hello, please log in with facebook: <a href="/login/fb/auth">Login with Facebook</a><br> Hello, please log in with Twitter: <a href="/login/twitter/auth">Login with Twitter</a> <br> Hello, please log in with Instagram: <a href="/login/insta/auth">Login with Instagram</a> <br> Hello, please log in with Google My Business: <a href="/login/gmb/auth">Login with GMB</a>');
});

app.use('/google',googleAuth);
app.use('/fb',fbAuth);
app.use('/twitter',twitterAuth);
app.use('/insta',instaAuth);
app.use('/gmb',gmbAuth);

module.exports=app