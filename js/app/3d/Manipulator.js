/**
 * Manages and manipulates objects in the 3d world.
 */
define([
    "lib/three",
    "app/3d/Visitors/MoveVisitor",
    "app/3d/Behaviours/SpinBehaviour",
    "app/3d/Behaviours/SpawningBehaviour",
    "app/3d/Behaviours/SpawnedBehaviour",
    "app/3d/Behaviours/BeastBehaviour",
    "app/3d/Behaviours/ExplosionBehaviour",
    "app/3d/Nodes/ExplosionNode",
    "app/3d/Nodes/State"
  ],

  function (THREE, MoveVisitor, SpinBehaviour, SpawningBehaviour, SpawnedBehaviour,
            BeastBehaviour, ExplosionBehaviour, ExplosionNode, State) {

    var simulationObjects = {};

    // Object
    var Manipulator = {};

    /**
     * The Scene
     */
    Manipulator.scene = null;

    /**
     * Current tick number
     */
    Manipulator.frameCount = 0;

    /**
     * Current tick number
     */
    Manipulator.tickCount = 0;

    /**
     * Tick started (in ms.)
     */
    Manipulator.tickStartTime = 0;

    /**
     * Target time for next tick completion (in ms).
     */
    Manipulator.nextTickTargetTime = 0;

    /**
     * Manipulates all objects for each frame draw.
     * Call this on every frame request.
     */
    Manipulator.updateFrame = function () {
      Manipulator.frameCount++;
      //if (Manipulator.frameCount % 2 == 0) {
      __cleanSimulationObjects();
      var timeFraction = __calculateTimeFraction();
      for (var index in simulationObjects) {
        if (simulationObjects.hasOwnProperty(index)) {
          var obj = simulationObjects[index];
          MoveVisitor.apply(obj, Manipulator.tickCount, timeFraction);
          SpinBehaviour.apply(obj);
          SpawningBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
          SpawnedBehaviour.apply(obj, timeFraction);
          BeastBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
          __handleExplosion(obj, timeFraction);
        }
      }
      //}
    };

    /**
     * Adds a 3d object
     * @param obj
     */
    Manipulator.add = function (obj) {
      simulationObjects[obj.id] = obj;
    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Calculate time fraction of frame.
     * @param obj - Simulation object
     * @param timeFraction - Time fraction of current tick (in ms)
     * @private
     */
    function __handleExplosion(obj, timeFraction) {
      if (obj.state == State.EXPLODE) {
        var explosion = new ExplosionNode("EXP-" + obj.id, obj.move.gridPos, 3, Manipulator.tickCount);
        Manipulator.scene.add(explosion.node);
        simulationObjects[explosion.id] = explosion;
        obj.explodedTick = Manipulator.tickCount;
        obj.state = State.EXPLODING;
      } else if (obj.state == State.EXPLODING) {
        ExplosionBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
      }
    }

    /**
     * Calculate time fraction of frame.
     * @returns Number
     * @private
     */
    function __calculateTimeFraction() {
      var now = new Date().getTime();
      var tickLength = (Manipulator.nextTickTargetTime - Manipulator.tickStartTime);
      return (now - Manipulator.tickStartTime) / tickLength;
    }

    /**
     * Removes simulation objects that are not part
     * of simulation any more.
     * @private
     */
    function __cleanSimulationObjects() {
      for (var index in simulationObjects) {
        if (simulationObjects.hasOwnProperty(index)) {
          var obj = simulationObjects[index];
          if (obj.state == State.REMOVE) {
            Manipulator.scene.remove(obj.node);
            delete simulationObjects[index];
          }
        }
      }
    }

    // Return object
    return Manipulator;
  }
)
;