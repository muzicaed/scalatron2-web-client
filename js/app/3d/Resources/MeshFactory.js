var THREE = require("lib/three");
var PositionConverter = require("app/3d/PositionConverter");
var Textures = require("app/3d/Resources/Textures");
var Static = require("app/Common/Static");
var Colors = require("app/3d/Resources/Colors");

/**
 * Factory for reusable meshes and materials.
 */

var masterBotGeometry, masterBotStripesGeometry, miniBotGeometry, beastGeometry, flowerGeometry;
var masterBotMaterials, masterBotStripeMaterials, miniBotMaterials, goodBeastMaterial, badBeastMaterial,
  goodFlowerMaterial, badFlowerMaterial, wallMaterial, floorMaterial;

// Object
var MeshFactory = {};
MeshFactory.explosionMeshes = {};

/**
 * Init mesh factory
 */
MeshFactory.initMesh = function () {
  masterBotGeometry = new THREE.SphereBufferGeometry(9.5, 32, 32);
  masterBotStripesGeometry = new THREE.DodecahedronGeometry(10.8);
  miniBotGeometry = new THREE.SphereBufferGeometry(5, 6, 6);
  beastGeometry = new THREE.TorusBufferGeometry(3.8, 1.3, 3, 5);
  flowerGeometry = new THREE.ConeBufferGeometry(4.4, 5, 5);

  masterBotMaterials = __generateMasterBotMaterials();
  masterBotStripeMaterials = __generateMasterBotStripeMaterials();
  miniBotMaterials = __generateMiniBotMaterials();

  goodBeastMaterial = new THREE.MeshPhongMaterial({
    color: 0x0000ff,
    specular: 0x888888,
    shininess: 30
  });
  badBeastMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    specular: 0x888888,
    shininess: 30
  });
  goodFlowerMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    specular: 0xffffff,
    shininess: 10,
    shading: THREE.FlatShading
  });
  badFlowerMaterial = new THREE.MeshPhongMaterial({
    color: 0xffff00,
    specular: 0xffffff,
    shininess: 10,
    shading: THREE.FlatShading
  });
  floorMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888,
    shininess: 80,
    shading: THREE.FlatShading,
    map: Textures.Floor
  });
  wallMaterial = new THREE.MeshPhongMaterial({
    color: 0x383838,
    shininess: 200,
    shading: THREE.FlatShading
  });

  MeshFactory.explosionMeshes = __generateExplosionMeshes();
};

/**
 * Creates a master bot body mesh.
 * @param masterBotId - Number
 * @returns THREE.Mesh
 */
MeshFactory.createBotBodyMesh = function (masterBotId) {
  var color = Colors.getColor(masterBotId);
  var material = masterBotMaterials[color.sec];
  return new THREE.Mesh(masterBotGeometry, material);
};

/**
 * Creates a master bot stripe mesh.
 * @param masterBotId - Number
 * @returns THREE.Mesh
 */
MeshFactory.createBotStripeMesh = function (masterBotId) {
  var color = Colors.getColor(masterBotId);
  var material = masterBotStripeMaterials[color.pri];
  return new THREE.Mesh(masterBotStripesGeometry, material);
};

/**
 * Creates a mini bot body mesh.
 * @param masterBotId - Number
 * @returns THREE.Mesh
 */
MeshFactory.createMiniBotMesh = function (masterBotId) {
  var color = Colors.getColor(masterBotId);
  var priMaterial = miniBotMaterials[color.sec];
  return new THREE.Mesh(miniBotGeometry, priMaterial);
};

/**
 * Creates a good beast mesh
 * @returns THREE.Mesh
 */
MeshFactory.createGoodBeastMesh = function () {
  return new THREE.Mesh(beastGeometry, goodBeastMaterial);
};

/**
 * Creates a bad beast mesh
 * @returns THREE.Mesh
 */
MeshFactory.createBadBeastMesh = function () {
  return new THREE.Mesh(beastGeometry, badBeastMaterial);
};

/**
 * Creates a good flower mesh
 * @returns THREE.Mesh
 */
MeshFactory.createGoodFlowerMesh = function () {
  return new THREE.Mesh(flowerGeometry, goodFlowerMaterial);
};

/**
 * Creates a bad flower mesh
 * @returns THREE.Mesh
 */
