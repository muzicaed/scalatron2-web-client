/**
 * Behaviour for constantly spinning 3d objects.
 */
define([
    "app/3d/Nodes/MiniBotNode"
  ],

  function (MiniBotNode) {

    // Object
    var SpinBehaviour = {};

    /**
     * Create move behaviour
     * @param obj - Simulation object
     */
    SpinBehaviour.apply = function (obj) {
      if (obj !== undefined && obj instanceof MiniBotNode) {
        obj.node.rotation.x += 0.1;
        obj.node.rotation.y -= 0.1;
      }
    };

    // Return Object
    return SpinBehaviour;
  }
);