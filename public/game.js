const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let players = {};

// WebSocket connection
const socket = new WebSocket('ws://localhost:3000');

function startGame() {
    // Code to initialize and start the game
    // For example, make the canvas visible and start the game loop
    document.getElementById('gameCanvas').style.display = 'block';
    gameLoop();
}


socket.onmessage = function(event) {
    players = JSON.parse(event.data);
    renderGame();
};

function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Object.values(players).forEach(player => {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, 50, 50); // Draw player as a square
    });
}

window.addEventListener('keydown', (event) => {
    const action = { action: '', key: event.key };
    if (['w', 'a', 's', 'd'].includes(event.key)) {
        action.action = 'move';
    } else if (event.key === ' ') {
        action.action = 'attack';
    } // Add cases for artifacts

    socket.send(JSON.stringify(action));
});