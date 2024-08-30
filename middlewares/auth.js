const { userToken } = require('../models/UserToken');
const jwt = require("jsonwebtoken");
require("dotenv").config();

let auth = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]; 
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const ADT = userToken.findOne({_userId: decoded.userId, token, tokenType: 'login'});
        if(!ADT){
            return res.json({
                isAuth: false,
            })
        }
        req.token = token;
        req.userId =decoded.userId;
        next();
    }

module.exports = {auth}