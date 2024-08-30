const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const{OnBoarding3} = require('../models/OnBoarding3');

const addOnBoarding3 = async (req, res) => {
  // upload(req, res, (err) => {
  //     if (err) {
  //         return res.status(500).json({ error: err.message });
  //     }

      const { email_id, brand_color, brand_font } = req.body;
      const { brand_logo, brand_photos, brand_videos } = req.files;

      // Check if required fields are present
      if (!email_id || !brand_color || !brand_font || !brand_logo || !brand_photos || !brand_videos) {
          return res.status(400).json({ error: "Missing required fields" });
      }

      OnBoarding3.findOne({ email_id: email_id }).exec().then((onboarding3) => {
          if (onboarding3) {
              return res.status(401).json({
                  message: "Email ID already exists",
                  data: undefined
              });
          } else {
              const onboarding3 = new OnBoarding3({
                  email_id: email_id,
                  brand_logo: brand_logo[0].filename,
                  brand_color: brand_color,
                  brand_font: brand_font,
                  brand_photos: brand_photos[0].filename,
                  brand_videos: brand_videos[0].filename
              });
              onboarding3.save().then(() => {
                  res.send({
                      message: "OnBoarding 3 added Successfully"
                  });
              }).catch((e) => {
                  res.send(e);
              });
          }
      });
  };



module.exports = {

    //add onboarding 3
    addOnBoarding3 ,

    //get onboarding 3
    getOnBoarding3 : async (req, res) => {
        OnBoarding3.find({
            email_id:req.params.id
        })
        .then(result => {
          res.status(200).json({
            OnBoarding_3:result
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