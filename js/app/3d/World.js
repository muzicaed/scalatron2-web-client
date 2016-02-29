/**
 * Represents the 3d World.
 */
define([
    "lib/three",
    "lib/threex-fullscreen",
    "app/3d/Manipulator",
    "app/3d/Nodes/MasterBotNode",
    "app/3d/Nodes/MiniBotNode",
    "app/3d/Nodes/BeastNode",
    "app/3d/Nodes/FlowerNode",
    "app/3d/PositionConverter",
    "app/Common/Static"
  ],

  function (THREE, THREEx, Manipulator, MasterBotNode, MiniBotNode, BeastNode, FlowerNode, PositionConverter, Static) {
    var viewPort = {width: window.innerWidth, height: window.innerHeight};
    var renderer = new THREE.WebGLRenderer({antialias: true});
    var scene = new THREE.Scene();
    var camera = null;

    /**
     *  Create a 3d world
     * @constructor
     */
    function World() {
      renderer.setSize(viewPort.width, viewPort.height);
      document.body.appendChild(renderer.domElement);
      __addFullScreenShortcut()
      Manipulator.scene = scene;
    }

    /**
     * Init the world
     * @param boardData - Object containing board/tile data.
     */
    World.prototype.init = function (boardData) {
      __createCamera(boardData);
      _initLights(boardData);
    };

    /**
     * Start the render loop.
     */
    World.prototype.render = function () {
      Manipulator.updateFrame();
      requestAnimationFrame(this.render.bind(this));
      renderer.render(scene, camera);

      /* TODO: Test code
      camera.position.x += 0.4;
      camera.position.y -= 0.2;
      camera.position.z -= 0.03;
      //camera.lookAt(new THREE.Vector3(camera.position.x, camera.position.y + 100, 0));
      */
    };

    /**
     * Creates and adds a new master bot.
     * @param id - String
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @param colorId - Number
     * @returns {MasterBotNode}
     */
    World.prototype.addMasterBot = function (id, initialPos, colorId) {
      var botNode = new MasterBotNode("MASTER-" + id, initialPos, colorId);
      __addObj(botNode);
      return botNode;
    };

    /**
     * Creates and adds a new mini bot.
     * @param id - String
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @param colorId - Number
     * @returns {MiniBotNode}
     */
    World.prototype.addMiniBot = function (id, initialPos, colorId) {
      var botNode = new MiniBotNode("MINI-" + id, initialPos, colorId);
      __addObj(botNode);
      return botNode;
    };

    /**
     * Creates and adds a good beast.
     * @param id - String
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @returns {BeastNode}
     */
    World.prototype.addGoodBeast = function (id, initialPos) {
      var beastNode = new BeastNode("G-BEAST-" + id, initialPos, BeastNode.Type.GOOD);
      __addObj(beastNode);
      return beastNode;
    };

    /**
     * Creates and adds a bad beast.
     * @param id - String
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @returns {BeastNode}
     */
    World.prototype.addBadBeast = function (id, initialPos) {
      var beastNode = new BeastNode("B-BEAST-" + id, initialPos, BeastNode.Type.BAD);
      __addObj(beastNode);
      return beastNode;
    };

    /**
     * Creates and adds a good flower.
     * @param id - String
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @returns {FlowerNode}
     */
    World.prototype.addGoodFlower = function (id, initialPos) {
      var flowerNode = new FlowerNode("G-FLOWER-" + id, initialPos, FlowerNode.Type.GOOD);
      __addObj(flowerNode);
      return flowerNode;
    };

    /**
     * Creates and adds a bad beast.
     * @param id - String
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @returns {FlowerNode}
     */
    World.prototype.addBadFlower = function (id, initialPos) {
      var flowerNode = new FlowerNode("B-FLOWER-" + id, initialPos, FlowerNode.Type.BAD);
      __addObj(flowerNode);
      return flowerNode;
    };

    /**
     * Adds a static node to the scene.
     * Typical static nodes are background objects etc.
     * These objects will not be process by the draw loop.
     * @param node - 3d object
     */
    World.prototype.addStatic = function (node) {
      scene.add(node);
    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Adds an simulation object.
     * @param obj - Simulation object
     * @private
     */
    function __addObj(obj) {
      scene.add(obj.node);
      Manipulator.add(obj);
    }

    /**
     * Adds event handler for "f" key = Set browser fullscreen.
     * @private
     */
    function __addFullScreenShortcut() {
      if (THREEx.FullScreen.available()) {
        document.onkeypress = function (e) {
          // detect "f"
          e = e || window.event;
          if (e.keyCode == 102) {
            THREEx.FullScreen.request(renderer.domElement);
          }
        }.bind(this);
      }
    }

    /**
     * Create camera.
     */
    function __createCamera(boardData) {
      camera = new THREE.PerspectiveCamera(75,
        viewPort.width / viewPort.height,
        0.1,
        2000);

      var x = (boardData.width * Static.TileSize) / 2;
      var y = (boardData.height * Static.TileSize) / 2;

      camera.position.set(x, y - (y / 10), y * 1.6);
      camera.lookAt(new THREE.Vector3(x, y, 0));

      // TODO: Test code, camera zoom in.

      camera.position.set(x - 200, y + 180, 70);
      camera.fox = 30;
      camera.lookAt(new THREE.Vector3(x - 200, y + 250, 0));
/*
      var newX = x;
      setInterval(function () {
        camera.position.x += 0.8;
        camera.position.y -= 0.4;
        camera.position.z -= 0.09;
        newX += 0.3;
        //camera.lookAt(new THREE.Vector3(newX, y + 10, 0));
      }, 30);
      */

    }

    /**
     * Init lights.
     */
    function _initLights(boardData) {
      var x = (boardData.width * Static.TileSize);
      var y = (boardData.height * Static.TileSize);

      var blueLight = new THREE.PointLight(0x773322, 1.3, y + (y / 3), 1.1);
      blueLight.position.set(x / 10, y / 10, y / 2);
      scene.add(blueLight);

      var redLight = new THREE.PointLight(0x333388, 1.3, y + (y / 3), 1.1);
      redLight.position.set(x - (x / 10), y - (y / 10), y / 2);
      scene.add(redLight);


      var ambient = new THREE.AmbientLight(0xaaaaaa);
      scene.add(ambient);
    }

    // Return "class"
    return World;
  });
