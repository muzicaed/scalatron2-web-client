var MiniBotNode = require("app/3d/Nodes/MiniBotNode");
var MasterBotNode = require("app/3d/Nodes/MasterBotNode");

/**
 * Behaviour for constantly spinning 3d objects.
 */

// Object
var SpinBehaviour = {};

/**
 * Create move behaviour
 * @param obj - Simulation object
 */
SpinBehaviour.apply = function (obj) {
  if (obj !== undefined) {
    if (obj instanceof MiniBotNode) {
      obj.node.rotation.x += (Math.random() * (0.12) + 0.010);
      obj.node.rotation.z += (Math.random() * (0.012) + 0.010);
    } else if (obj instanceof MasterBotNode) {
      var speed = 0.06

      if (obj.move.originPosition.x > obj.move.targetPosition.x) {
        obj.node.rotation.z -= speed;
      } else if (obj.move.originPosition.x < obj.move.targetPosition.x) {
        obj.node.rotation.z += speed;
      }

      if (obj.move.originPosition.y > obj.move.targetPosition.y) {
        obj.node.rotation.x += speed;
      } else if (obj.move.originPosition.y < obj.move.targetPosition.y) {
        obj.node.rotation.x -= speed;
      }

    }
  }
};

// Export Object
module.exports = SpinBehaviour;