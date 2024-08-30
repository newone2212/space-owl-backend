const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const onBoarding3Schema = Schema({
    email_id : {
        type:String,
        unique : true,
        required:true
    },
    brand_logo : {
        type:String,
        required:true
    },
    brand_color : {
        type:[String],
        required:true
    },
    brand_font : {
        type:String,
        required:true
    },
    brand_photos : {
        type:String,
        required:true
    },
    brand_videos : {
        type:String,
        required:true
    }
});

const OnBoarding3 = mongoose.model("onboarding3", onBoarding3Schema);
module.exports = {OnBoarding3};