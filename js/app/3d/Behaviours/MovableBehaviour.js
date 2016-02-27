/**
 * Prototype for movable simulation objects.
 * Reacts with the Mover visitor.
 * Should always be stored in a property named "movable"
 * on target object.
 */
define([
        "lib/three"
    ],

    function (THREE) {

        /**
         * Create movable behaviour
         * @constructor
         */
        function MovableBehaviour() {
            this.originPosition = new THREE.Vector3(0, 0, 0);
            this.targetPosition = new THREE.Vector3(0, 0, 0);
            this.velocity = new THREE.Vector2(0, 0);
        }

        /**
         * Sets a new target.
         * @param newTarget - THREE.Vector3
         */
        MovableBehaviour.prototype.setTargetPosition = function (newTarget) {
            this.originPosition = this.targetPosition;
            this.targetPosition = newTarget;
        };

        // Return "class"
        return MovableBehaviour;
    }
);