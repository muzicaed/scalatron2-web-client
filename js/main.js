document.addEventListener("DOMContentLoaded", function() {
  var ScalatronSocket = require("app/ScalatronSocket");
  var Textures = require("app/3d/Resources/Textures");
  var MeshFactory = require("app/3d/Resources/MeshFactory");
  var Audio = require("app/Audio");
  var Simulation = require("app/Simulation/Simulation");
  var KeyboardListener = require("app/KeyboardListener");

  var socket;

  Textures.preload(function () {
    Audio.load();
    MeshFactory.initMesh();
    var sim = new Simulation();
    KeyboardListener.load(sim);
    socket = new ScalatronSocket(__onConnect, sim.addTick.bind(sim));
  });

  /**
   * On socket connected.
   * Request live stream from server.
   * @param evt
   * @private
   */
  var __onConnect = function () {
    socket.sendMessage("live");
  };
});






///*
// * Global madness.
// */
//var log = function (out) {
//  console.log(out)
//};
//
//requirejs.onError = function (err) {
//  log(err.requireType);
//  log(err.requireModules);
//  log(err.stack);
//  throw err;
//};
//
///**
// * App Main.
// */
//define([
//    "app/ScalatronSocket",
//    "app/3d/Resources/MeshFactory",
//    "app/3d/Resources/Textures",
//    "app/Audio",
//    "app/Simulation/Simulation",
//    "app/KeyboardListener"
//  ],
//
//  function (ScalatronSocket, MeshFactory, Textures, Audio, Simulation, KeyboardListener) {
//
//    var socket;
//
//    Textures.preload(function () {
//      Audio.load();
//      MeshFactory.initMesh();
//      var sim = new Simulation();
//      KeyboardListener.load(sim);
//      socket = new ScalatronSocket(__onConnect, sim.addTick.bind(sim));
//    });
//
//    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    /**
//     * On socket connected.
//     * Request live stream from server.
//     * @param evt
//     * @private
//     */
//    var __onConnect = function () {
//      socket.sendMessage("live");
//    };
//  }
//);