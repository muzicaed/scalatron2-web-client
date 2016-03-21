/**
 * Creates a board using the initial tick data.
 */
define([],

  function () {

    // Object
    var BoardCreator = {};

    /**
     * Create the board data.
     * @param tickData
     * @return
     */
    BoardCreator.create = function (tickData) {
      var boardData = {
        width: tickData.size.x,
        height: tickData.size.y,
        grid: []
      }

      return boardData;
    };

    // Return "class"
    return BoardCreator;
  });