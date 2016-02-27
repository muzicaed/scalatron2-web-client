/**
 * Factory for reusable meshes and materials.
 */
define([
    "lib/three"
  ],

  function (THREE) {

    var noOfColors = 7;

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

    var masterBotGeometry = new THREE.SphereGeometry(6.5, 64, 64);
    var masterBotMaterial = new THREE.MeshPhongMaterial({
      color: 0x00aa00,
      specular: 0x888888,
      shininess: 2000,
      shading: THREE.FlatShading,
    });

    var masterBotStripesGeometry = new THREE.DodecahedronGeometry(7.4);
    var masterBotStripesMaterial = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa,
      specular: 0x222222,
      shininess: 40,
      shading: THREE.FlatShading,
    });

    var miniBotGeometry = new THREE.IcosahedronGeometry(4);
    var miniBotMaterial = new THREE.MeshPhongMaterial({
      specular: 0x999999,
      shininess: 5,
      shading: THREE.FlatShading
    });

    var miniBotStripesGeometry = new THREE.OctahedronGeometry(5);
    var miniBotStripesMaterial = new THREE.MeshPhongMaterial({
      specular: 0x222222,
      shininess: 10
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
      var material = masterBotMaterial.clone();
      material.color = colorCombinations[colorId].sec;
      return new THREE.Mesh(masterBotGeometry, material);
    };

    /**
     * Creates a master bot stripe mesh.
     * @param colorId - Number
     * @returns THREE.Mesh
     */
    MeshFactory.createBotStripeMesh = function (colorId) {
      var material = masterBotStripesMaterial.clone();
      material.color = colorCombinations[colorId].pri;
      return new THREE.Mesh(masterBotStripesGeometry, material);
    };

    /**
     * Creates a mini bot body mesh.
     * @param colorId - Number
     * @returns THREE.Mesh
     */
    MeshFactory.createMiniBotMesh = function (colorId) {
      var material = miniBotMaterial.clone();
      material.color = colorCombinations[colorId].pri;
      return new THREE.Mesh(miniBotGeometry, material);
    };

    /**
     * Creates a mini bot stripe mesh.
     * @param colorId - Number
     * @returns THREE.Mesh
     */
    MeshFactory.createMiniBotStripeMesh = function (colorId) {
      var material = miniBotStripesMaterial.clone();
      material.color = colorCombinations[colorId].sec;
      return new THREE.Mesh(miniBotStripesGeometry, material);
    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Generates color combination matrix.
     * @returns color matrix
     * @private
     */
    function __generateColorCombinations() {
      var combinations = {};
      for(var s = 1; s <= noOfColors; s++) {
        for(var p = noOfColors; p > 0; p--) {
          combinations[(s + (p * noOfColors)) - noOfColors] = {pri: colors[p], sec: colors[s]}
        }
      }
      return combinations;
    }

    // Return object
    return MeshFactory
  });