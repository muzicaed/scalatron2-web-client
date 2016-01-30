define(["lib/three"],
    function (THREE) {

        var viewPort = {height: 500, width: 500};
        var renderer = new THREE.WebGLRenderer({antialias: true});


        /**
         *  Create a 3d world
         * @constructor
         */
        function World() {
            this.scene = new THREE.Scene();
            this.camera = this.__createCamera()
            this._initLights();
            this.__initWorldObjects();

            renderer.setSize(viewPort.width, viewPort.height);
            document.body.appendChild(renderer.domElement);
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
        World.prototype.add = function (node) {
            this.scene.add(node.mesh);
        };

        /// INTERNAL /////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Create camera.
         */
        World.prototype.__createCamera = function () {
            var camera = new THREE.PerspectiveCamera(75,
                viewPort.width / viewPort.height,
                0.1,
                500);
            camera.position.z = 90;
            return camera;
        };

        /**
         * Init lights.
         */
        World.prototype._initLights = function () {
            var light = new THREE.PointLight(0xffffff, 0.4, 50, 0.5);
            light.position.set(0, -10, -25);
            this.scene.add(light);

            var spotLight = new THREE.SpotLight( 0xffffff );
            spotLight.position.set( 100, -50, 100 );
            spotLight.shadowCameraNear = 10;
            spotLight.shadowCameraFar = 4000;
            spotLight.shadowCameraFov = 30;

            this.scene.add( spotLight );

            var ambient = new THREE.AmbientLight(0x303030);
            this.scene.add(ambient);
        };

        /**
         * Init world objects.
         */
        World.prototype.__initWorldObjects = function () {
            var geometry = new THREE.BoxGeometry(100, 100, 1);
            var material = new THREE.MeshBasicMaterial({color: 0x303060});
            var floor = new THREE.Mesh(geometry, material);
            this.scene.add(floor);
        };


        // Return "class"
        return World
    });