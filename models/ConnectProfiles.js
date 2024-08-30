const mongoose = require("mongoose");
const Schema = mongoose.Schema

const connectProfileSchema = new Schema({
    email_id:{
        type:String,
        unique : true,
        required:true
    },
    youtube:{
        type:Array
    },
    gmb:{
        type:Array
    },
    facebook:{
        type:Array
    },
    instagram:{
        type:Array
    },
    twitter:{
        type:Array
    },
    linkedin:{
        type:Array
    },
    pinterest:{
        type:Array
    }
});

// we will create a new collection
const ConnectProfile = new mongoose.model('profile', connectProfileSchema);

module.exports = {ConnectProfile};