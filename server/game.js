class Game {

    constructor() {

        this.players = {};
        this.foods = [];

        this.worldSize = 3000;

        // Create food
        for (let i = 0; i < 150; i++) {
            this.spawnFood();
        }
    }


    // =========================
    // ADD PLAYER
    // =========================

    addPlayer(id) {

        const player = {

            id: id,

            x:
                Math.random() *
                this.worldSize -
                this.worldSize / 2,

            y:
                Math.random() *
                this.worldSize -
                this.worldSize / 2,

            radius: 30,

            color:
                `hsl(${Math.random() * 360}, 70%, 50%)`,

            name:
                "Player",

            targetX: null,
            targetY: null
        };

        this.players[id] = player;

        return player;
    }


    // =========================
    // REMOVE PLAYER
    // =========================

    removePlayer(id) {

        delete this.players[id];
    }


    // =========================
    // MOVE PLAYER
    // =========================

    movePlayer(id, x, y) {

        const player = this.players[id];

        if (!player) {
            return;
        }

        player.targetX = x;
        player.targetY = y;
    }


    // =========================
    // CREATE FOOD
    // =========================

    spawnFood() {

        this.foods.push({

            x:
                Math.random() *
                this.worldSize -
                this.worldSize / 2,

            y:
                Math.random() *
                this.worldSize -
                this.worldSize / 2,

            radius: 5,

            color:
                `hsl(${Math.random() * 360}, 80%, 60%)`
        });
    }


    // =========================
    // GAME UPDATE
    // =========================

    update() {

        for (const id in this.players) {

            const player = this.players[id];


            // -------------------------
            // MOVEMENT
            // -------------------------

            if (
                player.targetX !== null &&
                player.targetY !== null
            ) {

                const dx =
                    player.targetX -
                    player.x;

                const dy =
                    player.targetY -
                    player.y;

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (distance > 2) {

                    const speed =
                        Math.max(
                            2,
                            5 -
                            player.radius * 0.02
                        );

                    player.x +=
                        (dx / distance) *
                        speed;

                    player.y +=
                        (dy / distance) *
                        speed;
                }
            }


            // -------------------------
            // WORLD BOUNDARY
            // -------------------------

            const limit =
                this.worldSize / 2;

            player.x =
                Math.max(
                    -limit,
                    Math.min(
                        limit,
                        player.x
                    )
                );

            player.y =
                Math.max(
                    -limit,
                    Math.min(
                        limit,
                        player.y
                    )
                );


            // -------------------------
            // EAT FOOD
            // -------------------------

            for (
                let i =
                    this.foods.length - 1;

                i >= 0;

                i--
            ) {

                const food =
                    this.foods[i];

                const dx =
                    player.x -
                    food.x;

                const dy =
                    player.y -
                    food.y;

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    distance <
                    player.radius +
                    food.radius
                ) {

                    player.radius += 0.5;

                    this.foods.splice(i, 1);

                    this.spawnFood();
                }
            }
        }
    }
}


module.exports = Game;
