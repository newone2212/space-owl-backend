const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const{Users} = require('../models/Users');
const{userToken} = require('../models/UserToken');


module.exports = {

    //Register User
    register : async (req, res) =>{
        Users.find({email_id: req.body.email_id}).exec().then((user) => {
            if(user.length >=1){
                return res.status(401).json({
                    message: "Email ID already exists",
                    data: undefined
                })
            }else{
                bcrypt.hash(req.body.password, 2, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            message: "Error, cannot encrypt password",
                            data: undefined
                        })
                    }else{
                        const user = new Users({
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            mobile: req.body.mobile,
                            email_id: req.body.email_id,
                            password: hash
                        });
                        user.save().then(() => {
                            res.send({
                                message : "User Registered Successfully"
                            });
                        }).catch((e) => {
                            res.send(e);
                        })
                    }
                })
            }
        })
    },

    //Admin Login
    login : async (req, res, next) => {
        Users.findOne({email_id: req.body.email_id}).exec()
        .then((user) => {
            if(!user){
                return res.status(401).json({
                    message: "User not found",
                    data: undefined
                })
            }
            bcrypt.compare(req.body.password, user.password, async (err, result) => {
                if(err){
                    return res.status(401).json({
                        message: "Server error, authentication failed",
                        data: undefined
                    })
                }
                if(result){
                    const token = jwt.sign(
                        {
                            email_id: user.email_id,
                            userId: user._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "2h"
                        }
                    );
                    
                    await userToken.findOneAndUpdate({_userId: user._id, tokenType: "login"}, {token: token}, {new: true, upsert: true})
                    return res.status(200).json({
                        message: "Login successfully!",
                        data: {
                            token,
                            user
                        }
                    })
                        
                }
                return res.status(401).json({
                    message: "Wrong password, login failed",
                    data: undefined
                })
            })
        })
        .catch((err) => {
            res.status(500).json({
                message: "Server error, authentication failed",
                data: undefined
            })
        })
    },

    // User Logout
    logout : async (req, res) => {
            // Delete the session token or access token associated with the admin
            const user = await Users.findById(req.userId);
            // console.log(admin._id)
            const logout = await userToken.findOneAndUpdate({_userId : user._id},
            // console.log(logout.token)
            {
                $set: {
                    token : null
            }}
            ).then(result=>{
                res.status(200).json({
                  message:{
                      message : "User Logged Out Successfully"
                  }
                })
              })
              .catch(err=>{
                console.log(err);
                res.status(500).json({
                  error:err,
                  message : "Internal Serval error"
                })
              })
    },

    //Profile of a Particular User
    Profile : async (req, res) => {
        Users.findOne({email_id:req.params.id})
        .then(result => {
          res.status(200).json({
            user:result
          })
        })
        .catch(err=>{
          console.log(err);
          res.status(500).json({
            error:err
          })
        })
    },

    //Update Profile
    updateProfile : async (req, res) => {
        Users.findOneAndUpdate({email_id:req.params.id},{
          $set:{
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            mobile: req.body.mobile
          }
        })
        .then(result=>{
          res.status(200).json({
            updated_status:{
                message : "user profile updated successfully"
            }
          })
        })
        .catch(err=>{
          console.log(err);
          res.status(500).json({
            error:err
          })
        })
    },
    //Update Profile
    updateStatus : async (req, res) => {
        Users.findOneAndUpdate({email_id:req.params.id},{
          $set:{
            status:req.body.status
          }
        })
        .then(result=>{
          res.status(200).json({
            updated_status:{
                message : "user status updated successfully"
            }
          })
        })
        .catch(err=>{
          console.log(err);
          res.status(500).json({
            error:err
          })
        })
    },

     //Change Password
     ChangePassword : async (req,res) => {
        const email_id = req.params.id;
        const {  password, newPassword } = req.body;

        // find the user by email
        const user = await Users.findOne({ email_id });
        if (!user) return res.status(400).send('Invalid email or password.');
      
        // verify the current password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Invalid email or password.');
      
        // generate a new hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
      
        // update the user's password
        user.password = hashedPassword;
        await user.save();
      
        // generate a new JWT token
        const token = jwt.sign({ _id: user._id }, 
            process.env.JWT_KEY
            );
      
        // send the response
        res.send(token);
      }
}