const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SM_TokenSchema = Schema({
    email_id : {
        type:String,
        unique : true,
        required:true
    },
    yt_access_token : {
        type:String
    },
    yt_expiry_date : {
        type:String
    },
    yt_scope : {
        type:String
    },
    yt_id : {
        type:String
    },
    tw_access_token : {
        type : String
    },
    tw_access_token_secret : {
        type : String
    },
    insta_access_token : {
        type:String
    },
    insta_id : {
        type:String
    },
    fb_access_token : {
        type:String
    },
    fb_id : {
        type:String
    },
    linkedin_access_token : {
        type:String
    },
    linkedin_access_token_secret : {
        type:String
    },
    pinterest_access_token : {
        type:String
    },
    pinterest_access_token_secret : {
        type:String
    },
    gmb_access_token:{
        type:String
    },
    gmb_id:{
        type:String
    }
});

const smToken = mongoose.model("smTokens", SM_TokenSchema);
module.exports = {smToken};