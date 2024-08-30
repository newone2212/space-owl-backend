const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const onBoarding1Schema = Schema({
    email_id : {
        type:String,
        unique : true,
        required:true
    },
    describes : {
        type:String,
        required:true
    },
    industry : {
        type : String,
        required : true
    },
    top_goal : {
        type:String,
        required:true
    }
});

const OnBoarding1 = mongoose.model("onboarding1", onBoarding1Schema);
module.exports = {OnBoarding1};