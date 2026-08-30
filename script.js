const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let player = {
    x: 0,
    y: 0,
    radius: 30,
    color: "#22c55e"
};

let foods = [];

const WORLD_SIZE = 3000;

// -------------------------
// Canvas
// -------------------------

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// -------------------------
// Food
// -------------------------

function createFood() {
    return {
        x: Math.random() * WORLD_SIZE - WORLD_SIZE / 2,
        y: Math.random() * WORLD_SIZE - WORLD_SIZE / 2,
        radius: 5,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`
    };
}

for (let i = 0; i < 150; i++) {
    foods.push(createFood());
}

// -------------------------
// Movement
// -------------------------

let targetX = player.x;
let targetY = player.y;

function movePlayer(screenX, screenY) {

    targetX =
        player.x +
        (screenX - canvas.width / 2);

    targetY =
        player.y +
        (screenY - canvas.height / 2);
}

canvas.addEventListener("pointerdown", function (event) {
    movePlayer(event.clientX, event.clientY);
});

canvas.addEventListener("pointermove", function (event) {
    if (event.pointerType === "mouse") {
        movePlayer(event.clientX, event.clientY);
    }
});

// -------------------------
// Update
// -------------------------

function update() {

    const dx = targetX - player.x;
    const dy = targetY - player.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 2) {

        const speed = Math.max(
            2,
            5 - player.radius * 0.02
        );

        player.x += (dx / distance) * speed;
        player.y += (dy / distance) * speed;
    }

    // Eat food
    for (let i = foods.length - 1; i >= 0; i--) {

        const food = foods[i];

        const dx = player.x - food.x;
        const dy = player.y - food.y;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if (distance < player.radius + food.radius) {

            player.radius += 0.5;

            foods.splice(i, 1);
            foods.push(createFood());
        }
    }

    document.getElementById("score").textContent =
        "Score: " + Math.floor(player.radius * 2);
}

// -------------------------
// Grid
// -------------------------

function drawGrid() {

    const gridSize = 50;

    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;

    const offsetX =
        canvas.width / 2 -
        player.x;

    const offsetY =
        canvas.height / 2 -
        player.y;

    for (
        let x = -WORLD_SIZE;
        x <= WORLD_SIZE;
        x += gridSize
    ) {

        const screenX = x + offsetX;

        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, canvas.height);
        ctx.stroke();
    }

    for (
        let y = -WORLD_SIZE;
        y <= WORLD_SIZE;
        y += gridSize
    ) {

        const screenY = y + offsetY;

        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(canvas.width, screenY);
        ctx.stroke();
    }
}

// -------------------------
// Draw
// -------------------------

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawGrid();

    // Draw food
    for (const food of foods) {

        const screenX =
            canvas.width / 2 +
            food.x -
            player.x;

        const screenY =
            canvas.height / 2 +
            food.y -
            player.y;

        if (
            screenX < -20 ||
            screenX > canvas.width + 20 ||
            screenY < -20 ||
            screenY > canvas.height + 20
        ) {
            continue;
        }

        ctx.beginPath();

        ctx.arc(
            screenX,
            screenY,
            food.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = food.color;
        ctx.fill();
    }

    // Draw player
    ctx.beginPath();

    ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        player.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = player.color;
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Player name
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "You",
        canvas.width / 2,
        canvas.height / 2
    );
}

// -------------------------
// Game Loop
// -------------------------

function gameLoop() {

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
