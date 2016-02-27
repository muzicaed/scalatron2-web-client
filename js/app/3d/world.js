/**
 * Represents the 3d World.
 * TODO: Check this properties. Can be moved out and be protected.
 */
define([
    "lib/three",
    "lib/threex-fullscreen",
    "app/3d/Manipulator",
    "app/3d/Nodes/MasterBotNode",
    "app/3d/Nodes/MiniBotNode",
    "app/3d/PositionConverter",
    "app/Common/Static"
  ],

  function (THREE, THREEx, Manipulator, MasterBotNode, MiniBotNode, PositionConverter, Static) {

    var viewPort = {width: 1024, height: 768};
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
    };

    /**
     * Creates and adds a new master bot.
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @returns {MasterBotNode}
     */
    World.prototype.addMasterBot = function (id, initialPos) {
      var botNode = new MasterBotNode("MASTER-" + id, initialPos);
      scene.add(botNode.node);
      Manipulator.add(botNode);
      return botNode;
    };

    /**
     * Creates and adds a new mini bot.
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @returns {MiniBotNode}
     */
    World.prototype.addMiniBot = function (id, initialPos) {
      var botNode = new MiniBotNode("MINI-" + id, initialPos);
      scene.add(botNode.node);
      Manipulator.add(botNode);
      return botNode;
    };

    /**
     * Adds a static node to the scene.
     * Typical static nodes are background objects etc.
     * These objects will not be process by the draw loop.
     */
    World.prototype.addStatic = function (obj) {
      scene.add(obj.node);
    };

    /// INTERNAL /////////////////////////////////////////////////////////////////////////////////////////////////////

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
            camera.position.z = 120; // TODO: Calc zoom based on scale screen vs. board size.
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
        500);

      var x = (boardData.width * Static.TileSize) / 2;
      var y = (boardData.height * Static.TileSize) / 2;

      camera.position.set(x, y - (y / 10), x + y); // TODO: Calc zoom based on scale screen vs. board size.
      camera.lookAt(new THREE.Vector3(x, y, 0));
    }

    /**
     * Init lights.
     */
    function _initLights(boardData) {
      var light = new THREE.PointLight(0xffffff, 0.6, 50, 0.5);
      light.position.set(50, 40, 50);
      scene.add(light);

      var spotLight = new THREE.SpotLight(0xffffff);
      var x = (boardData.width * Static.TileSize);
      var y = (boardData.height * Static.TileSize);
      spotLight.position.set(x, y, x + y); // TODO: Calc zoom based on scale screen vs. board size.
      scene.add(spotLight);

      var ambient = new THREE.AmbientLight(0x404040);
      scene.add(ambient);
    }

    // Return "class"
    return World;
  });