/**
 * Factory for reusable meshes and materials.
 */
define([
    "lib/three"
  ],

  function (THREE) {

    var masterBotGeometry = new THREE.SphereGeometry(7, 64, 64);
    var masterBotMaterial  = new THREE.MeshPhongMaterial({
      color: 0x222288,
      specular: 0x888888,
      shininess: 500 ,
      shading: THREE.FlatShading,
    });

    var masterBotStripesGeometry = new THREE.DodecahedronGeometry(7.9);
    var masterBotStripesMaterial  = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa,
      specular: 0x888888,
      shininess: 500 ,
      shading: THREE.FlatShading,
    });

    var miniBotGeometry = new THREE.IcosahedronGeometry(4);
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

    MeshFactory.createBotBodyMesh = function () {
      return new THREE.Mesh(masterBotGeometry, masterBotMaterial.clone());
    };

    MeshFactory.createBotHeadMesh = function () {
      return new THREE.Mesh(masterBotStripesGeometry, masterBotStripesMaterial.clone());
    };

    MeshFactory.createMiniBotMesh = function () {
      return new THREE.Mesh(miniBotGeometry, miniBotMaterial.clone());
    };

    // Return object
    return MeshFactory
  });