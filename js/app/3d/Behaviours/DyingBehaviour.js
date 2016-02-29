/**
 * Behaviour for 3d object when dying.
 */
define([
    "lib/three",
    "app/3d/Nodes/State"
  ],

  function (THREE, State) {

    // Object
    var DyingBehaviour = {};

    /**
     * Create move behaviour
     * @param obj - MasterBotNode
     * @param tickCount - Current tick count*
     * @param timeFraction - Time fraction of current tick (in ms)
     */
    DyingBehaviour.apply = function (obj, tickCount, timeFraction) {
      if (obj !== undefined && obj.state == State.DYING) {
        if (obj.deathOccuredTick === undefined) {
          obj.deathOccuredTick = tickCount;
        }

        if (tickCount > obj.deathOccuredTick) {
          obj.state = State.REMOVE;
          return;
        }

        var scale = 1 - (timeFraction * 1.7);
        obj.node.scale.x = Math.max(scale, 0.01);
        obj.node.scale.y = Math.max(scale, 0.01);
        obj.node.scale.z = Math.max(scale, 0.01);
      }
    };

    // Return Object
    return DyingBehaviour;
  }
);