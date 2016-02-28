/**
 * Factory for reusable meshes and materials.
 */
define([
    "lib/three",
    "app/Common/Static"
  ],

  function (THREE, Static) {

    var NoOfColors = 7;

    var colors = {
      1: new THREE.Color(0xeeeeee),
      2: new THREE.Color(0xfcd04a),
      3: new THREE.Color(0xe45e9f),
      4: new THREE.Color(0x111111),
      5: new THREE.Color(0x5ab322),
      6: new THREE.Color(0xdb302e),
      7: new THREE.Color(0x3366ff)
    };

    var colorCombinations = __generateColorCombinations();

    var masterBotGeometry = new THREE.SphereGeometry(7.5, 32, 32);
    var masterBotStripesGeometry = new THREE.DodecahedronGeometry(8.5);
    var miniBotGeometry = new THREE.IcosahedronGeometry(5);
    var miniBotStripesGeometry = new THREE.OctahedronGeometry(6.3);
    var beastGeometry = new THREE.TorusGeometry(3, 1.6, 2, 5);
    var flowerGeometry = new THREE.SphereGeometry(3, 4, 4);
    var wallGeometry = new THREE.BoxGeometry(10, 10, 10);

    var masterBotMaterials = __generateMasterBotMaterials();
    var masterBotStripeMaterials = __generateMasterBotStripeMaterials();
    var miniBotMaterials = __generateMiniBotMaterials();
    var miniBotStripeMaterials = __generateMiniBotStripeMaterials();

    var goodBeastMaterial = new THREE.MeshLambertMaterial({
      color: 0x0000ff
    });
    var badBeastMaterial = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });
    var goodFlowerMaterial = new THREE.MeshLambertMaterial({
      color: 0x00ff00
    });
    var badFlowerMaterial = new THREE.MeshLambertMaterial({
      color: 0xffff00
    });
    var wallMaterial = new THREE.MeshPhongMaterial({
      color: 0x444444,
      shininess: 60
    });

    // Object
    var MeshFactory = {};

    /**
     * Init mesh factory
     */
    MeshFactory.initMesh = function () {
      // TODO: Do real init with different colors etc.
    };

    /**
     * Creates a master bot body mesh.
     * @param colorId - Number
     * @returns THREE.Mesh
     */
    MeshFactory.createBotBodyMesh = function (colorId) {
      var material = masterBotMaterials[colorCombinations[colorId].sec];
      return new THREE.Mesh(masterBotGeometry, material);
    };

    /**
     * Creates a master bot stripe mesh.
     * @param colorId - Number
     * @returns THREE.Mesh
     */
    MeshFactory.createBotStripeMesh = function (colorId) {
      var material = masterBotStripeMaterials[colorCombinations[colorId].pri];
      return new THREE.Mesh(masterBotStripesGeometry, material);
    };

    /**
     * Creates a mini bot body mesh.
     * @param colorId - Number
     * @returns THREE.Mesh
     */
    MeshFactory.createMiniBotMesh = function (colorId) {
      var material = miniBotMaterials[colorCombinations[colorId].pri];
      return new THREE.Mesh(miniBotGeometry, material);
    };

    /**
     * Creates a mini bot stripe mesh.
     * @param colorId - Number
     * @returns THREE.Mesh
     */
    MeshFactory.createMiniBotStripeMesh = function (colorId) {
      var material = miniBotStripeMaterials[colorCombinations[colorId].sec];
      return new THREE.Mesh(miniBotStripesGeometry, material);
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
     * Creates a wall mesh
     * @returns THREE.Mesh
     */
    MeshFactory.createWallMesh = function () {
      return new THREE.Mesh(wallGeometry, wallMaterial);
    };

    /**
     * Creates a floor mesh
     * @params width - Size in 2d tiles
     * @params height - Size in 2d tiles
     * @returns THREE.Mesh
     */
    MeshFactory.createFloorMesh = function (width, height) {
      var geometry = new THREE.BoxGeometry(width * Static.TileSize, height * Static.TileSize, 1);
      var material = new THREE.MeshPhongMaterial({
        color: 0x888888,
        shininess: 10,
        shading: THREE.FlatShading
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = ((width * Static.TileSize) / 2) - (Static.TileSize / 2);
      mesh.position.y = ((height * Static.TileSize) / 2) + (Static.TileSize / 2);
      return mesh;
    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Generates color combination matrix.
     * @returns color matrix
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
            shininess: 2000,
            shading: THREE.FlatShading
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
            specular: 0x222222,
            shininess: 40,
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
            specular: 0x999999,
            shininess: 5,
            shading: THREE.FlatShading
          })
        );
      }
      return materials;
    }

    /**
     * Generates mini bot stripe materials.
     * @returns Array of materials
     * @private
     */
    function __generateMiniBotStripeMaterials() {
      var materials = [];
      for (var i = 1; i <= NoOfColors; i++) {
        materials.push(
          new THREE.MeshPhongMaterial({
            color: colors[i],
            specular: 0x222222,
            shininess: 10
          })
        );
      }
      return materials;
    }

    // Return object
    return MeshFactory
  });