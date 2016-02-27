/**
 * Visitor object.
 * Moves 3d objects in world.
 */
define(
  [
    "app/3d/Nodes/State"
  ],

  function (State) {

    // Object
    var MoveVisitor = {};

    /**
     * Set up move instruction for 3d objects.
     * @param simObj - simulation object to be moved
     * @param startTime - Start time for current tick (in ms).
     * @param targetTime - Target end time for current tick completion (in ms).
     */
    MoveVisitor.apply = function (simObj, startTime, targetTime) {
      if (simObj.move !== undefined && simObj.state == State.MOVING) {
        simObj.node.position.x = __calculateVelocity(
          simObj.move.originPosition.x, simObj.move.targetPosition.x, startTime, targetTime);
        simObj.node.position.y = __calculateVelocity(
          simObj.move.originPosition.y, simObj.move.targetPosition.y, startTime, targetTime);
      }
    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Calculate simulation velocity (per frame draw) for 3d object.
     * @param origin - Number
     * @param destination - Number
     * @param startTime - Start time for current tick (in ms).
     * @param targetTime - Target end time for current tick completion (in ms).
     * @returns {number}
     * @private
     */
    function __calculateVelocity(origin, destination, startTime, targetTime) {
      var now = new Date().getTime();
      var tickLength = (targetTime - startTime);
      var fraction = (now - startTime) / tickLength;
      var distance = destination - origin;
      return origin + (distance * fraction);
    }

    // Return object
    return MoveVisitor;
  });