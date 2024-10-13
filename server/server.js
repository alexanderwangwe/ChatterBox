const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",    
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.send('Server is running');
});

// Call Python NLP API to detect entities
async function detectEntities(text) {
    try {
        const response = await axios.post('http://localhost:5000/detect-entities', { text });
        return response.data.entities;
    } catch (error) {
        console.error('Error calling the NLP service: ', error);
        return [];
    }
}

// Placeholder function for tone analysis (you'll need to implement or call a service)
async function analyzeTone(text) {
    // Assuming you have an external API or a function that handles tone analysis
    try {
        const response = await axios.post('http://localhost:5000/analyze-tone', { text });
        return response.data.tones;
    } catch (error) {
        console.error('Error calling the tone analysis service: ', error);
        return [];
    }
}

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on("send_message", async (data) => {
        const message = data.message;  // Fixed typo from 'messsage' to 'message'

        // Detect entities and analyze tone
        const entities = await detectEntities(message);
       // const tones = await analyzeTone(message);(missing tone analyzer service)

        // Emit the result back to the client
        io.emit("receive_message", {
            message: message,
            entities: entities,
           // tones: tones
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
