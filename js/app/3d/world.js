define([
        "lib/three",
        "lib/threex-fullscreen"
    ],

    function (THREE, THREEx) {
        var viewPort = {height: 500, width: 500};
        var renderer = new THREE.WebGLRenderer({antialias: true});

        /**
         *  Create a 3d world
         * @constructor
         */
        function World() {
            this.scene = new THREE.Scene();
            this.camera = this.__createCamera();
            this.camera = this.__createCamera();
            this._initLights();

            renderer.setSize(viewPort.width, viewPort.height);
            document.body.appendChild(renderer.domElement);
            this.__addFullscreenShortcut()
        }

        /**
         *  Start the render loop.
         */
        World.prototype.render = function () {
            setTimeout(function () {
                requestAnimationFrame(World.prototype.render.bind(this));
                renderer.render(this.scene, this.camera);
            }.bind(this), 1000 / 30);
        };

        /**
         *  Add node to the scene.
         */
        World.prototype.add = function (obj) {
            this.scene.add(obj.node);
        };

        /// INTERNAL /////////////////////////////////////////////////////////////////////////////////////////////////////

        World.prototype.__addFullscreenShortcut = function() {
            if (THREEx.FullScreen.available()) {
                document.onkeypress = function (e) {
                    // detect "f"
                    e = e || window.event;
                    if (e.keyCode == 102) {
                        THREEx.FullScreen.request(renderer.domElement);
                    }
                };
            }
        }

        /**
         * Create camera.
         */
        World.prototype.__createCamera = function () {
            var camera = new THREE.PerspectiveCamera(75,
                viewPort.width / viewPort.height,
                0.1,
                500);
            camera.position.set(50, 50, 90);
            return camera;
        };

        /**
         * Init lights.
         */
        World.prototype._initLights = function () {
            var light = new THREE.PointLight(0xffffff, 0.6, 50, 0.5);
            light.position.set(50, 40, 50);
            this.scene.add(light);

            var spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(150, 0, 150);
            spotLight.shadowCameraNear = 10;
            spotLight.shadowCameraFar = 4000;
            spotLight.shadowCameraFov = 30;

            this.scene.add(spotLight);

            var ambient = new THREE.AmbientLight(0x404040);
            this.scene.add(ambient);
        };

        // Return "class"
        return World
    });