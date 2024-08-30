const express = require('express');
const router = express.Router();
const{Campaign} = require('../models/Campaign');


module.exports = {

    //add Campaign 
    addCampaign : async (req, res) =>{
        const campaign = new Campaign({
            email_id : req.body.email_id,
            objective : req.body.objective,
            duration : req.body.duration,
            budget : req.body.budget,
            post : req.body.post
        });
        campaign.save().then(() => {
            res.send({
                message : "Campaign Added Successfully"
            });
        }).catch((e) => {
            res.send(e);
        })
    },

    //get Campaign
    getCampaign : async (req, res) => {
        Campaign.find({
            email_id:req.params.id
        })
        .then(result => {
          res.status(200).json({
            Campaigns:result
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