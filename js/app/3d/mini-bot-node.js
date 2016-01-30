define(["lib/three"],
    function (THREE) {

        /**
         *  Create a Mini bot
         * @constructor
         */
        function MiniBotNode() {
            this.position = new THREE.Vector3(0, 0, 0);
            this.targetPosition = new THREE.Vector3(0, 0, 0);
            this.mesh = this.__createMesh();

            // TODO: Remove

            setInterval(function () {
                this.mesh.rotation.x += 0.1;
                this.mesh.rotation.y -= 0.15;
            }.bind(this), 20);
        }

        /// INTERNAL /////////////////////////////////////////////////////////////////////////////////////////////////////

        MiniBotNode.prototype.__createMesh = function () {
            var geometry = new THREE.IcosahedronGeometry(2);
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