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

// ... [rest of the imports and setup]

let gameState = {
    players: {},
    // Add other game-specific state information here
};

function updatePlayerState(playerId, newPosition) {
    if (gameState.players[playerId]) {
        gameState.players[playerId].position = newPosition;
        // Update other player-specific state information
        broadcastGameState(); // Broadcast updated game state
    }
}

function broadcastGameState() {
    const state = JSON.stringify(gameState);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(state);
        }
    });
}

wss.on('connection', ws => {
    const id = generateUniqueId();
    players[id] = new Player(id);
    gameState.players[id] = { position: { x: 0, y: 0 } }; // Initialize player state
    console.log('Player connected with id:', id);

    ws.on('message', message => {
        console.log('received: %s', message);
        updatePlayerState()
        // Parse and handle actions here
        // For example, update player position
        // updatePlayerState(id, newPosition);
    });

    ws.on('close', () => {
        delete players[id];
        delete gameState.players[id]; // Remove player from game state
        broadcastGameState(); // Broadcast updated game state
        console.log('Player disconnected with id:', id);
    });
});

// Listen on the port provided by the environment (e.g., Glitch)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});