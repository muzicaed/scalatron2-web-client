/**
 * Behaviour for Master Bot when spawning.
 */
define([
    "lib/three",
    "app/3d/Nodes/MasterBotNode",
    "app/3d/Nodes/State"
  ],

  function (THREE, MasterBotNode, State) {

    // Object
    var SpawningBehaviour = {};

    /**
     * Create move behaviour
     * @param obj - MasterBotNode
     * @param tickCount - Current tick count
     * @param timeFraction - Time fraction of current tick (in ms)
     */
    SpawningBehaviour.apply = function (obj, tickCount, timeFraction) {
      if (obj !== undefined && obj.state == State.SPAWNING) {
        if (obj.calcTimeFraction !== undefined) {
          timeFraction = obj.calcTimeFraction(tickCount, timeFraction);
        }
        if (timeFraction < 0.35) {
          var scale = 1 - (timeFraction / 4);
          obj.node.scale.x = Math.max(scale , 0.1);
          obj.node.scale.y = Math.max(scale , 0.1);
        } else if (timeFraction < 0.5) {
          obj.node.scale.x = Math.max((timeFraction * 2) + 0.25, 0.1);
          obj.node.scale.y = Math.max((timeFraction * 2) + 0.25, 0.1);
        } else if (timeFraction < 0.75) {
          obj.node.scale.x = 1;
          obj.node.scale.y = 1;
        }
      }
    };

    // Return Object
    return SpawningBehaviour;
  }
);