/**
 * Factory for reusable meshes and materials.
 */
define([
    "lib/three",
    "app/3d/PositionConverter",
    "app/3d/Resources/Textures",
    "app/Common/Static"
  ],

  function (THREE, PositionConverter, Textures, Static) {

    var NoOfColors = 7;

    var colors = {
      1: new THREE.Color(0x00ffff),
      2: new THREE.Color(0xfcd04a),
      3: new THREE.Color(0xe45e9f),
      4: new THREE.Color(0x8B4513),
      5: new THREE.Color(0x5ab322),
      6: new THREE.Color(0xdb302e),
      7: new THREE.Color(0x3366ff)
    };

    var colorCombinations = __generateColorCombinations();

    var masterBotGeometry, masterBotStripesGeometry, miniBotGeometry, beastGeometry, flowerGeometry;
    var masterBotMaterials, masterBotStripeMaterials, miniBotMaterials, goodBeastMaterial, badBeastMaterial,
      goodFlowerMaterial, badFlowerMaterial, wallMaterial, floorMaterial;

    // Object
    var MeshFactory = {};

    /**
     * Init mesh factory
     * TODO: Optimize more, reuse the whole mesh when possible
     */
    MeshFactory.initMesh = function () {
      masterBotGeometry = new THREE.SphereGeometry(9.5, 32, 32);
      masterBotStripesGeometry = new THREE.DodecahedronGeometry(10.5);
      miniBotGeometry = new THREE.OctahedronGeometry(4.5);
      beastGeometry = new THREE.TorusGeometry(3.8, 1.3, 3, 5);
      flowerGeometry = new THREE.SphereGeometry(5, 4, 3.5);

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
    };

    /**
     * Creates a master bot body mesh.
     * @param colorId - Number
     * @returns THREE.Mesh
     */
    MeshFactory.createBotBodyMesh = function (colorId) {
      var material = masterBotMaterials[colorCombinations[colorId].pri];
      return new THREE.Mesh(masterBotGeometry, material);
    };

    /**
     * Creates a master bot stripe mesh.
     * @param colorId - Number
     * @returns THREE.Mesh
     */
    MeshFactory.createBotStripeMesh = function (colorId) {
      var material = masterBotStripeMaterials[colorCombinations[colorId].sec];
      return new THREE.Mesh(masterBotStripesGeometry, material);
    };

    /**
     * Creates a mini bot body mesh.
     * @param colorId - Number
     * @returns THREE.Mesh
     */
    MeshFactory.createMiniBotMesh = function (colorId) {
      var priMaterial = miniBotMaterials[colorCombinations[colorId].pri];
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
     * Creates a explosion mesh
     * Note: Can not reuse geometry or material.
     * @returns THREE.Mesh
     */
    MeshFactory.createExplosion = function (tileRadius) {
      var geometry = new THREE.CircleGeometry(tileRadius * Static.TileSize, 12);
      var material = new THREE.MeshLambertMaterial({
        transparent: true,
        opacity: 0.6,
        map: Textures.Explosion
      });
      return new THREE.Mesh(geometry, material);
    };

    /**
     * Creates a floor mesh
     * @params width - Size in 2d tiles
     * @params height - Size in 2d tiles
     * @returns THREE.Mesh
     */
    MeshFactory.createFloorMesh = function (width, height) {
      var geometry = new THREE.BoxGeometry(width * Static.TileSize, height * Static.TileSize, 1);
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
      var floorGeometry = new THREE.BoxGeometry(boardData.width * Static.TileSize, boardData.height * Static.TileSize, 1);
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
     * Generates color combination matrix.
     * @returns Object - color matrix
     * @private
     */
    function __generateColorCombinations() {
      var combinations = {};
      for (var s = 1; s <= NoOfColors; s++) {
        for (var p = 1; p <= NoOfColors; p++) {
          combinations[(s + (p * NoOfColors)) - NoOfColors] = {pri: p - 1, sec: s - 1}
        }
      }
      return combinations;
    }

    /**
     * Generates master bot base materials.
     * @returns Array of materials
     * @private
     */
    function __generateMasterBotMaterials() {
      var materials = [];
      for (var i = 1; i <= NoOfColors; i++) {
        materials.push(
          new THREE.MeshPhongMaterial({
            color: colors[i],
            specular: 0x888888,
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
      for (var i = 1; i <= NoOfColors; i++) {
        materials.push(
          new THREE.MeshPhongMaterial({
            color: colors[i],
            specular: 0xdddddd,
            shininess: 90,
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
      for (var i = 1; i <= NoOfColors; i++) {
        materials.push(
          new THREE.MeshPhongMaterial({
            color: colors[i],
            specular: 0xaaaaaa,
            shininess: 90,
            map: Textures.MiniBot
          })
        );
      }
      return materials;
    }

    // Return object
    return MeshFactory
  });