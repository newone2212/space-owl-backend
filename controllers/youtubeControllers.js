const express = require('express');
const router = express.Router();
require("dotenv").config();
const axios = require("axios");
const { google } = require('googleapis');
// const { OAuth2 } = google.auth;
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // specify the destination folder
const private_keys=require('../private_keys/youtube.json')



// Controller function to schedule a video
const scheduleVideo = async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const tags = req.body.tags;
  const category_id = req.body.category_id;
  const privacy_status = req.body.privacy_status;
  const publish_at=new Date(req.body.publish_at);

  const oAuth2Client = new OAuth2Client(
    process.env.Yt_Client_ID,
    process.env.Yt_Client_Secret,
    'http://localhost:8080/youtube/profile'
  );

  oAuth2Client.setCredentials(req.body);

  const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });
  console.log(req.file.path, 88, __dirname)
  try {
    const data = fs.createReadStream(
     req.file.path
    );

    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: title,
          description: description,
          tags: tags,
          categoryId: category_id,
        },
        status: {
          privacyStatus: privacy_status,
          uploadStatus: 'uploaded',
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: data,
      },
      notifySubscribers: false,
      requestBody: {
        status: {
          privacyStatus: privacy_status,
          publishAt: publish_at.toISOString(), // Set the scheduled publish time
        },
      },
    });

    console.log('YouTube API Response:', response.data);

    res.status(200).json({
      message: 'Video scheduled successfully:',
      results: response.data,
    });
  } catch (error) {
    console.error('Error scheduling video:', error);

    res.status(400).json({
      message: 'Error scheduling video:',
      error: error.message,
    });
  }
};

//channel details
const getChannelDetails = (req, res) => {
  const accessToken = req.body.accessToken; // Replace with your actual access token

  const youtube = google.youtube({
    version: 'v3',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  const requestParams = {
    part: 'snippet,contentDetails,statistics',
    mine: true,
  };
  
  youtube.channels.list(requestParams, (err, result) => {
    if (err) {
      console.error('Error fetching channel data:', err);
      // Handle the error and send an error response
      return res.status(500).send('Error fetching channel data');
    }
  
    const channel = result.data.items[0];
    if (channel) {
      const channelDetails = {
        channelId: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        publishedAt: channel.snippet.publishedAt,
        country: channel.snippet.country,
        viewCount: channel.statistics.viewCount,
        subscriberCount: channel.statistics.subscriberCount,
        videoCount: channel.statistics.videoCount,
      };
  
      // Send the channel details as a response
      res.send(channelDetails);
    } else {
      // Send a response indicating that the channel was not found
      res.status(404).send('Channel not found');
    }
  });
}

//video details
const getVideoDetails = async (req, res) => {
  const apiKey = process.env.Yt_API_KEY;  // Replace with your actual API key
  const channelId = req.body.channelId;
 // Create a YouTube Data API client
 const options = {
  method: 'GET',
  url: `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${[apiKey]}`
};

try {
  const response = await axios.request(options);
  res.send(response.data);
} catch (error) {
  res.send(error);
}
}

//get the metrics
const metrics =  async(req,res)=>{
  // Load the client secrets file obtained from the Google Cloud Console.
const channelId=req.body.channelId
const startDate=req.body.startDate
const lastDate=req.body.lastDate
const metric=req.body.metric

// Set up OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  private_keys.web.client_id,
  private_keys.web.client_secret,
  private_keys.web.redirect_uris[0]
);

// Set the access token (you should obtain this through the OAuth2 flow)
const accessToken = req.body.accessToken;
oauth2Client.setCredentials({ access_token: accessToken });

// Create a YouTube Analytics API instance
const youtubeAnalytics = google.youtubeAnalytics('v2');
async function getYouTubeAnalyticsData() {
  try {
    const params = {
      auth: oauth2Client,
      ids: `channel==${channelId}`,
      startDate: startDate,
      endDate: lastDate,
      metrics: metric,
      dimensions: ['day'],
    };

const response = await youtubeAnalytics.reports.query(params);
res.send(response.data);
} catch (error) {
  res.status(500).send({ error: 'Error fetching YouTube Analytics Data' });
}
}

getYouTubeAnalyticsData();
}


//insights
const getYouTubeInsights = async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: req.body.accessToken, // Replace with your actual access token
    });

    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    const channelsResponse = await youtube.channels.list({
      mine: true,
      part: 'snippet,contentDetails,statistics',
    });

    const channel = channelsResponse.data.items[0];
    const { snippet, statistics } = channel;

    res.json({
      title: snippet.title,
      description: snippet.description,
      viewCount: statistics.viewCount,
      subscriberCount: statistics.subscriberCount,
    });
  } catch (error) {
    console.error('Error fetching YouTube insights:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
  scheduleVideo,
  getYouTubeInsights,
  getChannelDetails,
  getVideoDetails,
  metrics,
    userProfile: async(req, res) => {
      try {
          const oAuth2Client = new OAuth2Client(process.env.Yt_Client_ID, process.env.Yt_Client_Secret, "https://oolook.azurewebsites.net/youtube/profile");
          const { tokens } = await oAuth2Client.getToken(req.query.code);
          console.log(tokens)
          // oAuth2Client.setCredentials(tokens);
          res.send(tokens);
          
      } catch (error) {
          console.error('Error in userProfile:', error.message);
          console.error('Error details:', error.response ? error.response.data : error);
          throw error;
      }
  },

  uploadVideo: async (req, res) => {
    const title=req.body.title;
    const description=req.body.description;
    const tags=req.body.tags;
    const category_id=req.body.category_id;
    const privacy_status=req.body.privacy_status;

    const oAuth2Client = new OAuth2Client(process.env.Yt_Client_ID, process.env.Yt_Client_Secret, "https://oolook.azurewebsites.net/youtube/profile");
    // console.log(req)
    oAuth2Client.setCredentials(req.body);
    const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });
    console.log(req.file.path, 88, __dirname)
    try {
      data = fs.createReadStream( req.file.path);
      youtube.videos.insert(
          {
            part: 'snippet,status',
            requestBody: {
              snippet: {
                title: title,
                description: description,
                tags: tags,
                categoryId: category_id, // Specify the category ID for the video
              },
              status: {
                privacyStatus: privacy_status, // Set to 'public', 'private', or 'unlisted'
              },
            },
            media: {
              body: data,
            },
          },
          (err, result) => {
            if (err) {
              res.status(400).json({
                message:'Error uploading video:', 
                error : err
              });
            } else {
              res.status(200).json({
                message:'Video uploaded successfully:', 
                results:result.data});
            }
          }
        );
    }
    catch (error) {
      res.status(401).json(error)
    }

  }
};
