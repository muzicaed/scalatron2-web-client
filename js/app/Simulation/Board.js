/**
 * Board is a 2d representation the Scalatron board.
 */
define([
    "lib/three",
    "app/3d/PositionConverter",
    "app/3d/Manipulator",
    "app/3d/World",
    "app/3d/Nodes/State",
    "app/3d/Resources/MeshFactory"
  ],

  function (THREE, PositionConverter, Manipulator, World, State, MeshFactory) {

    var world = new World();
    var boardData = null;
    var node = new THREE.Object3D();

    // TODO: Test code
    var bot1;
    var bot2;

    /**
     *  Create the 3d board
     * @constructor
     */
    function Board() {}

    /**
     * Init the board
     * @param board - Object containing board/tile data.
     */
    Board.prototype.init = function (board) {
      boardData = board;
      PositionConverter.init(boardData.height);
      __generateBoardNode();
      world.init(boardData);
      world.addStatic(node);

      // TODO: Remove test code
      bot1 = world.addMasterBot("1", {x: 11, y: 0}, 5);
      bot2 = world.addMiniBot("2", {x: 13, y: 0}, 13);
      beast1 = world.addGoodBeast("x", {x: 9, y: 0});

      world.addGoodFlower("1", {x: 13, y: 12});
      world.addBadFlower("1", {x: 14, y: 12});


      // TESTING COLORS
      for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 7; y++) {
          var colorId = x + (y * 7) + 1;
          world.addMasterBot("master-" + x + "-" + y, {x: 8 + x, y: y}, colorId);
        }
      }

      for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 7; y++) {
          var colorId = x + (y * 7) + 1;
          world.addMiniBot("mini-" + x + "-" + y, {x: 8 + x, y: 8 + y}, colorId);
        }
      }

    };

    /**
     * Starts the simulation.
     */
    Board.prototype.runSimulation = function () {
      world.render();
    };

    /**
     * Handle a Scalatron server tick.
     * @param tickCount
     * @param targetTime - Target time for tick completion (in ms).
     */
    Board.prototype.tick = function (tickCount, targetTime) {
      __labTick(tickCount);
      Manipulator.tickCount = tickCount;
      Manipulator.tickStartTime = new Date().getTime();
      Manipulator.nextTickTargetTime = targetTime;
    };


    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Generates a 3d board based on boardData.
     * @private
     */
    function __generateBoardNode() {
      __createFloor();
      for (var x = 0, len = boardData.width; x < len; x++) {
        for (var y = boardData.height - 1; y >= 0; y--) {
          var index = x + (y * boardData.height);
          if(boardData.grid[index] == 1) {
            __addTile(__createWall(), new THREE.Vector2(x, y));
          }
        }
      }
    }

    /**
     * Adds a tile to the board node.
     * @param tile - THREE.Mesh
     * @param vec - THREE.Vector2
     * @private
     */
    function __addTile(tile, vec) {
      var vec3d = PositionConverter.convert(vec);
      tile.position.x = vec3d.x;
      tile.position.y = vec3d.y;
      node.add(tile);
    }

    /**
     * Creates a wall cube
     * @returns THREE.Mesh
     * @private
     */
    function __createWall() {
      var wall = MeshFactory.createWallMesh();
      wall.position.z = 0;
      return wall;
    }

    /**
     * Creates a floor tile
     * @returns THREE.Mesh
     * @private
     */
    function __createFloor() {
      var floor = MeshFactory.createFloorMesh(boardData.width, boardData.height);
      floor.position.z = -4;
      node.add(floor);
    }

    // TODO: Test code.
    function __labTick(tickCount) {
      //log("Board tick " + tickCount + " - " + tickCount % 4);

      if (tickCount % 2 == 0) {
        bot1.state = State.MOVING;
        bot1.move.setTargetPosition({x: 11, y: bot1.move.gridPos.y + 1});
      }

      if (tickCount % 4 == 0) {
        beast1.state = State.MOVING;
        beast1.move.setTargetPosition({x: 9, y: beast1.move.gridPos.y + 1});
      }

      bot2.state = State.MOVING;
      bot2.move.setTargetPosition({x: 13, y: bot2.move.gridPos.y + 1});

    }

    // Return "class"
    return Board;
  });