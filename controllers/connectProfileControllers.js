const express = require('express');
const router = express.Router();
const {ConnectProfile} = require('../models/ConnectProfiles')

module.exports = {
    //Add Profiles
    addProfile : async (req, res) =>{
      ConnectProfile.find({email_id: req.body.email_id}).exec().then((profile) => {
        if(profile.length >=1){
            return res.status(401).json({
                message: "Email ID already exists",
                data: undefined
            })
        }else{
        const profile = new ConnectProfile({
            email_id:req.body.email_id,
            youtube : req.body.youtube,
            gmb : req.body.gmb,
            facebook : req.body.facebook,
            instagram : req.body.instagram,
            twitter : req.body.twitter,
            linkedin : req.body.linkedin,
            pinterest : req.body.pinterest
        })
        profile.save().then(() => {
          res.send({
            message : "Profile Added Successfully"
        });
        }).catch((e) => {
            res.send(e);
        })
      }
    })
    },

    //get all profiles of a particular user
    GetProfiles : async (req,res) => {
        ConnectProfile.find({email_id:req.params.id})
        .then(result => {
          res.status(200).json({
            profiles:result
          })
        })
        .catch(err=>{
          console.log(err);
          res.status(500).json({
            error:err
          })
        })
    },

    //update profiles of a particular user
    UpdateProfile : async (req,res) => {
      ConnectProfile.findOneAndUpdate({email_id:req.params.id},
        {
          $push:
        {
            youtube : req.body.youtube,
            gmb : req.body.gmb,
            facebook : req.body.facebook,
            instagram : req.body.instagram,
            twitter : req.body.twitter,
            linkedin : req.body.linkedin,
            pinterest : req.body.pinterest
      }
      })
      .then(result=>{
        res.status(200).json({
          message:"Profile Updated Sucessfully"
        })
      })
      .catch(err=>{
        console.log(err);
        res.status(500).json({
          error:err
        })
      })
    }
}