MeshFactory.createBadFlowerMesh = function () {
  return new THREE.Mesh(flowerGeometry, badFlowerMaterial);
};

/**
 * Creates a floor mesh
 * @params width - Size in 2d tiles
 * @params height - Size in 2d tiles
 * @returns THREE.Mesh
 */
MeshFactory.createFloorMesh = function (width, height) {
  var geometry = new THREE.BoxBufferGeometry(width * Static.TileSize, height * Static.TileSize, 1);
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = ((width * Static.TileSize) / 2) - (Static.TileSize / 2);
  mesh.position.y = ((height * Static.TileSize) / 2) + (Static.TileSize / 2);
  return mesh;
};

/**
 * Creates a floor mesh
 * @params boardData
 * @returns THREE.Object3D
 */
MeshFactory.createBoard = function (boardData) {
  var floorGeometry = new THREE.BoxBufferGeometry(boardData.width * Static.TileSize, boardData.height * Static.TileSize, 1);
  var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.position.x = ((boardData.width * Static.TileSize) / 2) - (Static.TileSize / 2);
  floorMesh.position.y = ((boardData.height * Static.TileSize) / 2) + (Static.TileSize / 2);
  floorMesh.position.z = -4;

  var combinedGeo = new THREE.Geometry();
  for (var i = 0; i < boardData.walls.length; i++) {
    var wall = boardData.walls[i];
    var width = wall.e.x * Static.TileSize;
    var height = wall.e.y * Static.TileSize;

    var wallGeometry = new THREE.BoxGeometry(width, height, 12);
    var wallMesh = new THREE.Mesh(wallGeometry);
    var vec3d = PositionConverter.convert(new THREE.Vector2(wall.x, wall.y), true);
    wallMesh.position.x = vec3d.x + (width / 2);
    wallMesh.position.y = vec3d.y - (height / 2);
    wallMesh.position.z = 0;
    wallMesh.updateMatrix();
    combinedGeo.merge(wallMesh.geometry, wallMesh.matrix);
  }

  var combinedWallMesh = new THREE.Mesh(combinedGeo, wallMaterial);
  var boardObj = new THREE.Object3D();
  boardObj.add(floorMesh);
  boardObj.add(combinedWallMesh);
  return boardObj;
};


/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Generates master bot base materials.
 * @returns Array of materials
 * @private
 */
function __generateMasterBotMaterials() {
  var materials = [];
  for (var i = 1; i <= Colors.count; i++) {
    materials.push(
      new THREE.MeshPhongMaterial({
        color: Colors.col[i],
        specular: 0x555555,
        shininess: 800,
        map: Textures.Bot
      })
    );
  }
  return materials;
}

/**
 * Generates master bot stripe materials.
 * @returns Array of materials
 * @private
 */
function __generateMasterBotStripeMaterials() {
  var materials = [];
  for (var i = Colors.count; i > 0; i--) {
    materials.push(
      new THREE.MeshPhongMaterial({
        color: Colors.col[i],
        specular: 0x222222,
        shininess: 10,
        shading: THREE.FlatShading
      })
    );
  }
  return materials;
}

/**
 * Generates mini bot base materials.
 * @returns Array of materials
 * @private
 */
function __generateMiniBotMaterials() {
  var materials = [];
  for (var i = 1; i <= Colors.count; i++) {
    materials.push(
      new THREE.MeshStandardMaterial({
        color: Colors.col[i],
        map: Textures.MiniBot,
        roughness: 0.35,
        metalness: 0.52
      })
    );
  }
  return materials;
}

/**
 * Pre create explosion meshes.
 * @returns Object collection of meshes
 * @private
 */
function __generateExplosionMeshes() {
  var meshes = {};
  for(var rad = 1; rad <= 10; rad++) {
    meshes[rad] = MeshFactory.createExplosion(rad);
  }
  return meshes;
}

/**
 * Creates a explosion mesh
 * @returns THREE.Mesh
 */
MeshFactory.createExplosion = function(tileRadius) {
  var geometry = new THREE.SphereBufferGeometry(tileRadius * Static.TileSize, 16, 16);

  var material = new THREE.MeshLambertMaterial({
    transparent: true,
    map: Textures.Explosion,
    opacity: 0.5
  });
  return new THREE.Mesh(geometry, material);
};

// Export object
module.exports = MeshFactory;