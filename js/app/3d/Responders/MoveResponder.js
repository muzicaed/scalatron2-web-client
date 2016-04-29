/**
 * Responder for movable 3d objects.
 * Reacts to the Mover visitor.
 * Should always be stored in a property named "move"
 * on target object.
 */
define([
    "lib/three",
    "app/3d/PositionConverter"
  ],

  function (THREE, PositionConverter) {

    /**
     * Create move behaviour
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @constructor
     */
    function MoveResponder(initialPos) {
      this.stepCount = -1;
      this.stepOffset = 1;
      this.gridPos = initialPos;
      this.originPosition = PositionConverter.convert(initialPos);
      this.targetPosition = PositionConverter.convert(initialPos);
    }

    /**
     * Sets a new target (using 2d grid position)
     * @param target - THREE.Vector2
     */
    MoveResponder.prototype.setTargetPosition = function (target) {
      this.stepCount++;
      if ((this.stepCount % this.stepOffset) == 0) {
        this.gridPos = target;
        this.originPosition = this.targetPosition;
        this.targetPosition = PositionConverter.convert(target);
      }
    };

    /**
     * Instantly move the node to origin position.
     * @param node - 3d object
     */
    MoveResponder.prototype.placeOrigin = function (node) {
      node.position.x = this.originPosition.x;
      node.position.y = this.originPosition.y;
    };

    /**
     * Calculate this move objects
     * Some objects move offset from global tick count.
     * @param tickCount - Current tick count
     * @param timeFraction - Time fraction of current tick (in ms)
     * @returns {number}
     */
    MoveResponder.prototype.calcTimeFraction = function (tickCount, timeFraction) {
      var mod = (this.stepCount % this.stepOffset) / this.stepOffset;
      return (timeFraction / this.stepOffset) + mod;
    };

    // Return "class"
    return MoveResponder;
  }
);