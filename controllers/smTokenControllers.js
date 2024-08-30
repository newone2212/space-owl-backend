const express = require('express');
const router = express.Router();
const{smToken} = require('../models/SM_Tokens');


module.exports = {

    //add Socail Media Tokens 
    addtokens : async (req, res) =>{        
        smToken.find({email_id: req.body.email_id}).exec().then((smtoken) => {
        if(smtoken.length >=1){
            return res.status(401).json({
                message: "Email ID already exists",
                data: undefined
            })
        }else{
        const smtokens = new smToken({
            email_id : req.body.email_id,
            yt_access_token : req.body.yt_access_token,
            yt_expiry_date : req.body.yt_expiry_date,
            yt_scope : req.body.yt_scope,
            yt_id : req.body.yt_id,
            yt_scope : req.body.yt_scope,
            tw_access_token : req.body.tw_access_token,
            tw_access_token_secret : req.body.tw_access_token_secret,
            insta_access_token : req.body.insta_access_token,
            insta_id : req.body.insta_id,
            fb_access_token : req.body.fb_access_token,
            fb_id : req.body.fb_id,
            linkedin_access_token : req.body.linkedin_access_token,
            linkedin_access_token_secret : req.body.linkedin_access_token_secret,
            pinterest_access_token : req.body.pinterest_access_token,
            pinterest_access_token_secret : req.body.pinterest_access_token_secret,
            gmb_access_token_secret : req.body.gmb_access_token_secret,
            gmb_id : req.body.gmb_id,
        });
        smtokens.save().then(() => {
            res.send({
                message : "Tokens Added Successfully"
            });
        }).catch((e) => {
            res.send(e);
        })
    }
})
    },

    //get Tokens
    getTokens : async (req, res) => {
        smToken.findOne({
            email_id:req.params.id
        })
        .then(result => {
          res.status(200).json({
            Tokens:result
          })
        })
        .catch(err=>{
          console.log(err);
          res.status(500).json({
            error:err
          })
        })
    },

    //add youtube_tokens
    ytTokens:async(req,res)=>{
        smToken.findOneAndUpdate({email_id:req.params.id},{
            $set:{
                yt_access_token: req.body.yt_access_token,
                yt_expiry_date: req.body.yt_expiry_date,
                yt_scope: req.body.yt_scope,
                yt_id: req.body.yt_id,
            }
          })
          .then(result=>{
            res.status(200).json({
              updated_status:{
                  message : "Youtube Token added successfully"
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


    //add youtube_tokens
    gmbTokens:async(req,res)=>{
        smToken.findOneAndUpdate({email_id:req.params.id},{
            $set:{
                gmb_access_token: req.body.gmb_access_token,
                gmb_id: req.body.gmb_id
            }
          })
          .then(result=>{
            res.status(200).json({
              updated_status:{
                  message : "Google My Business Token added successfully"
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

    
    //add twitter_tokens
    twTokens:async(req,res)=>{
        smToken.findOneAndUpdate({email_id:req.params.id},{
            $set:{
                tw_access_token: req.body.tw_access_token,
                tw_access_token_secret: req.body.tw_access_token_secret,
            }
          })
          .then(result=>{
            res.status(200).json({
              updated_status:{
                  message : "Twitter Token successfully"
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

    //add insta_tokens
    instaTokens:async(req,res)=>{
        smToken.findOneAndUpdate({email_id:req.params.id},{
            $set:{
                insta_access_token: req.body.insta_access_token,
                insta_id: req.body.insta_id,
            }
          })
          .then(result=>{
            res.status(200).json({
              updated_status:{
                  message : "Instagram Token added successfully"
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

    //add facebook_tokens
    fbTokens:async(req,res)=>{
        smToken.findOneAndUpdate({email_id:req.params.id},{
            $set:{
                fb_access_token: req.body.fb_access_token,
                fb_id: req.body.fb_id,
            }
          })
          .then(result=>{
            res.status(200).json({
              updated_status:{
                  message : "Facebook Token added successfully"
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

    //add linkedin_tokens
    linkedinTokens:async(req,res)=>{
        smToken.findOneAndUpdate({email_id:req.params.id},{
            $set:{
                linkedin_access_token: req.body.linkedin_access_token,
                linkedin_access_token_secret: req.body.linkedin_access_token_secret,
            }
          })
          .then(result=>{
            res.status(200).json({
              updated_status:{
                  message : "Linkedin Token added successfully"
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

    //add pinterest_tokens
    pinterestTokens:async(req,res)=>{
        smToken.findOneAndUpdate({email_id:req.params.id},{
            $set:{
                pinterest_access_token: req.body.pinterest_access_token,
                pinterest_access_token_secret: req.body.pinterest_access_token_secret,
            }
          })
          .then(result=>{
            res.status(200).json({
              updated_status:{
                  message : "Pinterest Token added successfully"
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



}