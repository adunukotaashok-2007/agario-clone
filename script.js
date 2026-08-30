const socket = io("https://agario-clone-v56x.onrender.com");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let myId = null;
let players = {};
let foods = [];

let camera = {
    x: 0,
    y: 0
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// =============================
// CONNECT TO SERVER
// =============================

socket.on("connect", () => {
    console.log("Connected to multiplayer server");
});

socket.on("init", (data) => {

    myId = data.id;

    players = data.players;
    foods = data.foods;

    console.log("Game started!");
});

socket.on("playerJoined", (player) => {

    players[player.id] = player;

});

socket.on("playerLeft", (id) => {

    delete players[id];

});

socket.on("gameState", (data) => {

    players = data.players;
    foods = data.foods;

    updateUI();
});


// =============================
// PLAYER MOVEMENT
// =============================

function sendMovement(screenX, screenY) {

    const me = players[myId];

    if (!me) return;

    const worldX =
        me.x +
        (screenX - canvas.width / 2);

    const worldY =
        me.y +
        (screenY - canvas.height / 2);

    socket.emit("move", {
        x: worldX,
        y: worldY
    });
}


// Tablet touch
canvas.addEventListener("pointerdown", (event) => {

    sendMovement(
        event.clientX,
        event.clientY
    );

});

canvas.addEventListener("pointermove", (event) => {

    if (event.pointerType === "mouse") {

        sendMovement(
            event.clientX,
            event.clientY
        );

    }

});


// =============================
// UI
// =============================

function updateUI() {

    const me = players[myId];

    if (me) {

        document.getElementById("score").textContent =
            "Score: " + Math.floor(me.radius * 2);

    }

    document.getElementById("players").textContent =
        "Players: " + Object.keys(players).length;
}


// =============================
// DRAW GRID
// =============================

function drawGrid() {

    const me = players[myId];

    if (!me) return;

    camera.x = me.x;
    camera.y = me.y;

    const gridSize = 50;

    ctx.strokeStyle =
        "rgba(255,255,255,0.05)";

    ctx.lineWidth = 1;

    const offsetX =
        canvas.width / 2 -
        camera.x;

    const offsetY =
        canvas.height / 2 -
        camera.y;

    for (
        let x = -3000;
        x <= 3000;
        x += gridSize
    ) {

        const screenX =
            x + offsetX;

        ctx.beginPath();

        ctx.moveTo(
            screenX,
            0
        );

        ctx.lineTo(
            screenX,
            canvas.height
        );

        ctx.stroke();
    }

    for (
        let y = -3000;
        y <= 3000;
        y += gridSize
    ) {

        const screenY =
            y + offsetY;

        ctx.beginPath();

        ctx.moveTo(
            0,
            screenY
        );

        ctx.lineTo(
            canvas.width,
            screenY
        );

        ctx.stroke();
    }
}


// =============================
// DRAW FOOD
// =============================

function drawFood() {

    for (const food of foods) {

        const x =
            canvas.width / 2 +
            food.x -
            camera.x;

        const y =
            canvas.height / 2 +
            food.y -
            camera.y;

        if (
            x < -20 ||
            x > canvas.width + 20 ||
            y < -20 ||
            y > canvas.height + 20
        ) {
            continue;
        }

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            food.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = food.color;

        ctx.fill();
    }
}


// =============================
// DRAW PLAYERS
// =============================

function drawPlayers() {

    for (const id in players) {

        const player = players[id];

        const x =
            canvas.width / 2 +
            player.x -
            camera.x;

        const y =
            canvas.height / 2 +
            player.y -
            camera.y;

        if (
            x < -player.radius ||
            x > canvas.width + player.radius ||
            y < -player.radius ||
            y > canvas.height + player.radius
        ) {
            continue;
        }

        // Circle
        ctx.beginPath();

        ctx.arc(
            x,
            y,
            player.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = player.color;

        ctx.fill();

        // Border
        ctx.strokeStyle =
            "rgba(255,255,255,0.5)";

        ctx.lineWidth = 3;

        ctx.stroke();

        // Name
        ctx.fillStyle = "white";

        ctx.font =
            "bold 16px Arial";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.fillText(
            id === myId ? "YOU" : player.name,
            x,
            y
        );
    }
}


// =============================
// GAME DRAW LOOP
// =============================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (!players[myId]) {

        ctx.fillStyle = "white";

        ctx.font = "20px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "Connecting...",
            canvas.width / 2,
            canvas.height / 2
        );

        requestAnimationFrame(draw);

        return;
    }

    drawGrid();

    drawFood();

    drawPlayers();

    requestAnimationFrame(draw);
}

draw();
