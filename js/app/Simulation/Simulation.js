/**
 * The simulation is the main "game engine".
 * It is responsible for managing each Scalatron server tick.
 */
define([
    "lib/three",
    "app/Simulation/Board",
    "app/Common/Static",
    "app/Simulation/BoardCreator",
    "app/3d/Resources/Colors"
  ],

  function (THREE, Board, Static, BoardCreator, Colors) {

    var board = new Board();
    var tickCount = 0;
    var isRunning = false;
    var tickQueue = [];
    var queueLength = 0;
    var mainLoopId;

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
      if (tickQueue.length > 0) {
        var firstTick = tickQueue[0];
        board.init(BoardCreator.create(firstTick));
        Colors.reserveColors(firstTick);
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

    /**
     * Change the simulation speed
     * @param tickData
     */
    Simulation.prototype.changeSpeed = function (timePerTick) {
      Static.TimePerTick = timePerTick;
      clearInterval(mainLoopId);
      __startMainTickLoop();
    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Starts the main tick loop.
     * @private
     */
    function __startMainTickLoop() {
      mainLoopId = setInterval(function () {
        if (tickCount < queueLength) {
          __tick(tickQueue[tickCount]);
        } else {
          log("Not ticks.. Skip");
          clearInterval(mainLoopId);
          setTimeout(__startMainTickLoop, 5000);
        }
      }.bind(this), Static.TimePerTick);
    }

    /**
     * Perform a tick.
     * @param tickData
     * @private
     */
    function __tick(tickData) {
      var targetTime = new Date().getTime() + Static.TimePerTick;
      board.tick(tickCount, targetTime, tickData);
      tickCount++;
    }

    // Return "class"
    return Simulation;
  });