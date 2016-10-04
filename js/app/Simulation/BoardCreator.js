var Range = require("app/Common/Range");

/**
 * Creates a board using the initial tick data.
 */

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
    walls: []
  };

  for (var i = 0, len = tickData.bots.length; i < len; i++) {
    var entity = tickData.bots[i];
    if (entity.t == "W") {
      boardData.walls.push(entity);
    }
  }

  return boardData;
};

// Export Object
module.exports = BoardCreator;