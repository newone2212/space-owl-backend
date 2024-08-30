const axios = require('axios');
const FormData = require('form-data');
const uploadPost = async (req, res) => {

    const pageAccessToken = req.body.accessToken // Replace with your actual Page access token
    const pageId = req.body.pageId; // Replace with your actual Page ID
    const message = req.body.message; // Replace with your desired message

    const url = `https://graph.facebook.com/v14.0/${pageId}/feed`;

    axios.post(url, {
        message: message,
        access_token: pageAccessToken,
    })
        .then(response => {
            res.status(200).json({'Post ID': response.data});
        })
        .catch(error => {
            res.status(400).json({'Error posting to Facebook Page': error.response ? error.response.data : error.message});
        });

};

const imagePost = async (req, res) => {
    try {
        const pageAccessToken = req.body.accessToken; // Replace with your actual Page access token
        const pageId = req.body.pageId; // Replace with your actual Page ID
        const message = req.body.message; // Replace with your desired message
        const imageUrl = req.body.imageUrl; // Replace with the URL of the image or video

        const url = `https://graph.facebook.com/v14.0/${pageId}/photos`; // For photos
        // const url = `https://graph.facebook.com/v14.0/${pageId}/videos`; // For videos

        const formData = new FormData();
        formData.append('message', message);
        formData.append('access_token', pageAccessToken);
        formData.append('url', imageUrl);

        const response = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        res.status(200).json({ 'Post ID': response.data.id });
    } catch (error) {
        res.status(400).json({ 'Error posting to Facebook Page': error.response ? error.response.data : error.message });
    }
};

const schedulePost = async (req, res) => {
  try {
      const pageAccessToken = req.body.accessToken;
      const pageId = req.body.pageId;
      const message = req.body.message;
      const scheduledTime = new Date(req.body.scheduledTime);
      // Subtract 5 hours and 30 minutes
      scheduledTime.setUTCHours(scheduledTime.getUTCHours() - 5);
      scheduledTime.setUTCMinutes(scheduledTime.getUTCMinutes() - 30);

      // Adjust the scheduled time to UTC and get the timestamp in seconds
      const scheduledTimeUTCAdjusted = scheduledTime.toISOString();

      // Log the scheduled time
      console.log('Scheduled Time (UTC Adjusted):', scheduledTimeUTCAdjusted);

      // Step 1: Create a Post with a placeholder message
      const createPostUrl = `https://graph.facebook.com/v14.0/${pageId}/feed`;

      const createPostData = {
          message: message,
          published: false,
          scheduled_publish_time: scheduledTimeUTCAdjusted,
          access_token: pageAccessToken,
      };

      const createResponse = await axios.post(createPostUrl, createPostData);

      // Log the initial post creation response
      console.log('Create Post Response:', createResponse.data);

      // Step 2: Update the Post with the desired message
      const postId = createResponse.data.id;
      const updatePostUrl = `https://graph.facebook.com/v14.0/${postId}`;

      const updatePostData = {
          message: message,
          access_token: pageAccessToken,
      };

      const updateResponse = await axios.post(updatePostUrl, updatePostData);

      // Log the post update response
      console.log('Update Post Response:', updateResponse.data);

      res.status(200).json({ 'Scheduled Post ID': postId, success: true });
  } catch (error) {
      // Log the error details
      console.error('Error scheduling post on Facebook Page:', error.response ? error.response.data : error.message);

      res.status(400).json({ 'Error scheduling post on Facebook Page': error.response ? error.response.data : error.message, success: false });
  }
};

const insights= async (req, res) => {
    try {
        let FBAccessToken = req.body.accessToken; // get from DB
        let mediaId = req.body.mediaId; // get from DB
        let since = req.body.since; // get from DB
        let until = req.body.until; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/${mediaId}/insights?metric=page_impressions,page_impressions_unique,page_impressions_paid,page_impressions_paid_unique,page_impressions_by_story_type,page_impressions_by_story_type_unique,page_impressions_by_city_unique,page_impressions_by_country_unique,page_impressions_by_locale_unique,page_impressions_by_age_gender_unique,page_impressions_frequency_distribution,page_impressions_organic_v2,page_impressions_organic_unique_v2,page_impressions_viral,page_impressions_viral_unique,page_impressions_nonviral,page_impressions_nonviral_unique,page_impressions_by_story_type,page_impressions_by_story_type_unique,page_impressions_by_city_unique,page_impressions_by_country_unique,page_impressions_by_locale_unique,page_impressions_by_age_gender_unique,page_impressions_frequency_distribution,page_impressions_viral_frequency_distribution,page_engaged_users&period=day&since=${since}&until=${until}&access_token=${FBAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}


const postId= async (req, res) => {
    try {
        let FBAccessToken=req.body.accessToken
        let mediaId = req.body.mediaId; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/v19.0/${mediaId}/feed?access_token=${FBAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}

const photosId= async (req, res) => {
    try {
        let FBAccessToken=req.body.accessToken
        let mediaId = req.body.mediaId; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/v19.0/${mediaId}/photos?access_token=${FBAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}

const videosId= async (req, res) => {
    try {
        let FBAccessToken=req.body.accessToken
        let mediaId = req.body.mediaId; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/v19.0/${mediaId}/videos?access_token=${FBAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}

const pagePostReaction= async (req, res) => {
    try {
        let FBAccessToken=req.body.accessToken
        let pagePostId = req.body.pagePostId; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/${pagePostId}/insights?metric=post_reactions_like_total,post_reactions_love_total,post_reactions_wow_total,post_reactions_haha_total,post_reactions_sorry_total,post_reactions_anger_total,post_reactions_by_type_total&period=lifetime&access_token=${FBAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}

const metrics= async (req, res) => {
    try {
        let FBAccessToken=req.body.accessToken
        let mediaId = req.body.mediaId; // get from DB
        let since = req.body.since; // get from DB
        let until = req.body.until; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/v19.0/${mediaId}/insights?metric=page_daily_follows,page_daily_follows_unique,page_daily_unfollows,page_daily_unfollows_unique,page_follows,page_views_total,page_fans&period=day&since=${since}&until=${until}&access_token=${FBAccessToken}`);//page_fans,page_follows
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}

const about= async (req, res) => {
    try {
        let FBAccessToken=req.body.accessToken
        let pagePostId = req.body.pagePostId; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/v19.0/me/friendlists?access_token=${FBAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}
//conversation and psid get Api created
const Psid= async (req, res) => {
    try {
        let FBAccessToken=req.body.accessToken
        let pagePostId = req.body.pagePostId; // get from DB
        let resp = await axios.get(`https://graph.facebook.com/v19.0/me/conversations?fields=participants,messages{id,message}access_token=${FBAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}
//send Messages
const SendPsid= async (req, res) => {
    try {
        let FBAccessToken=req.body.accessToken
        let pagePostId = req.body.pagePostId;
        let PSID=req.body.psid
        let text=req.body.text
        let resp = await axios.post(`https://graph.facebook.com/v19.0/${pagePostId}/messages?recipient={id:${PSID}}&message={text:${text}}&messaging_type=RESPONSEaccess_token=${FBAccessToken}`);
        resp = resp.data;
        res.status(201).send(resp)
    } catch (e) {
        res.status(400).send(e);
    }
}
  

module.exports={
    uploadPost,
    schedulePost,
    insights,
    postId,
    photosId,
    videosId,
    pagePostReaction,
    about,
    metrics,
    imagePost,
    Psid,
    SendPsid
}