const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const campaignSchema = Schema({
    email_id : {
        type:String,
        unique : true,
        required:true
    },
    objective : {
        type:String,
        required:true
    },
    duration : {
        type : String,
        required : true
    },
    budget : {
        type:String,
        required:true
    },
    post : {
        type:String,
        required:true
    }
});

const Campaign = mongoose.model("campaigns", campaignSchema);
module.exports = {Campaign};