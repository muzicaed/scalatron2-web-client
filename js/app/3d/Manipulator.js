/**
 * Manages and manipulates objects in the 3d world.
 */
define([
    "lib/three",
    "app/3d/Visitors/MoveVisitor",
    "app/3d/Behaviours/SpinBehaviour"
  ],

  function (THREE, MoveVisitor, SpinBehaviour) {

    var simulationObjects = {};

    // Object
    var Manipulator = {};

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
          MoveVisitor.apply(obj, timeFraction);
          SpinBehaviour.apply(obj);
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