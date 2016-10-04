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
    /*
    switch (frame) {
      case 0:
        obj.node.scale.x = Math.max(timeFraction, 0.005);
        obj.node.scale.y = Math.max(timeFraction, 0.005);
        break;
      case 7:
        obj.node.scale.x = 1;
        obj.node.scale.y = 1;
        break;
      case 16:
        var scale = 1 - timeFraction;
        obj.node.scale.x = Math.max(scale, 0.005);
        obj.node.scale.y = Math.max(scale, 0.005);
        break;
      case 18:
        obj.node.scale.x = 0.0001;
        obj.node.scale.y = 0.0001;
        break;
    }
    */

    obj.node.scale.z = 0.5;
    if (frame <= 3) {
      obj.node.scale.x = (frame / 3) + (timeFraction * 0.2);
      obj.node.scale.y = (frame / 3) + (timeFraction * 0.2);
    } else if (frame >= 18) {
      obj.node.scale.x = 1.0 - (((frame - 15) * 2) * 0.1 + (timeFraction * 0.1));
      obj.node.scale.y = 1.0 - (((frame - 15) * 2) * 0.1 + (timeFraction * 0.1));

    } else {
      obj.node.scale.x = 1;
      obj.node.scale.y = 1;
    }



    if (frame > 20) {
      obj.state = State.REMOVE;
    }
  }
};

// Export Object
module.exports = ExplosionBehaviour;