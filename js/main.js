/*
 * Global madness.
 */
var log = function (out) {
  console.log(out)
};

requirejs.onError = function (err) {
  log(err.requireType);
  log(err.requireModules);
  log(err.stack);
  throw err;
};


/**
 * App Main.
 */
define([
    "app/ScalatronSocket",
    "app/3d/Resources/MeshFactory",
    "app/3d/Resources/Textures",
    "app/Audio",
    "app/Simulation/Simulation"
  ],

  function (ScalatronSocket, MeshFactory, Textures, Audio, Simulation) {
    Textures.preload(function () {
      Audio.load();
      MeshFactory.initMesh();
      var sim = new Simulation();
      new ScalatronSocket(function () {
        log("Connected to server...");
      }, sim.addTick.bind(sim));
    });


  }
);