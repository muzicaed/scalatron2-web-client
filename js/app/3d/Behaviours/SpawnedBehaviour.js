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
     * Create move behaviour
     * @param obj - MasterBotNode
     * @param timeFraction - Time fraction of current tick (in ms)
     */
    SpawnedBehaviour.apply = function (obj, timeFraction) {
      if (obj !== undefined && obj.state == State.SPAWNED) {
        log("SPAW");
        timeFraction += 0.001;
        if(timeFraction > 0.95) {
          obj.node.scale.x = 1.0;
          obj.node.scale.y = 1.0;
          obj.node.scale.z = 1.0;
          return;
        }
        obj.node.scale.x = timeFraction + 0.01;
        obj.node.scale.y = timeFraction + 0.01;
        obj.node.scale.z = timeFraction + 0.01;
      }
    };

    // Return Object
    return SpawnedBehaviour;
  }
);