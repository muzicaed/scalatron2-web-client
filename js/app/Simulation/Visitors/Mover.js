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
            var newTargetPos = board.tilePosToWorldPos(newPos);
            simObj.velocity.x = __calculateVelocity(simObj.targetPosition.x, newTargetPos.x, timePerTick);
            simObj.velocity.y = __calculateVelocity(simObj.targetPosition.y, newTargetPos.y, timePerTick);
            simObj.targetPosition = newTargetPos;
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
        return Mover
    });