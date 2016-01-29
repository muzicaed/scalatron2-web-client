define(function () {

    var wsUri = "ws://10.0.0.154:8888/greeter";

    /**
     *  Create a scalatron socket.
     * @constructor
     */
    function ScalatronSocket(onConnectedCallback, onMessageCallback) {
        this.onConnectedCallback = onConnectedCallback;
        this.onMessageCallback = onMessageCallback;

        this.socket = new WebSocket(wsUri);
        this.socket.onopen = this.__onOpen.bind(this);
        this.socket.onclose = this.__onClose.bind(this);
        this.socket.onerror = this.__onError.bind(this);
        this.socket.onmessage = this.__onMessage.bind(this);
    }

    /**
     * Send message using socket.
     */
    ScalatronSocket.prototype.sendMessage = function (message) {
        put("Sending: " + message);
        this.socket.send(message);
    };

    /// INTERNAL /////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * On web socket open.
     */
    ScalatronSocket.prototype.__onOpen = function (evt) {
        put("CONNECTED!");
        this.onConnectedCallback();
    };

    /**
     * On web socket close.
     */
    ScalatronSocket.prototype.__onClose = function (evt) {
        put("onClose!");
    };

    /**
     * On web socket error.
     */
    ScalatronSocket.prototype.__onError = function (evt) {
        put("onError!");
    };

    /**
     * On web socket error.
     */
    ScalatronSocket.prototype.__onMessage = function (evt) {
        put("Received message:");
        put(evt);
        this.onMessageCallback(evt);
    };


    // Return "class"
    return ScalatronSocket
});