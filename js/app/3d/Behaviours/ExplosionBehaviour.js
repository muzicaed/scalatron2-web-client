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
      var frame = tickCount - obj.birthTick;
      obj.node.rotation.z += (Math.random() * (0.042) + 0.010);
      switch (frame) {
        case 0:
          obj.node.scale.x = Math.max(timeFraction, 0.01);
          obj.node.scale.y = Math.max(timeFraction, 0.01);
          obj.node.material.opacity = timeFraction - 0.5;
          break;
        case 1:
          obj.node.scale.x = 1;
          obj.node.scale.y = 1;
          break;
        case 3:
          var scale = 1 - timeFraction;
          obj.node.scale.x = Math.max(scale, 0.01);
          obj.node.scale.y = Math.max(scale, 0.01);
          obj.node.material.opacity = scale - 0.5;
          break;
        case 5:
          obj.state = State.REMOVE;
          break;
      }
    };

    // Return Object
    return ExplosionBehaviour;
  }
);