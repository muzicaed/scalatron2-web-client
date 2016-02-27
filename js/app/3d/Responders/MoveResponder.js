/**
 * Responder for movable 3d objects.
 * Reacts to the Mover visitor.
 * Should always be stored in a property named "move"
 * on target object.
 */
define([
        "lib/three",
        "app/3d/PositionConverter",
        "app/3d/Visitors/MoveVisitor"
    ],

    function (THREE, PositionConverter) {

        /**
         * Create move behaviour
         * @param initialPos - THREE.Vector2, position on 2d grid
         * @constructor
         */
        function MoveResponder(initialPos) {
            this.originPosition = PositionConverter.convert(initialPos);
            this.targetPosition = PositionConverter.convert(initialPos);
        }

        /**
         * Sets a new target (using 2d grid position)
         * @param target - THREE.Vector2
         */
        MoveResponder.prototype.setTargetPosition = function (target) {
            this.originPosition = this.targetPosition;
            this.targetPosition = PositionConverter.convert(target);
        };

        /**
         * Instantly move the node to origin position.
         * @param node - 3d object
         */
        MoveResponder.prototype.placeOrigin = function(node) {
            node.position.x = this.originPosition.x;
            node.position.y = this.originPosition.y;
            node.position.z = this.originPosition.z;
        };

        // Return "class"
        return MoveResponder;
    }
);