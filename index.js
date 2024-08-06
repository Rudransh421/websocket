const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

let userCount = 0;

io.on('connection', (socket) => {
    userCount++;
    console.log('a user connected');
    
    // Notify all users about a new user
    io.emit('system message', `A new user has joined the chat. (${userCount} users online)`);

    // Listen for chat messages
    socket.on('chat message', (data) => {
        io.emit('chat message', data); // Broadcast message to all clients
    });

    socket.on('disconnect', () => {
        userCount--;
        console.log('user disconnected');
        io.emit('system message', `A user has left the chat. (${userCount} users online)`);
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
