const express=require('express');
const axios = require('axios');
const schedule = require('node-schedule');

require("dotenv").config();
const clientID = process.env.Insta_App_Id;
const clientSecret = process.env.Insta_App_Secret;
const redirectURI = 'http://localhost:8080/instagram/handle-auth';

// api.use({
//  client_id : process.env.Insta_App_Id,
//  client_secret :process.env.Insta_App_Secret
// })
// const redirect_uri = 'https://spaceowlbackend.azurewebsites.net/instagram/handle-auth'

// const authorize_user= async (req, res)=> {
//     res.redirect(api.get_authorization_url(redirect_uri, { scope: ['ads_management','business_management','instagram_basic','instagram_content_publish','pages_read_engagement'], state: 'a state' }));
// };
// const handleauth= async (req, res)=> {
//     api.authorize_user(req.query.code, redirect_uri,function(err, result){
//         if (err) {
//             console.log(err.body);
//             res.status(400).send("Didn't work");
//         } else {
//             const token = result.accessToken;
//             res.status(201).send(token);
//         }
//     });
// }

// Function to handle LinkedIn login
const InstaLogin=async(req, res)=> {
    const authURL = `https://www.facebook.com/v12.0/dialog/oauth?` +
    `client_id=${clientID}&redirect_uri=${encodeURIComponent(redirectURI)}` +
    `&scope=ads_management,business_management,instagram_basic,instagram_content_publish,pages_read_engagement&response_type=code`;

  res.redirect(authURL);
  }

// Function to handle LinkedIn callback
const InstaCallback= async(req, res) =>{
    const code = req.query.code;
    console.log('Received code:', code);
  
    try {
      // Exchange code for access token
      const tokenResponse = await axios.get(
        `https://graph.instagram.com/v12.0/access_token?` +
        `grant_type=authorization_code&code=${code}&client_id=${clientID}` +
        `&client_secret=${clientSecret}&redirect_uri=${redirectURI}`
      );
  
      const userAccessToken = tokenResponse.data.access_token;
      console.log('User Access Token:', userAccessToken);
  
      // Exchange short-lived token for a long-lived token
      const extendedTokenResponse = await axios.get(
        `https://graph.instagram.com/v12.0/access_token?` +
        `grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${userAccessToken}`
      );
  
      const extendedUserAccessToken = extendedTokenResponse.data.access_token;
      console.log('Extended User Access Token:', extendedUserAccessToken);
  
      // Now, you can use the access token to fetch content or perform other actions
      res.send(`User Access Token: ${extendedUserAccessToken}`);
    } catch (error) {
      console.error('Error during callback:', error.response ? error.response.data : error.message);
  
      // Handle different types of errors
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error.message;
        if (errorMessage.includes("content isn't available")) {
          console.log("Content isn't available right now");
          res.send("Content isn't available right now");
        } else {
          console.log('Other error:', errorMessage);
          res.status(500).send('Other error');
        }
      } else {
        res.status(500).send('Error during callback');
      }
    }
}

