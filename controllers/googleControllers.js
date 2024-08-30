const express = require('express');
const router = express.Router();
const axios=require('axios');
require("dotenv").config();
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');


const userProfile= async(req, res) => {
    try {
        const oAuth2Client = new OAuth2Client(process.env.GMB_Client_Id, process.env.GMB_Client_Secret, "https://oolook.azurewebsites.net/gmb/profile");
        const { tokens } = await oAuth2Client.getToken(req.query.code);
        console.log(tokens)
        // oAuth2Client.setCredentials(tokens);
        res.send(tokens);
        
    } catch (error) {
        console.error('Error in userProfile:', error.message);
        console.error('Error details:', error.response ? error.response.data : error);
        throw error;
    }
}

const accountId = async (req, res) => {
    try {
      // Access token from the provided details
      const accessToken = req.body.accessToken;
  
      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      };
  
      const response = await axios.get('https://mybusiness.googleapis.com/v1/accounts', config);
  
      const accounts = response.data.accounts;
      if (accounts && accounts.length > 0) {
        const firstAccountId = accounts[0].name; // This includes the account ID
        res.send(`First Account ID: ${firstAccountId}`);
      } else {
        res.send('No accounts found.');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error.message);
      if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
      }
      res.status(error.response ? error.response.status : 500).send('Error fetching accounts');
    }
  };
  

const getInsights = async (req, res) => {
    // Replace 'YOUR_ACCESS_TOKEN' with the actual access token you obtained
    const accessToken = req.body.accessToken;
  
    try {
      // Make a request to the Google My Business API to get insights
      const response = await axios.get('https://mybusiness.googleapis.com/v4/accounts/self/locations', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      // Extract and send relevant data from the API response
      const insightsData = response.data;
      res.json(insightsData);
    } catch (error) {
      // Handle errors
      console.error('Error fetching insights:', error);
      res.status(500).send('Internal Server Error');
    }
  };
module.exports={
    userProfile,
    getInsights,
    accountId
}