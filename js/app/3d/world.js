define([
        "lib/three",
        "lib/threex-fullscreen",
        "app/Common/Static"
    ],

    function (THREE, THREEx, Static) {

        var viewPort = {width: 1024, height: 768};
        var renderer = new THREE.WebGLRenderer({antialias: true});
        var simulationObjects = {};

        /**
         *  Create a 3d world
         * @constructor
         */
        function World() {
            this.scene = new THREE.Scene();
            renderer.setSize(viewPort.width, viewPort.height);
            document.body.appendChild(renderer.domElement);
            this.__addFullscreenShortcut()
        }

        /**
         * Init the world
         * @param boardData - Object containing board/tile data.
         */
        World.prototype.init = function (boardData) {
            this.camera = this.__createCamera(boardData);
            this._initLights(boardData);
        };

        /**
         * Start the render loop.
         */
        World.prototype.render = function () {

            // TODO: Test Code
            for (var index in simulationObjects) {
                var obj = simulationObjects[index];
                obj.node.position.x += obj.movable.velocity.x;
                obj.node.position.y += obj.movable.velocity.y;
            }

            requestAnimationFrame(this.render.bind(this));
            renderer.render(this.scene, this.camera);
        };

        /**
         * Retrieves 3d object on id
         * @param id - String
         */
        World.prototype.findObj = function (id) {
            // TODO: Handle errors and no id found etc.
            return simulationObjects[id];
        };

        /**
         * Adds a node to the scene.
         */
        World.prototype.add = function (obj) {
            simulationObjects[obj.id] = obj;
            log(simulationObjects);
            this.scene.add(obj.node);
        };

        /**
         * Adds a static node to the scene.
         * Typical static nodes are background objects etc.
         * These objects will not be process by the draw loop.
         */
        World.prototype.addStatic = function (obj) {
            this.scene.add(obj.node);
        };

        /// INTERNAL /////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Adds event handler for "f" key = Set browser fullscreen.
         * @private
         */
        World.prototype.__addFullscreenShortcut = function () {
            if (THREEx.FullScreen.available()) {
                document.onkeypress = function (e) {
                    // detect "f"
                    e = e || window.event;
                    if (e.keyCode == 102) {
                        this.camera.position.z = 120; // TODO: Calc zoom based on scale screen vs. board size.
                        THREEx.FullScreen.request(renderer.domElement);
                    }
                }.bind(this);
            }
        }

        /**
         * Create camera.
         */
        World.prototype.__createCamera = function (boardData) {
            var camera = new THREE.PerspectiveCamera(75,
                viewPort.width / viewPort.height,
                0.1,
                500);

            // TODO: Use static data instead of * 10
            var x = (boardData.width * 10) / 2;
            var y = (boardData.height * 10) / 2;


            camera.position.set(x, y - (y / 10), x + y); // TODO: Calc zoom based on scale screen vs. board size.
            camera.lookAt(new THREE.Vector3(x, y, 0));
            return camera;
        };

        /**
         * Init lights.
         */
        World.prototype._initLights = function (boardData) {
            var light = new THREE.PointLight(0xffffff, 0.6, 50, 0.5);
            light.position.set(50, 40, 50);
            this.scene.add(light);

            var spotLight = new THREE.SpotLight(0xffffff);
            // TODO: Use static data instead of * 10
            var x = (boardData.width * 10);
            var y = (boardData.height * 10);

            spotLight.position.set(x, y, x + y); // TODO: Calc zoom based on scale screen vs. board size.
            spotLight.shadowCameraNear = 10;
            spotLight.shadowCameraFar = 4000;
            spotLight.shadowCameraFov = 30;

            this.scene.add(spotLight);

            var ambient = new THREE.AmbientLight(0x404040);
            this.scene.add(ambient);
        };

        // Return "class"
        return World;
    });