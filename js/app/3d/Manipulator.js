/**
 * Manages and manipulates objects in the 3d world.
 */
define([
    "lib/three",
    "app/3d/Visitors/MoveVisitor"
  ],

  function (THREE, MoveVisitor) {

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
      for (var index in simulationObjects) {
        var obj = simulationObjects[index];
        MoveVisitor.apply(obj, Manipulator.tickStartTime, Manipulator.nextTargetTime);
      }
    }

    /**
     * Adds a 3d object
     * @param obj
     */
    Manipulator.add = function (obj) {
      simulationObjects[obj.id] = obj;
    };

    // Return object
    return Manipulator;
  });