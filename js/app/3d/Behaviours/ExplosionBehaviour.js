var State = require("app/3d/Nodes/State");

/**
 * Behaviour for explosion.
 */

// Object
var ExplosionBehaviour = {};

/**
 * Create explosion behaviour
 * @param obj - Simulation object
 * @param tickCount - Current tick count
 * @param timeFraction - Time fraction of current tick (in ms)
 * TODO: More functions
 */
ExplosionBehaviour.apply = function (obj, tickCount, timeFraction) {
  if (obj.state == State.EXPLODING) {
    var frame = tickCount - obj.birthTick;
    obj.node.rotation.z += (Math.random() * (0.022) + 0.015);
    switch (frame) {
      case 0:
        obj.node.scale.x = Math.max(timeFraction, 0.01);
        obj.node.scale.y = Math.max(timeFraction, 0.01);
        break;
      case 2:
        obj.node.scale.x = 1;
        obj.node.scale.y = 1;
        break;
      case 7:
        var scale = 1 - timeFraction;
        obj.node.scale.x = Math.max(scale, 0.01);
        obj.node.scale.y = Math.max(scale, 0.01);
        break;
      case 8:
        obj.node.scale.x = 0.0001;
        obj.node.scale.y = 0.0001;
        break;
    }

    if (frame > 8) {
      obj.state = State.REMOVE;
    }
  }
};

// Export Object
module.exports = ExplosionBehaviour;