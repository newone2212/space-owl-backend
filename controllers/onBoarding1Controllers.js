const express = require('express');
const router = express.Router();
const{OnBoarding1} = require('../models/Onboarding1');


module.exports = {

    //add onboarding 1
    addOnBoarding1 : async (req, res) =>{
        OnBoarding1.find({email_id: req.body.email_id}).exec().then((onboarding1) => {
            if(onboarding1.length >=1){
                return res.status(401).json({
                    message: "Email ID already exists",
                    data: undefined
                })
            }else{
                        const onboarding = new OnBoarding1({
                            email_id : req.body.email_id,
                            describes : req.body.describes,
                            industry : req.body.industry,
                            top_goal : req.body.top_goal
                        });
                        onboarding.save().then(() => {
                            res.send({
                                message : "OnBoarding 1 added Successfully"
                            });
                        }).catch((e) => {
                            res.send(e);
                        })
                    }
                })
    },

    //get onboarding 1
    getOnBoarding1 : async (req, res) => {
        OnBoarding1.find({
            email_id:req.params.id
        })
        .then(result => {
          res.status(200).json({
            OnBoarding_1:result
          })
        })
        .catch(err=>{
          console.log(err);
          res.status(500).json({
            error:err
          })
        })
    },

}