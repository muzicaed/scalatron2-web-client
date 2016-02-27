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
     * @param timeFraction - Time fraction of current tick (in ms)
     */
    MoveVisitor.apply = function (simObj, timeFraction) {
      if (simObj.move !== undefined && simObj.state == State.MOVING) {
        simObj.node.position.x = __calculateVelocity(
          simObj.move.originPosition.x, simObj.move.targetPosition.x, timeFraction);
        simObj.node.position.y = __calculateVelocity(
          simObj.move.originPosition.y, simObj.move.targetPosition.y, timeFraction);
      }
    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Calculate simulation velocity (per frame draw) for 3d object.
     * @param origin - Number
     * @param destination - Number
     * @param timeFraction - Time fraction of current tick (in ms)
     * @returns {number}
     * @private
     */
    function __calculateVelocity(origin, destination, timeFraction) {
      var distance = destination - origin;
      return origin + (distance * timeFraction);
    }

    // Return object
    return MoveVisitor;
  });