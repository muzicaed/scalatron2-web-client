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
        if(timeFraction < 0.5) {
          var scale = 1 - (timeFraction / 2);
          obj.node.position.z = obj.move.originPosition.z + scale * 5;
          obj.node.scale.x = scale;
          obj.node.scale.y = scale;
        } else {
          obj.node.scale.x = 0.5 + (timeFraction / 2);
          obj.node.scale.y = 0.5 + (timeFraction / 2)
        }

      }
    };

    // Return Object
    return SpawningBehaviour;
  }
);