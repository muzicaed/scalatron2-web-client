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
     * @param timeFraction - Time fraction of current tick (in ms)
     */
    SpawningBehaviour.apply = function (obj, timeFraction) {
      if (obj !== undefined && obj instanceof MasterBotNode && obj.state == State.SPAWNING) {
        if (timeFraction < 0.35) {
          var scale = 1 - (timeFraction / 4) + 0.01;
          obj.node.scale.x = scale;
          obj.node.scale.y = scale;
        } else if (timeFraction < 0.5) {
          obj.node.scale.x = (timeFraction * 2) + 0.25;
          obj.node.scale.y = (timeFraction * 2) + 0.25;
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