const profile= async (req, res) => {
    try {
        let instaAccessToken = req.body.accessToken; // get from DB
        let ig_id = req.body.insta_id
        let resp = await axios.get(`https://graph.facebook.com/v19.0/${ig_id}?fields=id,biography,followers_count,follows_count,media_count,name,profile_picture_url,username,website&access_token=${instaAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}

const getIdUsername= async (req, res) => {
    try {
        let instaAccessToken = req.body.accessToken; // get from DB
        let resp = await axios.get(`https://graph.instagram.com/me?fields=id,username&access_token=${instaAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}
const mediaId=async(req,res)=>{
  try{
  const id =req.body.id
  const accessToken= req.body.accessToken;
  const mediaId = await axios.get(`https://graph.facebook.com/v18.0/${id}?fields=instagram_business_account&access_token=${accessToken}`);
  const resp=mediaId.data.instagram_business_account;
res.status(201).send(resp)
}
catch(e){
  res.status(400).send(e)
}
}

const mediaInsight= async (req, res) => {
    try {
        let instaAccessToken = req.body.accessToken; // get from DB
        let mediaId = req.body.mediaId; // get from DB
        let since = req.body.since; // get from DB
        let until = req.body.until; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/${mediaId}/insights?metric=impressions,reach,profile_views,email_contacts,follower_count,get_directions_clicks&period=day&since=${since}&until=${until}&access_token=${instaAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}

const impressions= async (req, res) => {
  try {
    const startDate = new Date(req.body.since);
    const endDate = new Date(req.body.until);
    const accessToken=req.body.accessToken;
    const mediaId=req.body.mediaId;

    // Calculate the date range
    const dateRange = calculateDateRange(startDate, endDate);

    // Initialize an array to store results
    const results = [];

    // Loop through the date range
    for (const date of dateRange) {
      const formattedDate = formatDate(date);

      // Make the API request
      const url = `https://graph.facebook.com/v19.0/${mediaId}/insights?pretty=0&since=${date.getTime() / 1000}&until=${(date.getTime() + 86400000) / 1000}&metric=impressions&period=day&metric_type=total_value&access_token=${accessToken}`;
      const response = await axios.get(url);

      // Append the result to the array
      results.push({
        date: formattedDate,
        data: response.data,
      });
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


const reach= async (req, res) => {
    try {
        let instaAccessToken = req.body.accessToken; // get from DB
        let mediaId = req.body.mediaId; // get from DB
        let days = req.body.days; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/v18.0/${mediaId}/insights?metric=reach&period=${days}&breakdown=media_product_type,follow_type&metric_type=total_value&access_token=${instaAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}

const total_interactions= async (req, res) => {
    try {
        let instaAccessToken = req.body.accessToken; // get from DB
        let mediaId = req.body.mediaId; // get from DB
        let since = req.body.since; // get from DB
        let until = req.body.until; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/v18.0/${mediaId}/insights?metric=total_interactions&period=day&breakdown=media_product_type&metric_type=total_value&since=${since}&until=${until}&access_token=${instaAccessToken}`);
        resp = resp.data;
        //let instaPhotos = resp.data.filter(d => d.media_type === "IMAGE").map(d => d.media_url);
        // Got insta photos
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}

const accounts_engaged= async (req, res) => {
  try {
    const startDate = new Date(req.body.since);
    const endDate = new Date(req.body.until);
    const accessToken=req.body.accessToken;
    const mediaId=req.body.mediaId;

    // Calculate the date range
    const dateRange = calculateDateRange(startDate, endDate);

    // Initialize an array to store results
    const results = [];

    // Loop through the date range
    for (const date of dateRange) {
      const formattedDate = formatDate(date);

      // Make the API request
      const url = `https://graph.facebook.com/v19.0/${mediaId}/insights?pretty=0&since=${date.getTime() / 1000}&until=${(date.getTime() + 86400000) / 1000}&metric=accounts_engaged&metric_type=total_value&period=day&access_token=${accessToken}`;
      const response = await axios.get(url);

      // Append the result to the array
      results.push({
        date: formattedDate,
        data: response.data,
      });
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


const likesCommentsShares= async (req, res) => {
    try {
        let instaAccessToken = req.body.accessToken; // get from DB
        let mediaId = req.body.mediaId; // get from DB
        let since = req.body.since; // get from DB
        let until = req.body.until; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/v18.0/${mediaId}/insights?metric=likes,comments,shares&breakdown=media_product_type&period=day&metric_type=total_value&since=${since}&until=${until}&access_token=${instaAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}

const repliesProfileviews= async (req, res) => {
    try {
        let instaAccessToken = req.body.accessToken; // get from DB
        let mediaId = req.body.mediaId; // get from DB
        let since = req.body.since; // get from DB
        let until = req.body.until; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/v18.0/${mediaId}/insights?metric=replies,profile_views,website_clicks&period=day&metric_type=total_value&since=${since}&until=${until}&access_token=${instaAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}

const followerdemography= async (req, res) => {
    try {
        let instaAccessToken = req.body.accessToken; // get from DB
        let mediaId = req.body.mediaId; // get from DB
        let breakdown = req.body.breakdown; // get from DB
        let timeframe = req.body.timeframe; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/v18.0/${mediaId}/insights?metric=follower_demographics&timeframe=${timeframe}&breakdown=[${breakdown}]&period=lifetime&metric_type=total_value&access_token=${instaAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}


const engagedAudienceDemography= async (req, res) => {
    try {
        let instaAccessToken = req.body.accessToken; // get from DB
        let mediaId = req.body.mediaId; // get from DB
        let breakdown = req.body.breakdown; // get from DB
        let timeframe = req.body.timeframe; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/v18.0/${mediaId}/insights?metric=engaged_audience_demographics&timeframe=${timeframe}&breakdown=[${breakdown}]&period=lifetime&metric_type=total_value&access_token=${instaAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send({error_user_title: "Demographic Data Isn't Available",
        error_user_msg: "You can learn about your audience once this metric has more than 100 people in each breakdown."});
    }
}

const followerUnfollower= async (req, res) => {
  try {
    const startDate = new Date(req.body.since);
    const endDate = new Date(req.body.until);
    const accessToken=req.body.accessToken;
    const mediaId=req.body.mediaId;

    // Calculate the date range
    const dateRange = calculateDateRange(startDate, endDate);

    // Initialize an array to store results
    const results = [];

    // Loop through the date range
    for (const date of dateRange) {
      const formattedDate = formatDate(date);

      // Make the API request
      const url = `https://graph.facebook.com/v19.0/${mediaId}/insights?pretty=0&since=${date.getTime() / 1000}&until=${(date.getTime() + 86400000) / 1000}&metric=follows_and_unfollows&metric_type=total_value&period=day&breakdown=follow_type&access_token=${accessToken}`;
      const response = await axios.get(url);

      // Append the result to the array
      results.push({
        date: formattedDate,
        data: response.data,
      });
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

function calculateDateRange(startDate, endDate) {
  const dateRange = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateRange;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


const reachedAudienceDemography= async (req, res) => {
    try {
        let instaAccessToken = req.body.accessToken; // get from DB
        let mediaId = req.body.mediaId; // get from DB
        let breakdown = req.body.breakdown; // get from DB
        let timeframe = req.body.timeframe; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/v18.0/${mediaId}/insights?metric=reached_audience_demographics&timeframe=${timeframe}&breakdown=[${breakdown}]&period=lifetime&metric_type=total_value&access_token=${instaAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send({error_user_title: "Demographic Data Isn't Available",
        error_user_msg: "You can learn about your audience once this metric has more than 100 people in each breakdown."});
    }
}

const postToInstagram = async (req, res) => {
  try {
    const { imageUrl, caption, accessToken, IG_USER_ID, media_type, video_url } = req.body;

    // Step 1: Create Container
    const createContainerResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${IG_USER_ID}/media`,
      {
        media_type:media_type,
        video_url:video_url,
        image_url: imageUrl,
        caption: caption,
        //add publish time
      },
      {
        params: {
          access_token: accessToken,
        },
      }
    );

    const containerId = createContainerResponse.data.id;

    await new Promise((resolve) => setTimeout(resolve, 15000)); // Adjust the delay time as needed (e.g., 5000 milliseconds)

    // Step 2: Publish Container
    const publishContainerResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${IG_USER_ID}/media_publish`,
      {
        creation_id: containerId,
      },
      {
        params: {
          access_token: accessToken,
        },
      }
    );

    const mediaId = publishContainerResponse.data.id;
    res.json({ success: true, mediaId });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};


const schedulePostToInstagram = async (req, res) => {
  try {
    const { imageUrl, caption, accessToken, IG_USER_ID, scheduleTime, media_type } = req.body;

    // Step 1: Create Container
    const createContainerResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${IG_USER_ID}/media`,
      {
        media_type:media_type,
        image_url: imageUrl,
        caption: caption,
        // add publish time
      },
      {
        params: {
          access_token: accessToken,
        },
      }
    );

    const containerId = createContainerResponse.data.id;

    // Schedule the publishing task
    const job = schedule.scheduleJob(scheduleTime, async () => {
      try {
        // Step 2: Publish Container
        const publishContainerResponse = await axios.post(
          `https://graph.facebook.com/v18.0/${IG_USER_ID}/media_publish`,
          {
            creation_id: containerId,
          },
          {
            params: {
              access_token: accessToken,
            },
          }
        );

        const mediaId = publishContainerResponse.data.id;
        res.json({ success: true, mediaId });
      } catch (publishError) {
        console.error(publishError.response?.data || publishError.message);
        res.status(500).json({ success: false, error: publishError.message });
      }
    });

    if (job === null) {
      throw new Error('Failed to schedule post. Please check the scheduleTime format.');
    }

    res.json({ success: true, message: `Post scheduled for ${scheduleTime}`, jobId: job.name });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
module.exports={
    InstaLogin,
    InstaCallback,
    profile,
    getIdUsername,
    mediaInsight,
    postToInstagram,
    mediaId,
    schedulePostToInstagram,
    impressions,
    reach,
    total_interactions,
    accounts_engaged,
    likesCommentsShares,
    repliesProfileviews,
    followerdemography,
    engagedAudienceDemography,
    reachedAudienceDemography,
    followerUnfollower
}