/**
 * Manages and manipulates objects in the 3d world.
 */
define([
    "lib/three",
    "app/3d/Behaviours/MoveBehaviour",
    "app/3d/Behaviours/SpinBehaviour",
    "app/3d/Behaviours/SpawningBehaviour",
    "app/3d/Behaviours/SpawnedBehaviour",
    "app/3d/Behaviours/BeastBehaviour",
    "app/3d/Behaviours/ExplosionBehaviour",
    "app/3d/Behaviours/DyingBehaviour",
    "app/3d/Nodes/ExplosionNode",
    "app/3d/Nodes/FlowerNode",
    "app/3d/Nodes/MiniBotNode",
    "app/3d/Nodes/State",
    "app/Audio"
  ],

  function (THREE, MoveBehaviour, SpinBehaviour, SpawningBehaviour, SpawnedBehaviour, BeastBehaviour,
            ExplosionBehaviour, DyingBehaviour, ExplosionNode, FlowerNode, MiniBotNode, State, Audio) {

    var simulationObjects = {};

    // Object
    var Manipulator = {};

    /**
     * Is last frame done?
     */
    Manipulator.isLastDone = true;

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
     * TODO: Refactoring, smaller method.
     */
    Manipulator.updateFrame = function () {
      Manipulator.isLastDone = false;
      Manipulator.frameCount++;
      __cleanSimulationObjects();
      var timeFraction = __calculateTimeFraction();
      for (var index in simulationObjects) {
        if (simulationObjects.hasOwnProperty(index)) {
          var obj = simulationObjects[index];
          MoveBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
          SpinBehaviour.apply(obj);
          SpawningBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
          SpawnedBehaviour.apply(obj, timeFraction);
          BeastBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
          DyingBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
          ExplosionBehaviour.apply(obj, Manipulator.tickCount, timeFraction);
        }
      }
      Manipulator.isLastDone = true;
    };

    /**
     * Adds a 3d object
     * @param obj
     */
    Manipulator.add = function (obj) {
      simulationObjects[obj.id] = obj;
      Manipulator.scene.add(obj.node);
    };

    /**
     * Retrieves a 3d object
     * @param id
     * @returns Objects - if found, else null
     */
    Manipulator.retrieve = function (id) {
      return simulationObjects[id];
    };

    /**
     * Clears unused objects.
     * @param objs - Objects (Hash)
     */
    Manipulator.clearUnused = function (ids) {
      for (var index in simulationObjects) {
        if (simulationObjects.hasOwnProperty(index)) {
          if (ids[index] === undefined) {
            if (simulationObjects[index].constructor === FlowerNode) {
              simulationObjects[index].state = State.DYING;
            } else if (simulationObjects[index].constructor === MiniBotNode) {
              simulationObjects[index].state = State.DYING;
            } else if (simulationObjects[index].constructor !== ExplosionNode) {
              simulationObjects[index].state = State.REMOVE;
            }
          }
        }
      }
    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

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
);