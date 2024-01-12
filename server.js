const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve main.html at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/main.html'));
});

// Create an HTTP server and pass the Express app as the handler
const server = http.createServer(app);

// Attach WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

class Player {
    constructor(id) {
        this.id = id;
        this.position = { x: 0, y: 0 };
        // Add other player properties
    }

    update(position) {
        this.position = position;
        // Update other properties
    }
}

const players = {};

function generateUniqueId() {
    return Math.random().toString(36).substring(2, 15);
}

wss.on('connection', ws => {
    const id = generateUniqueId();
    players[id] = new Player(id);
    console.log('Player connected with id:', id);

    ws.on('message', message => {
        console.log('received: %s', message);
        // Handle actions here
    });

    ws.on('close', () => {
        delete players[id];
        console.log('Player disconnected with id:', id);
    });

    // Define gameState and broadcastGameState function
    // ...
});

// Listen on the port provided by the environment (e.g., Glitch)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});