define(["lib/three"],
    function (THREE) {


        /**
         *  Create a Master bot
         * @constructor
         */
        function MasterBotNode() {
            this.position = new THREE.Vector3(0, 0, 0);
            this.mesh = this.__createMesh();
        }


        /// INTERNAL /////////////////////////////////////////////////////////////////////////////////////////////////////

        MasterBotNode.prototype.__createMesh = function() {
            var geometry = new THREE.SphereGeometry(5, 32, 32);
            var material = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe: true, wireframeLineWidth: 0.1});
            return new THREE.Mesh(geometry, material);
        };

        // Return "class"
        return MasterBotNode
    });