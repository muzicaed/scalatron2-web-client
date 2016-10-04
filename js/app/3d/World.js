var THREE = require("lib/three");
var THREEx = require("lib/threex-fullscreen");
var Manipulator = require("app/3d/Manipulator");
var Instructor = require("app/Simulation/Instructor");
var Static = require("app/Common/Static");

/**
 * Represents the 3d World.
 */
var viewPort = {width: window.innerWidth, height: window.innerHeight};
var canvas = document.getElementById("simulation-canvas");
var renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
var camera = null;
var board = null;

/**
 *  Create a 3d world
 * @constructor
 */
function World() {
  console.log(viewPort);
  this.scene = new THREE.Scene();
  renderer.setSize(viewPort.width - 250, viewPort.height);
  document.body.appendChild(renderer.domElement);
  __addFullScreenShortcut();
  Manipulator.world = this;
  Instructor.scene = this.scene;
}

/**
 * Init the world
 * @param boardData - Object containing board/tile data.
 */
World.prototype.init = function (boardData) {
  board = boardData;
  __createCamera();
  this.resetCamera();
  _initLights(this.scene);
  Manipulator.camera = camera;
};

/**
 * Start the render loop.
 */
World.prototype.render = function () {
  if (Manipulator.isLastDone) {
    Manipulator.updateFrame();
    requestAnimationFrame(this.render.bind(this));
    renderer.render(this.scene, camera);
  } else {
    log("Render skip.");
  }
};

/**
 * Adds a static node to the scene.
 * Typical static nodes are background objects etc.
 * These objects will not be process by the draw loop.
 * @param node - 3d object
 */
World.prototype.addStatic = function (node) {
  this.scene.add(node);
};

/**
 * Resets camera to default position.
 */
World.prototype.resetCamera = function () {
  var x = ((board.width * Static.TileSize) / 2);
  var y = ((board.height * Static.TileSize) / 2) - (Static.TileSize / 2);
  camera.position.set(x, y - (y / 20), y * 1.40);
  camera.lookAt(new THREE.Vector3(x, y, 0));
};

/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

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
function __createCamera() {
  camera = new THREE.PerspectiveCamera(75,
    viewPort.width / viewPort.height,
    0.1,
    2000);
}

/**
 * Init lights.
 */
function _initLights(scene) {
  var x = (board.width * Static.TileSize);
  var y = (board.height * Static.TileSize);

  var blueLight = new THREE.PointLight(0x773322, 1.3, y + (y / 3), 1.1);
  blueLight.position.set(x / 10, y / 10, y / 2);
  scene.add(blueLight);

  var redLight = new THREE.PointLight(0x333388, 1.3, y + (y / 3), 1.1);
  redLight.position.set(x - (x / 10), y - (y / 10), y / 2);
  scene.add(redLight);


  var ambient = new THREE.AmbientLight(0xaaaaaa);
  scene.add(ambient);
}

// Export "class"
module.exports = World;
