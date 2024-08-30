// controllers/tweetController.js
const Twitter = require('twitter-lite');
// Replace these values with your Twitter API credentials
const TWITTER_CONSUMER_KEY = process.env.Tw_API_KEY
const TWITTER_CONSUMER_SECRET = process.env.Tw_API_KEY_SECRET;

const postTweet = async (req, res) => {
  try {
    const { accessTokenKey, accessTokenSecret, tweetText } = req.body;


    // Create a Twitter client
    const client = new Twitter({
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
      access_token_key: accessTokenKey,
      access_token_secret: accessTokenSecret,
    });

    // Post a tweet
    const response = await client.post('statuses/update', {
      status: tweetText,
    });

    res.json({ success: true, tweet: response });
  } catch (error) {
    console.error('Error posting tweet:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const getTweets = async (req, res) => {
    try {
      const { accessTokenKey, accessTokenSecret } = req.body;
  
      // Create a Twitter client
      const client = new Twitter({
        consumer_key: TWITTER_CONSUMER_KEY,
        consumer_secret: TWITTER_CONSUMER_SECRET,
        access_token_key: accessTokenKey,
        access_token_secret: accessTokenSecret,
      });
  
      // Get user's timeline tweets
      const response = await client.get('2/users/me', { count: 10 }); // Adjust count as needed
  
      res.json({ success: true, tweets: response });
    } catch (error) {
      console.error('Error getting tweets:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };

module.exports = {
  postTweet,
  getTweets,

};
