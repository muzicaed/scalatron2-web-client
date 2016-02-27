/**
 * Converts 2d grid position to 3d world vector.
 */
define([
    "lib/three",
    "app/Common/Static"
  ],

  function (THREE, Static) {

    var boardHeight = 0;

    // Object
    var PositionConverter = {};

    /**
     * Init, should run after board setup.
     * @param height - board height
     */
    PositionConverter.init = function (height) {
      boardHeight = height;
    };

    /**
     * Coverts tile 2d position to world 3d position.
     * @param pos - THREE.Vector2, tile position on board
     * @returns THREE.Vector3 - Position in 3d space
     */
    PositionConverter.convert = function (pos) {
      return new THREE.Vector3(
        (pos.x * Static.TileSize),
        (-(pos.y * Static.TileSize)) + (boardHeight * Static.TileSize),
        0
      );
    };

    // Return object
    return PositionConverter;
  });