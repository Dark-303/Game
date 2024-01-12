let selectedCharacter = null;
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let playerPosition = { x: 100, y: 100 };
let isAttacking = false;

const serverAddress = 'ws://localhost:15430'; // Change as per your server address
const socket = new WebSocket(serverAddress);

socket.onopen = function() {
    // Connection established
};

socket.onmessage = function(event) {
    const gameState = JSON.parse(event.data);
    // Update your game's state based on gameState
};

socket.onclose = function(event) {
    if (event.wasClean) {
        console.log('Disconnected from the server');
    } else {
        console.log('Connection to server lost');
    }
};

socket.onerror = function(error) {
    console.log('WebSocket Error:', error);
};

function sendAction(action) {
    const message = JSON.stringify(action);
    socket.send(message);
}

const characters = {
    Character1: { color: 'red', lighterColor: 'pink' },
    Character2: { color: 'blue', lighterColor: 'lightblue' },
    // ... other characters
};

function selectCharacter(characterName) {
    selectedCharacter = characters[characterName];
    console.log("Selected character:", characterName);
}

function startGame() {
    if (!selectedCharacter) {
        alert("Please select a character!");
        return;
    }
    document.getElementById('characterSelection').style.display = 'none';
    canvas.style.display = 'block';
    window.addEventListener('keydown', handleKeyDown);
    gameLoop();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (selectedCharacter) {
        ctx.fillStyle = isAttacking ? selectedCharacter.lighterColor : selectedCharacter.color;
        ctx.fillRect(playerPosition.x, playerPosition.y, 50, 50);
    }
}

function update() {
    // Game update logic goes here
    if (isAttacking) {
        // Attack logic or animation
        setTimeout(() => {
            isAttacking = false;
        }, 200); // Revert color after 200ms
    }
}

function handleKeyDown(event) {
    const speed = 5;
    switch (event.key) {
        case 'w': playerPosition.y -= speed; break;
        case 's': playerPosition.y += speed; break;
        case 'a': playerPosition.x -= speed; break;
        case 'd': playerPosition.x += speed; break;
        case ' ': attack(); break;
        case '1': useArtifact(1); break;
        case '2': useArtifact(2); break;
        case '3': useArtifact(3); break;
    }
}

function attack() {
    console.log("Attack action performed");
    isAttacking = true;
    // Additional attack logic can be added here
}

function useArtifact(artifactNumber) {
    console.log("Artifact " + artifactNumber + " used");
    // Implement artifact use logic here
}

function gameLoop() {
    // Make sure this uses the most recent gameState
    draw();
    requestAnimationFrame(gameLoop);
}

// Uncomment the below line to start the game loop immediately
// gameLoop();