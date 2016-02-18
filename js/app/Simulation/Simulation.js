define([
        "app/3d/World",
        "app/3d/Board"
    ],

    function (World, Board) {

        var world = new World();
        var board = new Board();

        /**
         * Create a simulation.
         * The simulations is the main "game engine".
         * It is responsible for managing each tick.
         * @constructor
         */
        function Simulation() {
            world.add(board);
        }

        /**
         * Starts the simulation.
         */
        Simulation.prototype.runSimulation = function() {
            world.render();
        };


        // Return "class"
        return Simulation
    });