const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/fetchRedditData', async (req, res) => {
  try {
    const redditResponse = await axios.get(
      'https://www.reddit.com/r/FlutterDev.json'
    );
    const redditData = redditResponse.data;
    res.json(redditData);
  } catch (error) {
    console.error('Error fetching data from Reddit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
