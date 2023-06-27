const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { translate } = require('@vitalets/google-translate-api');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// POST API route for generating and sending the audio file
app.post('/generate-audio', async (req, res) => {
    const { text, lang } = req.body;

    const translatedText = await translate(text, { to: lang });

    const options = {
        method: 'GET',
        url: 'https://text-to-speech27.p.rapidapi.com/speech',
        params: {
            text: translatedText.text,
            lang
        },
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY,
            'X-RapidAPI-Host': 'text-to-speech27.p.rapidapi.com'
        },
        responseType: 'arraybuffer'
    };

    axios
        .request(options)
        .then(response => {
            const audioData = Buffer.from(response.data, 'binary');
            res.set({
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'inline'
            });

            res.send(audioData);

        })
        .catch(error => {
            console.error('Error:', error.message);
            res.status(500).json({ error: 'An error occurred while generating the audio file' });
        });
});

// Start the server
const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
