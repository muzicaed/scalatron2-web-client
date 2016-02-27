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
        timeFraction += 0.001;
        if(timeFraction > 0.95) {
          obj.node.children[0].material.transparent = false;
          obj.node.children[0].material.opacity = 1.0;
          obj.node.scale.x = 1.0;
          obj.node.scale.y = 1.0;
          obj.node.scale.z = 1.0;
          return;
        }
        obj.node.children[0].material.transparent = true;
        obj.node.children[0].material.opacity = timeFraction;
        obj.node.scale.x = timeFraction;
        obj.node.scale.y = timeFraction;
        obj.node.scale.z = timeFraction;
      }
    };

    // Return Object
    return SpawnedBehaviour;
  }
);