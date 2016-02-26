define([
        "lib/three",
        "app/Simulation/Board",
        "app/Simulation/Timer"
    ],

    function (THREE, Board, Timer) {

        var TIME_PER_TICK = 1000; // Time on screen for each tick (ms) - Simulation speed
        var board = new Board();


        /**
         * Create a simulation.
         * The simulations is the main "game engine".
         * It is responsible for managing each tick.
         * @constructor
         */
        function Simulation() {
            var boardData = __generateTestBoardData();
            board.init(boardData);
        }

        /**
         * Starts the simulation.
         */
        Simulation.prototype.runSimulation = function () {
            this.__startTickLoop();
            board.runSimulation();

        };

        /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Starts the main "tick loop".
         * Tick loop matches each "Scalatron tick" not to be confused
         * with the main render loop that draws on screen.
         * @private
         */
        Simulation.prototype.__startTickLoop = function () {

            var testBot = board.addMasterBot({x: 7, y: 9});

            var timer = new Timer(function () {
                log("Test.");
            }, TIME_PER_TICK);
            timer.start();
        };

        /**
         *  TODO: Remove
         *  Generates static test data for a board.
         */
        function __generateTestBoardData() {
            return {
                width: 16,
                height: 16,
                grid: [
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1
                ]
            };
        }

        // Return "class"
        return Simulation
    });