const express = require('express');
const axios = require('axios');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require("./reddit-49d37-f112414138be.json");

const PORT = process.env.PORT || 3000;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://reddit-49d37-default-rtdb.firebaseio.com',
});

app.get('/fetchRedditData', async (req, res) => {
    try {
        const redditResponse = await axios.get(
            'https://www.reddit.com/r/FlutterDev.json'
        );
        const redditData = redditResponse.data;

        // Store data in Firebase
        const db = admin.database();
        const ref = db.ref('/redditData');
        await ref.set(redditData);

        res.json(redditData);
    } catch (error) {
        console.error('Error fetching data from Reddit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// https://reddit-49d37-default-rtdb.firebaseio.com