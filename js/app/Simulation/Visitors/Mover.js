/**
 * Visitor object.
 * Moves simulation objects on the board.
 */
define([
        "app/Common/Static"
    ],

    function (Static) {

        // Object
        var Mover = {};

        /**
         * Set up move instruction for 3d objects.
         * @param simObj - simulation object to be moved
         * @param newPos - Position - 2d grid postion
         * @param timePerTick - Time for this tick in ms.
         * @param board - Board, the current board.
         */
        Mover.apply = function (simObj, newPos, timePerTick, board) {
            simObj.place();
            var newTarget = board.tilePosToWorldPos(newPos);
            simObj.movable.velocity.x = __calculateVelocity(simObj.movable.targetPosition.x, newTarget.x, timePerTick);
            simObj.movable.velocity.y = __calculateVelocity(simObj.movable.targetPosition.y, newTarget.y, timePerTick);
            simObj.movable.setTargetPosition(newTarget);
        };

        /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Calculate simulation velocity (per frame draw) for 3d object.
         * @param current
         * @param next
         * @param timePerTick
         * @returns {number}
         * @private
         */
        function __calculateVelocity(current, next, timePerTick) {
            var distance = next - current;
            return distance / ((timePerTick / 1000) * Static.fps);
        }

        // Return object
        return Mover;
    });