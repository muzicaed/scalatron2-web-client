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
     * TODO: More functions
     */
    ExplosionBehaviour.apply = function (obj, tickCount, timeFraction) {
      if (obj.state == State.EXPLODING) {
        var frame = tickCount - obj.birthTick;

        if (frame > 8) {
          obj.state = State.REMOVE;
        }
      }
    };

    // Return Object
    return ExplosionBehaviour;
  }
);