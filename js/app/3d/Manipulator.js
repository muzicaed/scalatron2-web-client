var THREE = require("lib/three");
var MoveBehaviour = require("app/3d/Behaviours/MoveBehaviour");
var SpinBehaviour = require("app/3d/Behaviours/SpinBehaviour");
var SpawningBehaviour = require("app/3d/Behaviours/SpawningBehaviour");
var SpawnedBehaviour = require("app/3d/Behaviours/SpawnedBehaviour");
var BeastBehaviour = require("app/3d/Behaviours/BeastBehaviour");
var ExplosionBehaviour = require("app/3d/Behaviours/ExplosionBehaviour");
var DyingBehaviour = require("app/3d/Behaviours/DyingBehaviour");
var ExplosionNode = require("app/3d/Nodes/ExplosionNode");
var FlowerNode = require("app/3d/Nodes/FlowerNode");
var MiniBotNode = require("app/3d/Nodes/MiniBotNode");
var MasterBotNode = require("app/3d/Nodes/MasterBotNode");
var State = require("app/3d/Nodes/State");

/**
 * Manages and manipulates objects in the 3d world.
 */

var simulationObjects = {};

// Object
var Manipulator = {};

/**
 * Is last frame done?
 */
Manipulator.isLastDone = true;

/**
 * The World
 */
Manipulator.world = null;

/**
 * The Camera
 */
Manipulator.camera = null;

/**
 * Current tick number
 */
Manipulator.frameCount = 0;

/**
 * Current tick number
 */
Manipulator.tickCount = 0;

/**
 * Tick started (in ms.)
 */
Manipulator.tickStartTime = 0;

/**
 * Target time for next tick completion (in ms).
 */
Manipulator.nextTickTargetTime = 0;

/**
 * Array of players master bots.
 */
Manipulator.players = [];

/**
 * Array of players master bots.
 */
Manipulator.cameraFollow = -1;
Manipulator.raceCam = false;
Manipulator.raceCamCount = 0;

/**
 * Manipulates all objects for each frame draw.
 * Call this on every frame request.
 * TODO: Refactoring, smaller method.
 */
Manipulator.updateFrame = function () {
  Manipulator.isLastDone = false;
  Manipulator.frameCount++;
  var timeFraction = __calculateTimeFraction();
  for (var index in simulationObjects) {
    if (simulationObjects.hasOwnProperty(index)) {
      var obj = simulationObjects[index];
      MoveBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
      SpinBehaviour.apply(obj, timeFraction);
      SpawningBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
      SpawnedBehaviour.apply(obj, timeFraction);
      BeastBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
      DyingBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
      ExplosionBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
    }
  }
  __moveCamera();
  __cleanSimulationObjects();
  Manipulator.isLastDone = true;
};

/**
 * Adds a 3d object
 * @param obj
 */
Manipulator.add = function (obj) {
  simulationObjects[obj.id] = obj;
  Manipulator.world.scene.add(obj.node);
  if(obj.constructor === MasterBotNode) {
    Manipulator.players.push(obj);
  }
};

/**
 * Retrieves a 3d object
 * @param id
 * @returns Objects - if found, else null
 */
Manipulator.retrieve = function (id) {
  return simulationObjects[id];
};

/**
 * Clears unused objects.
 * @param ids - ids (index) for object
 */
Manipulator.clearUnused = function (ids) {
  for (var index in simulationObjects) {
    if (simulationObjects.hasOwnProperty(index)) {
      if (ids[index] === undefined) {
        if (simulationObjects[index].constructor === FlowerNode) {
          simulationObjects[index].state = State.DYING;
        } else if (simulationObjects[index].constructor === MiniBotNode) {
          simulationObjects[index].state = State.DYING;
        } else if (simulationObjects[index].constructor !== ExplosionNode) {
          simulationObjects[index].state = State.REMOVE;
        }
      }
    }
  }
};

/**
 * Cycle player camera follow
 */
Manipulator.cyclePlayerCamera = function () {
  Manipulator.cameraFollow = (Manipulator.cameraFollow >= Manipulator.players.length - 1) ? -1 : Manipulator.cameraFollow + 1;
};

/**
 * Toggle race cam
 */
Manipulator.toggleRaceCam = function () {
  Manipulator.raceCam = !Manipulator.raceCam;
};

/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Calculate time fraction of frame.
 * @returns Number
 * @private
 */
function __calculateTimeFraction() {
  var now = new Date().getTime();
  var tickLength = (Manipulator.nextTickTargetTime - Manipulator.tickStartTime);
  return (now - Manipulator.tickStartTime) / tickLength;
}

/**
 * Removes simulation objects that are not part
 * of simulation any more.
 * @private
 */
function __cleanSimulationObjects() {
  for (var index in simulationObjects) {
    if (simulationObjects.hasOwnProperty(index)) {
      var obj = simulationObjects[index];
      if (obj.state == State.REMOVE) {
        Manipulator.world.scene.remove(obj.node);
        delete simulationObjects[index];
      }
    }
  }
}

/**
 * Moves the camera (if player follow)
 * @private
 */
function __moveCamera() {
  if(Manipulator.cameraFollow >= 0) {
    var cam = Manipulator.camera;
    var bot = Manipulator.players[Manipulator.cameraFollow];

    var x = bot.node.position.x;
    var y = bot.node.position.y;

    if(Manipulator.raceCam) {
      Manipulator.raceCamCount++;
      cam.position.z = 60;
      if(Manipulator.raceCamCount > 350) {
        cam.position.set(x, y - 50, 60);
        Manipulator.raceCamCount = 0;
      }
      cam.up = new THREE.Vector3(0,0,1);

    } else {
      cam.position.set(x, y - (y / 20), 300);
    }
    cam.lookAt(new THREE.Vector3(x, y, 0));
  } else {
    Manipulator.world.resetCamera();
  }
}

// Export object
module.exports = Manipulator;