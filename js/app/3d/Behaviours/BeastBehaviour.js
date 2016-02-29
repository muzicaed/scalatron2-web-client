/**
 * Behaviour for beast
 */
define([
    "app/3d/Nodes/BeastNode",
    "app/3d/Nodes/State"
  ],

  function (BeastNode, State) {

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
        timeFraction = obj.calcTimeFraction(tickCount, timeFraction);
        obj.node.rotation.z -= (Math.random() * (0.019) + 0.015);
        if(timeFraction < 0.5) {
          var scale = 1 - timeFraction;
          obj.node.scale.x = Math.max(0.75, scale);
          obj.node.scale.y = Math.max(0.75, scale);
        } else {
          obj.node.scale.x = Math.min(1.0, timeFraction + 0.25);
          obj.node.scale.y = Math.min(1.0, timeFraction + 0.25);
        }
      }
    };

    // Return Object
    return BeastBehaviour;
  }
);