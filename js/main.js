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
    "app/3d/Resources/MeshFactory",
    "app/3d/Resources/Textures",
    "app/Simulation/Simulation"
  ],

  function (MeshFactory, Textures, Simulation) {
    Textures.preload(function () {
      MeshFactory.initMesh();
      var sim = new Simulation();
      sim.runSimulation();
    });
  }
);