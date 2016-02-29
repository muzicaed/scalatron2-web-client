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
        obj.node.rotation.x += (Math.random() * (0.022) + 0.013);
        obj.node.rotation.y -= (Math.random() * (0.010) + 0.015);
      }
    };

    // Return Object
    return SpinBehaviour;
  }
);