var BeastNode = require("app/3d/Nodes/BeastNode");
var State = require("app/3d/Nodes/State");

/**
 * Behaviour for beast
 */

// Object
var BeastBehaviour = {};

/**
 * Create move behaviour
 * @param obj - Simulation object
 * @param tickCount - Current tick count
 * @param timeFraction - Time fraction of current tick (in ms)
 */
BeastBehaviour.apply = function (obj, tickCount, timeFraction) {
  if (obj !== undefined && obj instanceof BeastNode && obj.state != State.DYING) {
    timeFraction = obj.move.calcTimeFraction(tickCount, timeFraction);
    obj.node.rotation.z -= (Math.random() * (0.019) + 0.015);
    if (timeFraction < 0.5) {
      __scaleDown(obj, timeFraction);
    } else {
      __scaleUp(obj, timeFraction);
    }
  }
};

/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Scale down animation
 * @param obj - MasterBotNode
 * @param timeFraction - Time fraction of current tick (in ms)
 * @private
 */
function __scaleDown(obj, timeFraction) {
  var scale = 1 - timeFraction;
  obj.node.scale.x = Math.max(0.75, scale);
  obj.node.scale.y = Math.max(0.75, scale);
}

/**
 * Scale up animation
 * @param obj
 * @param timeFraction
 * @private
 */
function __scaleUp(obj, timeFraction) {
  obj.node.scale.x = Math.min(1.0, timeFraction + 0.25);
  obj.node.scale.y = Math.min(1.0, timeFraction + 0.25);
}

// Export Object
module.exports = BeastBehaviour;