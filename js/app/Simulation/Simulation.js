/**
 * The simulation is the main "game engine".
 * It is responsible for managing each Scalatron server tick.
 */
define([
    "lib/three",
    "app/Simulation/Board",
    "app/Common/Static",
    "app/Simulation/BoardCreator"
  ],

  function (THREE, Board, Static, BoardCreator) {

    var board = new Board();
    var tickCount = 0;
    var isRunning = false;
    var tickQueue = [];
    var queueLength = 0;

    /**
     * Create a simulation.
     * @constructor
     */
    function Simulation() {
    }

    /**
     * Starts the main "tick loop".
     * Tick loop matches each "Scalatron tick", not to be confused
     * with the main render loop that draws on screen.
     */
    Simulation.prototype.runSimulation = function () {
      isRunning = true;
      log(tickQueue);

      if (tickQueue.length > 0) {
        board.init(BoardCreator.create(tickQueue[0]));
        board.runSimulation();
        __startMainTickLoop();
        return;
      }
      throw new Error("Could not run simulation. No initial tick data.");
    };

    /**
     * Adds tick to the queue
     * @param tickData
     */
    Simulation.prototype.addTick = function (tickData) {
      tickQueue.push(tickData);
      queueLength++;
      if (!isRunning) {
        this.runSimulation();
      }
    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Starts the main tick loop.
     * @private
     */
    function __startMainTickLoop() {
      setInterval(function () {
        if (tickCount < queueLength) {
          __tick(tickQueue[tickCount]);
        } else {
          // TODO: Implement some buffering
          log("Buffering...");
        }
      }.bind(this), Static.TimePerTick);
    }

    /**
     * Perform a tick.
     * @param tickData
     * @private
     */
    function __tick(tickData) {
      // TODO: Send in state data from sever here...
      var targetTime = new Date().getTime() + Static.TimePerTick;
      board.tick(tickCount, targetTime);
      tickCount++;
    }

    // Return "class"
    return Simulation;
  });