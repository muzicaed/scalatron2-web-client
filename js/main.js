/*
 * Global madness.
 */
var output = document.getElementById("output");

var log = function (out) {
    console.log(out)
};

var put = function (out) {
    log(out);
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = out;
    output.appendChild(pre);
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