/**
 * Factory for reusable meshes and materials.
 */
define([
    "lib/three"
  ],

  function (THREE) {

    var masterBotGeometry = new THREE.SphereGeometry(6, 32, 32);
    var masterBotMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});

    var miniBotGeometry = new THREE.IcosahedronGeometry(3);
    var miniBotMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
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