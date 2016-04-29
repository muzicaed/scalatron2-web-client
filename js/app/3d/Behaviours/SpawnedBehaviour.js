/**
 * Behaviour for 3d object when spawned.
 */
define([
    "lib/three",
    "app/3d/Nodes/State"
  ],

  function (THREE, State) {

    // Object
    var SpawnedBehaviour = {};

    /**
     * Create spawned behaviour
     * @param obj - MasterBotNode
     * @param timeFraction - Time fraction of current tick (in ms)
     */
    SpawnedBehaviour.apply = function (obj, timeFraction) {
      if (obj !== undefined && obj.state == State.SPAWNED) {
        obj.node.scale.x = Math.max(timeFraction, 0.01);
        obj.node.scale.y = Math.max(timeFraction, 0.01);

      } else {
        obj.node.scale.x = 1.0;
        obj.node.scale.y = 1.0;
        obj.node.scale.z = 1.0;
      }
    };

    // Return Object
    return SpawnedBehaviour;
  }
);