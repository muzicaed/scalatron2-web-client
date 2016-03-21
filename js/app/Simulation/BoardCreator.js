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
      };

      for (var x = 0; x < boardData.width; x++) {
        for (var y = 0; y < boardData.height; y++) {
          var tile = __getTileForPos(x, y, tickData);
          boardData.grid.push(tile);
        }
      }

      return boardData;
    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Checks if tile is wall or floor
     * TODO: Not very optimized... Like not at all...
     * @param x
     * @param y
     * @param tickData
     * @private
     * @returns Number - 0 = floor, 1 = wall
     */
    function __getTileForPos(x, y, tickData) {
      for (var i = 0, len = tickData.bots.length; i < len; i++) {
        var entity = tickData.bots[i];
        if (entity.t == "W") {
          if (entity.x == x && entity.y == y) {
            return 1;
          }
        }
      }
      return 0;
    }

    // Return "class"
    return BoardCreator;
  });