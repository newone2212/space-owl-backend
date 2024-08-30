const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');
require("dotenv").config();

const clientID = process.env.ln_clientID;
const clientSecret = process.env.ln_clientSecret;
const redirectURI = 'https://oolook.azurewebsites.net/Dashboard/Profile';


// Function to handle LinkedIn login
async function linkedinLogin(req, res) {
    try {
        const authURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}&state=123456&scope=w_member_social;`;
        res.redirect(authURL);
        
    } catch (error) {
      console.error('Error during LinkedIn login:', error);
      res.status(500).send('Error during LinkedIn login');
    }
  }

// Function to handle LinkedIn callback
async function linkedinCallback(req, res) {
    console.log('Received callback request:', req.query); // Log the entire query object

    const code = req.query.code;
    console.log('Received code:', code);

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectURI,
        client_id: clientID,
        client_secret: clientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    // Now you have the access token, you can use it to post content or perform other actions

    res.send('Login successful! Access Token: ' + accessToken);
  } catch (error) {
    console.error('Error during LinkedIn callback:', error.response.data);
    res.status(500).send('Error during LinkedIn callback');
  }
}

const getLinkedInPosts = async (req, res) => {
    const accessToken = req.body.accessToken // Access token obtained during login
    console.log("access token :",accessToken)


    try {
        // Make a request to fetch user's profile to get the user ID
        const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
    
        const userId = profileResponse.data.id;
    
        // Make a request to fetch user's posts
        const response = await axios.get(`https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${userId})`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
    
        const posts = response.data;
        res.json(posts);
      } catch (error) {
        console.error('Error fetching LinkedIn posts:', error.response.data);
        res.status(500).json({ error: 'Error fetching LinkedIn posts' });
      }
  }

  
  const scheduleLinkedInPost = async (req, res) => {
    try {
      const accessToken = req.body.accessToken; // Replace with your authentication mechanism
      const text = req.body.text; // Text content of the post
      const filePath = req.body.filePath; // Path to the file you want to attach
  
      // LinkedIn API endpoint for scheduling a post
      const postEndpoint = 'https://api.linkedin.com/v2/ugcPosts';
  
      // Read the file content
      const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });
  
      // Prepare the post data
      const postData = {
        author: 'urn:li:person:me',
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text,
            },
            shareMediaCategory: 'IMAGE',
            media: [
              {
                media: fileContent,
                status: 'READY',
              },
            ],
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'CONNECTIONS',
        },
      };
  
      // Make the API request to schedule the post
      const response = await axios.post(postEndpoint, postData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      // Handle the response from the LinkedIn API
      res.json(response.data);
    } catch (error) {
      console.error('Error scheduling LinkedIn post:', error);
      res.status(500).json({ error: 'Error scheduling LinkedIn post' });
    }
  };

  const getLinkedInInbox = async (req, res) => {
    try {
      const accessToken = req.body.accessToken; // Replace with your authentication mechanism
  
      // LinkedIn API endpoint for retrieving the user's inbox
      const inboxEndpoint = 'https://api.linkedin.com/v2/me/conversations';
  
      // Make the API request to get the inbox
      const response = await axios.get(inboxEndpoint, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      // Handle the response from the LinkedIn API
      res.json(response.data);
    } catch (error) {
      console.error('Error getting LinkedIn inbox:', error);
      res.status(500).json({ error: 'Error getting LinkedIn inbox' });
    }
  };
  
  
  

module.exports = {
  linkedinLogin,
  linkedinCallback,
  getLinkedInPosts,
  scheduleLinkedInPost,
  getLinkedInInbox,
}
