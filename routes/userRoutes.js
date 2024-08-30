const express = require('express');
const user = require('../controllers/userControllers');
const {auth} = require('../middlewares/auth');

const router = express.Router();

//route to register user
router.post('/register',user.register);

//route to login user panel
router.post('/login', user.login);

//route to logout from user panel
router.post('/logout' ,auth, user.logout);

//route to get profile of a particular user
router.get('/profile/:id',user.Profile);

//route to update profile of a user
router.patch('/update-profile/:id',user.updateProfile);

//route to update status of a user
router.patch('/update-status/:id',user.updateStatus);

//route to change the password
router.post('/change-pwd/:id',auth, user.ChangePassword);



module.exports = router
