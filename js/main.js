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


/**
 * App Main.
 */
define([
        "app/3d/world",
        "app/3d/master-bot-node",
        "app/3d/mini-bot-node",
        "lib/three"
    ],

    function (World, MasterBotNode, MiniBotNode, THREE) {

        var world = new World();

        var bot = new MasterBotNode();
        var mini = new MiniBotNode();
        world.add(bot);

        mini.mesh.position.x = 8;
        world.add(mini);



        world.render();
    }
);