/**
 * Visitor object.
 * Moves simulation objects on the board.
 */
define([],

    function () {

        // Object
        var Mover = {};

        /**
         *
         * @param simObj - simulation object to be moved
         * @param newPos - Position - 2d grid postion
         * @param board - Board, the current simulation.
         */
        Mover.apply = function(simObj, newPos, board) {
            simObj.targetPosition = board.tilePosToWorldPos(newPos);
            simObj.place();
        };

        // Return object
        return Mover
    });