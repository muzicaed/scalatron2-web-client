var THREE = require("lib/three");
var MiniBotNode = require("app/3d/Nodes/MiniBotNode");
var MasterBotNode = require("app/3d/Nodes/MasterBotNode");
var Static = require("app/Common/Static");

/**
 * Behaviour for constantly spinning 3d objects.
 */

// Object
var SpinBehaviour = {};

/**
 * Create move behaviour
 * @param obj - Simulation object
 * @param timeFraction - Time fraction of current tick (in ms)
 */
SpinBehaviour.apply = function (obj, timeFraction) {
  if (obj !== undefined) {
    if (obj instanceof MiniBotNode) {
      obj.node.rotation.x += (Math.random() * (0.12) + 0.01);
      obj.node.rotation.z += (Math.random() * (0.012) + 0.01);
    } else if (obj instanceof MasterBotNode) {
      var speed = (1000 - Static.TimePerTick) * 0.00006; // Make this truly relative!
      var rad = getAngle(obj.move.originPosition, obj.move.targetPosition);
      if (rad != obj.node.rotation.z) {
        console.log(rad);
        if (timeFraction < 0.8) {
          (obj.node.rotation.z > rad) ? obj.node.rotation.z += (timeFraction * 0.05) : obj.node.rotation.z -= (timeFraction * 0.05);
        } else {
          obj.node.rotation.z = rad;
        }
      }
      obj.node.children[1].rotation.y += 0.04;
    }
  }

  function getAngle(originPoint, targetPoint) {
    return Math.atan2(targetPoint.y - originPoint.y, targetPoint.x - originPoint.x);
  }
};


// Export Object
module.exports = SpinBehaviour;