const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');


//load environment variables
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

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on("send_message", async (data) => {

        const messsage = data.message;
        const entities = await detectEntities(messsage);
        const tones = await analyzeTone(messsage);

        io.emit("receive_message", {
            message: message,
            entities: entities,
            tones: tones
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});