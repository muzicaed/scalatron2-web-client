var THREE = require("lib/three");
var PositionConverter = require("app/3d/PositionConverter");
var Manipulator = require("app/3d/Manipulator");
var Instructor = require("app/Simulation/Instructor");
var World = require("app/3d/World");
var MeshFactory = require("app/3d/Resources/MeshFactory");

/**
 * Board is a 2d representation the Scalatron board.
 */

var world = new World();
var boardData = null;
var node = new THREE.Object3D();

/**
 *  Create the 3d board
 * @constructor
 */
function Board() {
}

/**
 * Init the board
 * @param board - Object containing board/tile data.
 */
Board.prototype.init = function (board) {
  boardData = board;
  PositionConverter.init(boardData.height);
  node = MeshFactory.createBoard(boardData);
  world.init(boardData);
  world.addStatic(node);
};

/**
 * Starts the simulation.
 */
Board.prototype.runSimulation = function () {
  world.render();
};

/**
 * Handle a Scalatron server tick.
 * @param tickCount
 * @param targetTime - Target time for tick completion (in ms).
 * @param tickData
 */
Board.prototype.tick = function (tickCount, targetTime, tickData) {
  Manipulator.tickCount = tickCount;
  Manipulator.tickStartTime = new Date().getTime();
  Manipulator.nextTickTargetTime = targetTime;
  Instructor.handleTick(tickData);
};


// Export "class"
module.exports = Board;