const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Serve main.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/main.html'));
});

// Attach WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/main.html'));
  });  

const players = {};

wss.on('connection', (ws) => {
    const playerId = generateUniqueId();
    players[playerId] = { x: 0, y: 0, color: 'red' }; // Initial player state

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        handlePlayerAction(playerId, data);
    });

    ws.on('close', () => {
        delete players[playerId]; // Remove player on disconnect
        broadcastGameState();
    });
});

function handlePlayerAction(playerId, data) {
    const player = players[playerId];
    if (!player) return;

    switch (data.action) {
        case 'move':
            // Update player position based on key press (WASD)
            const speed = 5; // Adjust speed as needed
            if (data.key === 'w') player.y -= speed;
            if (data.key === 's') player.y += speed;
            if (data.key === 'a') player.x -= speed;
            if (data.key === 'd') player.x += speed;
            break;
        case 'attack':
            // Handle attack action
            player.color = 'lighterColor'; // Example: Change color on attack
            setTimeout(() => player.color = 'normalColor', 200); // Revert after delay
            break;
        // Handle other actions like artifacts
    }
    broadcastGameState();
}


function broadcastGameState() {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(players));
        }
    });
}

function generateUniqueId() {
    return Math.random().toString(36).substring(2, 9);
}

server.listen(3000, () => {
    console.log('Server started on port 3000');
});