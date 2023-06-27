import React, { useState } from 'react';
import axios from 'axios';

const AudioPlayer = () => {
    const [audioUrl, setAudioUrl] = useState('');
    const [text, setText] = useState('');

    const handleGenerateAudio = () => {
        if (text) {
            const requestBody = {
                text: text,
                lang: 'hi'
            };

            axios
                .post('http://localhost:8000/generate-audio', requestBody, { responseType: 'blob' })
                .then(response => {
                    const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setAudioUrl(audioUrl);
                })
                .catch(error => {
                    console.error('Error:', error.message);
                });

        }
    };

    return (
        <div className="container">
            <div className="content">
                <p className="heading">Input your English text here</p>

                <input
                    type="text"
                    className="input"
                    onChange={(e) => setText(e.target.value)}
                />
                <button
                    className="button"
                    onClick={handleGenerateAudio}
                >
                    Translate to Hindi
                </button>
                {audioUrl && (
                    <div className="audio-container">
                        <audio src={audioUrl} controls />
                        <div className="download-container">
                            <a href={audioUrl} download="audio.mp3" className="download-button">
                                Download Audio
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );

};

export default AudioPlayer;
