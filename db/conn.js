const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://zqvJ9JMWYmP3nlFV:zqvJ9JMWYmP3nlFV@3d-arts-db.czp8mba.mongodb.net/Space-Owl-Db?retryWrites=true&w=majority", {

}).then (() => {
    console.log("Connection is Successful")
}).catch (() => {
    console.log("No Connection")
})