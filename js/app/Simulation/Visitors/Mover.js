/**
 * Visitor object.
 * Moves simulation objects on the board.
 */
define([],

    function () {

        // Object
        var Mover = {};

        /**
         * Set up move instruction for 3d objects.
         * @param simObj - simulation object to be moved
         * @param newPos - Position - 2d grid postion
         * @param timePerTick - Time for this tick in ms.
         * @param board - Board, the current board.
         */
        Mover.apply = function(simObj, newPos, timePerTick, board) {
            //simObj.place();
            var newTargetPos = board.tilePosToWorldPos(newPos);
            simObj.moveForce.x = __calculateForce(simObj.targetPosition.x, newTargetPos.x, timePerTick);
            simObj.moveForce.y = __calculateForce(simObj.targetPosition.y, newTargetPos.y, timePerTick);
            simObj.targetPosition = newTargetPos;
        };

        /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Calculate simulation move force for 3d world.
         * @param current
         * @param next
         * @param timePerTick
         * @returns {number}
         * @private
         */
        function __calculateForce(current, next, timePerTick) {
            var diff = next - current;
            return diff / timePerTick;
        }

        // Return object
        return Mover
    });