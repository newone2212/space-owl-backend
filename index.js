const express = require('express');
const mongoose = require('mongoose');
require("./db/conn");
const cors = require('cors');
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
const app = express();
const multer = require('multer');
const path = require('path');
const socket = require('./socket/socket');


app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
app.use(cors())
// app.use(formidable());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);
const onboarding1 = require('./routes/onBoarding1Routes');
app.use('/onboarding1', onboarding1);
const onboarding2 = require('./routes/onBoarding2Routes');
app.use('/onboarding2', onboarding2);
const onboarding3 = require('./routes/onBoarding3Routes');
app.use('/onboarding3', onboarding3);
const connectProfileRoutes = require('./routes/connectProfileRoutes');
app.use('/connect-profile', connectProfileRoutes);
const campaignRoutes = require('./routes/campaignRoutes');
app.use('/campaign', campaignRoutes);
const youtubeRoutes = require('./routes/youtubeRoutes');
app.use('/youtube', youtubeRoutes);
const loginRoutes = require('./service/login');
app.use('/login', loginRoutes);
const tokenRoutes = require('./routes/smTokenRoutes');
app.use('/token', tokenRoutes);
const twitterRoutes = require('./routes/twitterRoutes');
app.use('/twitter', twitterRoutes);
const linkedinRoutes = require('./routes/linkedinRoutes');
app.use('/linkedin', linkedinRoutes);
const facebookRoutes = require('./routes/facebookRoutes');
app.use('/facebook', facebookRoutes);
const instagramRoutes = require('./routes/instagramRoutes');
app.use('/instagram', instagramRoutes);
const googleRoutes = require('./routes/googleRoutes');
app.use('/gmb', googleRoutes);


app.get("/", (req,res)=>{
    res.send("Hello! This is Space Owl Backend");
});


//testing the socket connection
const test =require("./test") 
app.use("/test",test);

const port = process.env.PORT || 8080

app.listen(port, () =>{
    console.log(`app is running at ${port}`);
})