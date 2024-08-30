const express = require('express');
const router = express.Router();
const{OnBoarding2} = require('../models/OnBoarding2');


module.exports = {

    //add onboarding 2
    addOnBoarding2 : async (req, res) =>{
        OnBoarding2.find({email_id: req.body.email_id}).exec().then((onboarding2) => {
            if(onboarding2.length >=1){
                return res.status(401).json({
                    message: "Email ID already exists",
                    data: undefined
                })
            }else{
                        const onboarding2 = new OnBoarding2({
                            email_id : req.body.email_id,
                            org_name : req.body.org_name,
                            org_size : req.body.org_size,
                            org_contact : req.body.org_contact,
                            org_address : req.body.org_address,
                            org_state : req.body.org_state,
                            org_city : req.body.org_city,
                            org_pincode : req.body.org_pincode
                        });
                        onboarding2.save().then(() => {
                            res.send({
                                message : "OnBoarding 2 added Successfully"
                            });
                        }).catch((e) => {
                            res.send(e);
                        })
                    }
                })
    },

    //get onboarding 2
    getOnBoarding2 : async (req, res) => {
        OnBoarding2.find({
            email_id:req.params.id
        })
        .then(result => {
          res.status(200).json({
            OnBoarding_2:result
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