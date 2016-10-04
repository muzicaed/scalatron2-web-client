var THREE = require("lib/three");

/**
 * Bot colors
 */

var botColors = {};
var usedCount = 0;
var colorCount = 7;

// Object
var Colors = {
  count: colorCount,
  col: {
    1: new THREE.Color(0x000000),
    2: new THREE.Color(0xd90d0d),
    3: new THREE.Color(0x29ff03),
    4: new THREE.Color(0x2d03ff),
    5: new THREE.Color(0xec08d9),
    6: new THREE.Color(0x03fbff),
    7: new THREE.Color(0xffffff)
  },
  combinations: __generateColorCombinations()
};

/**
 * Reserve a color for a bot.
 * @param tickData
 */
Colors.reserveColors = function(tickData) {
  for(var i = 0; i < tickData.bots.length; i++) {
    var entity = tickData.bots[i];
    if(entity.t == "M") {
      usedCount++;
      botColors[entity.t + entity.id] = Colors.combinations[usedCount];
    }
  }
};

/**
 * Get color for a id.
 * @param id
 */
Colors.getColor = function(id) {
  return botColors[id];
};


/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Generates color combination matrix.
 * @returns Object - color matrix
 * @private
 */
function __generateColorCombinations() {
  var combinations = {};
  for (var s = 1; s <= colorCount; s++) {
    for (var p = 1; p <= colorCount; p++) {
      combinations[(s + (p * colorCount)) - colorCount] = {pri: p - 1, sec: s - 1}
    }
  }
  return combinations;
}


// Export object
module.exports = Colors;