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
        "app/3d/World",
        "app/3d/MasterBotNode",
        "app/3d/MiniBotNode",
        "app/3d/Board"
    ],

    function (World, MasterBotNode, MiniBotNode, Board) {

        var world = new World();
        var bot = new MasterBotNode();
        var mini = new MiniBotNode();
        var mini2 = new MiniBotNode();
        var mini3 = new MiniBotNode();
        var board = new Board();

        world.add(bot);
        world.add(mini);
        world.add(mini2);
        world.add(mini3);
        world.add(board);

        bot.node.position.x = 50;
        mini.node.position.x = 30;
        mini2.node.position.x = 30;
        mini2.node.position.y = 20;
        mini3.node.position.x = 20;
        mini3.node.position.y = 20;
        world.render();
    }
);