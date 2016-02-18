define(["lib/three"],
    function (THREE) {

        /**
         *  Create a Mini bot
         * @constructor
         */
        function MiniBotNode() {
            this.position = new THREE.Vector3(0, 0, 0);
            this.targetPosition = new THREE.Vector3(0, 0, 0);
            this.node = new THREE.Object3D();
            this.node.add(__createMesh());
            this.node.position.y = 10;
        }

        /// INTERNAL /////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Create mini bot mesh.
         * @returns {THREE.Mesh}
         * @private
         */
        function __createMesh() {
            var geometry = new THREE.IcosahedronGeometry(1.5);
            var material = new THREE.MeshPhongMaterial({
                color: 0x00ff00,
                wireframe: false,
                shading: THREE.FlatShading
            });
            return new THREE.Mesh(geometry, material);
        };

        // Return "class"
        return MiniBotNode
    });