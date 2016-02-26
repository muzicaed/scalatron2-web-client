/**
 * The simulations is the main "game engine".
 * It's responsible for managing each Scalatron server tick.
 */
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
        };

        /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Starts the main "tick loop".
         * Tick loop matches each "Scalatron tick" not to be confused
         * with the main render loop that draws on screen.
         * @private
         */
        Simulation.prototype.__startTickLoop = function () {
            var tickCount = 0;
            var timer = new Timer(function () {
                // TODO: Send in state data from sever here...
                board.tick(tickCount, TIME_PER_TICK);
                tickCount++;
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