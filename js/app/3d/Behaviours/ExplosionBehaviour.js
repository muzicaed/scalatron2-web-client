/**
 * Behaviour for explosion.
 */
define([
    "app/3d/Nodes/MiniBotNode",
    "app/3d/Nodes/ExplosionNode",
    "app/3d/Nodes/State"
  ],

  function (MiniBotNode, ExplosionNode, State) {

    // Object
    var ExplosionBehaviour = {};

    /**
     * Create explosion behaviour
     * @param obj - Simulation object
     * @param tickCount - Current tick count
     * @param timeFraction - Time fraction of current tick (in ms)
     */
    ExplosionBehaviour.apply = function (obj, tickCount, timeFraction) {
      if (obj !== undefined && obj instanceof MiniBotNode) {
        if (tickCount > obj.explodedTick) {
          obj.state = State.REMOVE;
          return;
        }
        __handleMiniBotExplosion(obj, timeFraction);
      } else if (obj !== undefined && obj instanceof ExplosionNode) {
        __handleExplosion(obj, tickCount, timeFraction);
      }
    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create mini bot node
     * @param obj - Simulation object
     * @param timeFraction - Time fraction of current tick (in ms)
     * @private
     */
    function __handleMiniBotExplosion(obj, timeFraction) {
      var scale = 1 - timeFraction + 0.01;
      obj.node.scale.x = scale;
      obj.node.scale.y = scale;
      obj.node.scale.z = scale;
    }

    /**
     * Create explosion node
     * @param obj - Simulation object
     * @param tickCount - Current tick count
     * @param timeFraction - Time fraction of current tick (in ms)
     * @private
     */
    function __handleExplosion(obj, tickCount, timeFraction) {
      var frame = tickCount - obj.birthTick;
      switch (frame) {
        case 0:
          obj.node.scale.x = timeFraction + 0.01;
          obj.node.scale.y = timeFraction + 0.01;
          obj.node.material.opacity = timeFraction - 0.5;
          break;
        case 1:
          obj.node.scale.x = 1;
          obj.node.scale.y = 1;
          break;
        case 3:
          var scale = 1 - timeFraction + 0.01;
          obj.node.scale.x = scale;
          obj.node.scale.y = scale;
          obj.node.material.opacity = scale - 0.5;
          break;
        case 5:
          obj.state = State.REMOVE;
          break;
      }
    }

    // Return Object
    return ExplosionBehaviour;
  }
);