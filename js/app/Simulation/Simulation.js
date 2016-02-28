/**
 * The simulation is the main "game engine".
 * It is responsible for managing each Scalatron server tick.
 */
define([
    "lib/three",
    "app/Simulation/Board",
    "app/Common/Static"
  ],

  function (THREE, Board, Static) {

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
      }.bind(this), Static.TimePerTick);
    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     *  Perform a tick.
     */
    function __tick() {
      // TODO: Send in state data from sever here...
      var targetTime = new Date().getTime() + Static.TimePerTick;
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
          1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
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