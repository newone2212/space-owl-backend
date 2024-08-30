const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const onBoarding2Schema = Schema({
    email_id : {
        type:String,
        unique : true,
        required:true
    },
    org_name : {
        type:String,
        required:true
    },
    org_address : {
        type : String,
        required : true
    },
    org_contact : {
        type:String,
        required:true
    },
    org_size : {
        type:String,
        required:true
    },
    org_state : {
        type:String,
        required:true
    },
    org_city : {
        type:String,
        required:true
    },
    org_pincode : {
        type:Number,
        required:true
    }
});

const OnBoarding2 = mongoose.model("onboarding2", onBoarding2Schema);
module.exports = {OnBoarding2};