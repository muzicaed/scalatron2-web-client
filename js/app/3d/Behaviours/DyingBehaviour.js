var State = require("app/3d/Nodes/State");
var Static = require("app/Common/Static");

/**
 * Behaviour for 3d object when dying.
 */

// Object
var DyingBehaviour = {};

/**
 * Create move behaviour
 * @param obj - MasterBotNode
 * @param tickCount - Current tick count
 * @param timeFraction - Time fraction of current tick (in ms)
 */
DyingBehaviour.apply = function (obj, tickCount, timeFraction) {
  if (obj !== undefined && obj.state == State.DYING) {
    __handleDeathOccured(obj, tickCount);
    if (tickCount > obj.deathOccuredTick) {
      obj.state = State.REMOVE;
      return;
    } else if (Static.TimePerTick < 30) {
      obj.state = State.REMOVE;
      return;
    }
    __performAnimation(obj, timeFraction);
  }
};

/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * Set when death occured.
 * Used to calculate when the object should be removed,
 * ie when die animation is completed.
 * @param obj - MasterBotNode
 * @param tickCount - Current tick count
 * @private
 */
function __handleDeathOccured(obj, tickCount) {
  if (obj.deathOccuredTick === undefined) {
    obj.deathOccuredTick = tickCount;
  }
}

/**
 * Perform die animation.
 * @param obj - MasterBotNode
 * @param timeFraction - Time fraction of current tick (in ms)
 * @private
 */
function __performAnimation(obj, timeFraction) {
  var scale = 1 - (timeFraction * 0.5);
  obj.node.scale.x = Math.max(scale, 0.01);
  obj.node.scale.y = Math.max(scale, 0.01);
  obj.node.scale.z = Math.max(scale * 2, 0.01);
}

// Export Object
module.exports = DyingBehaviour;