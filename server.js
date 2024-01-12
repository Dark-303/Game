const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 15430 });

class Player {
    constructor(id) {
        this.id = id;
        this.position = { x: 0, y: 0 };
        // any other player properties
    }

    // method to update the player's position, etc.
    update(position) {
        this.position = position;
        // update other properties based on game logic
    }
}
const players = {};

function generateUniqueId() {
    // This is a simple method to generate a unique string - in a production environment you'd want something more robust
    return Math.random().toString(36).substring(2, 15);
}

server.on('connection', ws => {
    const id = generateUniqueId();
    players[id] = new Player(id); // Corrected this line
    console.log('Player connected with id:', id);

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        const action = JSON.parse(message);
        // Handle different types of actions
    });

    ws.on('close', () => {
        delete players[id]; // Corrected this line
        console.log('Player disconnected with id:', id);
    });

    const gameState = {/* ... */};
    const broadcastGameState = () => {
        const state = JSON.stringify(gameState);
        server.clients.forEach(client => { // Corrected wss to server
            if (client.readyState === WebSocket.OPEN) {
                client.send(state);
            }
        });
    };  
    // Call broadcastGameState at regular intervals or on specific game events
});