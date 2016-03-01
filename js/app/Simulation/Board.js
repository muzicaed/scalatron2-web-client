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

    /**
     *  Create the 3d board
     * @constructor
     */
    function Board() {
    }

    /**
     * Init the board
     * @param board - Object containing board/tile data.
     */
    Board.prototype.init = function (board) {
      boardData = board;
      PositionConverter.init(boardData.height);
      node = MeshFactory.createBoard(boardData);
      world.init(boardData);
      world.addStatic(node);

      // TODO: Remove test code
      __createTestObjects();
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


    // TODO: Test code remove
    function __createTestObjects() {
      bot1 = world.addMasterBot("1", {x: 10, y: 3}, 7);
      bot2 = world.addMiniBot("2", {x: 13, y: 0}, 13);
      bot3 = world.addMiniBot("3", {x: 12, y: 0}, 24);
      beast1 = world.addGoodBeast("x", {x: 9, y: 0});

      bot4 = world.addMiniBot("4", {x: 13, y: 8}, 12);

      myFlower = world.addGoodFlower("FLOW-1", {x: 13, y: 10});
      world.addBadFlower("F2", {x: 14, y: 12});


      // TODO: Remove, TESTING COLORS & EVENTS ETC
      /*
       for (var x = 0; x < 7; x++) {
       for (var y = 0; y < 7; y++) {
       var colorId = x + (y * 7) + 1;
       world.addMasterBot("mini-" + x + "-" + y, {x: 1 + x * 2, y: 8 + y * 2}, colorId);
       }
       }
       */
      for (var x = 0; x < 50; x++) {
        for (var y = 0; y < 40; y++) {
          world.addMiniBot("mini2-" + x + "-" + y, {x: 31 + x, y: 0 + y}, Math.floor(Math.random() * 49) + 1);
        }
      }
      /*
       for (var x = 0; x < 7; x++) {
       for (var y = 0; y < 7; y++) {
       world.addMasterBot("mini2-" + x + "-" + y, {x: 50 + x, y: 50 + y}, Math.floor(Math.random() * 49) + 1);
       }
       }
       */
      for (var x = 0; x < 20; x++) {
        for (var y = 0; y < 20; y++) {
          world.addBadBeast("beas-" + x + "-" + y, {x: 20 + x, y: 40 + y});
        }
      }
      for (var x = 0; x < 10; x++) {
        for (var y = 0; y < 10; y++) {
          world.addGoodBeast("beas-" + x + "-" + y, {x: 4 + x, y: 40 + y});
        }
      }
      for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 7; y++) {
          world.addMiniBot("mini4-" + x + "-" + y, {x: 0 + x, y: 20 + y}, Math.floor(Math.random() * 49) + 1);
        }
      }
      for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 7; y++) {
          world.addMiniBot("mini5-" + x + "-" + y, {x: 0 + x, y: 30 + y}, Math.floor(Math.random() * 49) + 1);
        }
      }

      for (var x = 0; x < 20; x++) {
        for (var y = 0; y < 20; y++) {
          world.addBadFlower("flowb-" + x + "-" + y, {x: 43 + x, y: 30 + y});
        }
      }

      for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
          world.addGoodFlower("flow-" + x + "-" + y, {x: 1 + x, y: 1 + y});
        }
      }

      testMov = [];
      for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 7; y++) {
          testMov.push(world.addMiniBot("mini6-" + x + "-" + y, {
            x: 20 + (x * 2),
            y: 2 + (y * 2)
          }, Math.floor(Math.random() * 49) + 1));
        }
      }
    }


    // TODO: Test code remove
    function __labTick(tickCount) {
      //log("Board tick " + tickCount + " - " + tickCount % 4);

      if (tickCount == 0) {
        bot1.state = State.MOVING;
        bot1.move.setTargetPosition({x: 10, y: bot1.move.gridPos.y + 1});
      }

      if (tickCount == 2) {
        bot1.state = State.SPAWNING;
        minitest = world.addMiniBot("123123", {x: 10, y: 5}, 7);
        minitest.state = State.SPAWNED;
      }

      if (tickCount > 2) {
        minitest.state = State.MOVING;
        minitest.move.setTargetPosition({x: 10 - 1, y: 5});
      }

      if (tickCount == 4) {
        bot1.state = State.IDLING;
      }

      if (tickCount % 4 == 0 && tickCount < 20) {
        beast1.state = State.MOVING;
        beast1.move.setTargetPosition({x: 9, y: beast1.move.gridPos.y + 1});
      } else if (tickCount % 4 == 0 && tickCount >= 20) {
        beast1.state = State.DYING;
      }

      if (tickCount < 3) {
        bot2.state = State.MOVING;
        bot2.move.setTargetPosition({x: 13, y: bot2.move.gridPos.y + 1});
      } else if (tickCount == 3) {
        bot2.state = State.EXPLODE;
      }

      if (tickCount < 4) {
        bot3.state = State.MOVING;
        bot3.move.setTargetPosition({x: 12, y: bot3.move.gridPos.y + 1});
      } else if (tickCount == 4) {
        bot3.state = State.EXPLODE;
      }

      for (var index in testMov) {
        testMov[index].state = State.MOVING;
        testMov[index].move.setTargetPosition({x: testMov[index].move.gridPos.x, y: testMov[index].move.gridPos.y + 1});
      }


      bot4.state = State.MOVING;
      bot4.move.setTargetPosition({x: bot4.move.gridPos.x, y: bot4.move.gridPos.y + 1});

      if (tickCount == 2) {
        myFlower.state = State.DYING;
      }
    }

    // Return "class"
    return Board;
  });