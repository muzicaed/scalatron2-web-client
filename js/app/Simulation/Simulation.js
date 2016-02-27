/**
 * The simulations is the main "game engine".
 * It's responsible for managing each Scalatron server tick.
 */
define([
        "lib/three",
        "app/Simulation/Board"
    ],

    function (THREE, Board) {

        var TIME_PER_TICK = 3000; // Time on screen for each tick (ms) - Simulation speed
        var board = new Board();
        var tickCount = 0;

        /**
         * Create a simulation.
         * @constructor
         */
        function Simulation() {
            var boardData = __generateTestBoardData();
            board.init(boardData);
        }

        /**
         * Starts the main "tick loop".
         * Tick loop matches each "Scalatron tick", not to be confused
         * with the main render loop that draws on screen.
         */
        Simulation.prototype.runSimulation = function () {
            __tick();
            board.runSimulation();
            
            setInterval(function () {
                __tick();
            }.bind(this), TIME_PER_TICK);
        };

        /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         *  Perform a tick.
         */
        function __tick() {
            // TODO: Send in state data from sever here...
            var targetTime = new Date().getTime() + TIME_PER_TICK;
            board.tick(tickCount, targetTime);
            tickCount++;
        }

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
        return Simulation;
    });