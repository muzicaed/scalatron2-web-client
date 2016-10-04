var MiniBotNode = require("app/3d/Nodes/MiniBotNode");

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
  if (obj !== undefined && obj instanceof MiniBotNode) {
    obj.node.rotation.x += (Math.random() * (0.12) + 0.010);
    obj.node.rotation.z += (Math.random() * (0.012) + 0.010);
  }
};

// Export Object
module.exports = SpinBehaviour;