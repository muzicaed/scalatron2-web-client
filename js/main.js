
/*
 * Global madness.
 */
var output = document.getElementById("output");

var log = function(out) {
    console.log(out)
};

var put = function(out) {
    log(out);
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = out;
    output.appendChild(pre);
};


/**
 * App Main.
 */
define(["app/scalatron-socket"],

    function(ScalatronSocket) {



        var onConnected = function(evt) {
            put("Connected!");
            test.sendMessage("Blaaaaa");
        };

        var onMessage = function(evt) {
            put("Got message:");
            put(evt.data);
        };



        var test = new ScalatronSocket(onConnected, onMessage);
    }



);