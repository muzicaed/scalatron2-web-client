/**
 * Factory for reusable meshes and materials.
 */
define([
    "lib/three"
  ],

  function (THREE) {

    var masterBotGeometry = new THREE.SphereGeometry(8, 64, 64);
    var masterBotMaterial  = new THREE.MeshPhongMaterial({
      color: 0x222288,
      specular: 0x888888,
      shininess: 500 ,
      shading: THREE.FlatShading
    });

    var miniBotGeometry = new THREE.IcosahedronGeometry(3);
    var miniBotMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      specular: 0x999999,
      shininess: 100,
      shading: THREE.FlatShading
    });



    // Object
    var MeshFactory = {};

    MeshFactory.initMesh = function () {
      // TODO: Do real init with different colors etc.
    };

    MeshFactory.createBotMesh = function () {
      return new THREE.Mesh(masterBotGeometry, masterBotMaterial);
    };

    MeshFactory.createMiniBotMesh = function () {
      return new THREE.Mesh(miniBotGeometry, miniBotMaterial);
    };

    // Return object
    return MeshFactory
  });