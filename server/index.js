const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Game = require("./game");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const game = new Game();

app.get("/", (req, res) => {
    res.send("Agar.io multiplayer server is running!");
});

io.on("connection", (socket) => {

    console.log("Player connected:", socket.id);

    const player = game.addPlayer(socket.id);

    socket.emit("init", {
        id: socket.id,
        players: game.players,
        foods: game.foods
    });

    socket.broadcast.emit(
        "playerJoined",
        player
    );

    socket.on("move", (data) => {

        if (
            typeof data.x === "number" &&
            typeof data.y === "number"
        ) {

            game.movePlayer(
                socket.id,
                data.x,
                data.y
            );
        }
    });

    socket.on("disconnect", () => {

        game.removePlayer(socket.id);

        io.emit(
            "playerLeft",
            socket.id
        );

        console.log(
            "Player disconnected:",
            socket.id
        );
    });
});

setInterval(() => {

    game.update();

    io.emit("gameState", {
        players: game.players,
        foods: game.foods
    });

}, 1000 / 30);

const PORT = process.env.PORT || 10000;

server.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Server running on port ${PORT}`
    );

});
