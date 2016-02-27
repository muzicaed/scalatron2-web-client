/**
 * Visitor object.
 * Moves 3d objects in world.
 */
define([
        "lib/three"
    ],

    function (THREE) {

        // Object
        var MoveVisitor = {};

        /**
         * Set up move instruction for 3d objects.
         * @param simObj - simulation object to be moved
         * @param startTime - Start time for current tick (in ms).
         * @param targetTime - Target end time for current tick completion (in ms).
         */
        MoveVisitor.apply = function (simObj, startTime, targetTime) {
            simObj.node.position.x = __calculateVelocity(
                simObj.move.originPosition.x, simObj.move.targetPosition.x, startTime, targetTime);
            simObj.node.position.y = __calculateVelocity(
                simObj.move.originPosition.y, simObj.move.targetPosition.y, startTime, targetTime);
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


            // *---------------*
            // 5      7        10
            // Len:  5
            // Pass: 7 - 5 = 2
        }

        // Return object
        return MoveVisitor;
    });