/**
 * Behaviour for beast
 */
define([
    "app/3d/Nodes/BeastNode"
  ],

  function (BeastNode) {

    // Object
    var BeastBehaviour = {};

    /**
     * Create move behaviour
     * @param obj - Simulation object
     * @param tickCount - Current tick count
     * @param timeFraction - Time fraction of current tick (in ms)
     */
    BeastBehaviour.apply = function (obj, tickCount, timeFraction) {
      if (obj !== undefined && obj instanceof BeastNode) {
        timeFraction = obj.calcTimeFraction(tickCount, timeFraction);
        obj.node.rotation.z += 0.025;
        if(timeFraction < 0.5) {
          var scale = 1 - timeFraction;
          obj.node.scale.x = scale;
          obj.node.scale.y = scale;
        } else {
          obj.node.scale.x = timeFraction;
          obj.node.scale.y = timeFraction;
        }
      }
    };

    // Return Object
    return BeastBehaviour;
  }
);