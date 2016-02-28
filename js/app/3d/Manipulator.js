/**
 * Manages and manipulates objects in the 3d world.
 */
define([
    "lib/three",
    "app/3d/Visitors/MoveVisitor",
    "app/3d/Behaviours/SpinBehaviour",
    "app/3d/Behaviours/SpawningBehaviour",
    "app/3d/Behaviours/SpawnedBehaviour"
  ],

  function (THREE, MoveVisitor, SpinBehaviour, SpawningBehaviour, SpawnedBehaviour) {

    var simulationObjects = {};

    // Object
    var Manipulator = {};

    /**
     * Current tick number
     */
    Manipulator.tickCount = 0

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
      var timeFraction = __calculateTimeFraction();
      for (var index in simulationObjects) {
        if (simulationObjects.hasOwnProperty(index)) {
          var obj = simulationObjects[index];
          MoveVisitor.apply(obj, Manipulator.tickCount, timeFraction);
          SpinBehaviour.apply(obj);
          SpawningBehaviour.apply(obj, timeFraction);
          SpawnedBehaviour.apply(obj, timeFraction);
        }
      }
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
     * @returns Number
     * @private
     */
    function __calculateTimeFraction() {
      var now = new Date().getTime();
      var tickLength = (Manipulator.nextTickTargetTime - Manipulator.tickStartTime);
      return (now - Manipulator.tickStartTime) / tickLength;
    }

    // Return object
    return Manipulator;
  });