/*
 * Global madness.
 */
var output = document.getElementById("output");

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
        "app/Simulation/Simulation"
    ],

    function (Simulation) {
        var sim = new Simulation();
        sim.runSimulation();
    }
);