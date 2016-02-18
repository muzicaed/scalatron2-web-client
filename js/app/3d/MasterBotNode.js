define(["lib/three"],
    function (THREE) {

        /**
         *  Create a Master bot
         * @constructor
         */
        function MasterBotNode() {
            this.position = new THREE.Vector3(0, 0, 0);
            this.node = new THREE.Object3D();
            this.node.add(__createMesh());
            this.node.position.y = 10;
        }

        /// INTERNAL /////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Creates master bot mesh.
         * @returns {THREE.Mesh}
         * @private
         */
        function __createMesh() {
            var geometry = new THREE.SphereGeometry(3, 32, 32);
            var material = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe: true});
            return new THREE.Mesh(geometry, material);
        };

        // Return "class"
        return MasterBotNode
    });