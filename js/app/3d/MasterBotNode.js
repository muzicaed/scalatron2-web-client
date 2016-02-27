define([
        "lib/three",
        "app/3d/Resources/MeshFactory"
    ],

    function (THREE, MeshFactory) {

        /**
         *  Create a Master bot
         * @param id - String, object's id
         * @constructor
         */
        function MasterBotNode(id) {
            this.id = id;
            this.targetPosition = new THREE.Vector3(0, 0, 0);
            this.velocity = new THREE.Vector2(0, 0);
            this.node = new THREE.Object3D();
            this.node.add(MeshFactory.createBotMesh());
            this.node.position.y = 10;
        }

        /**
         * Instantly move the bot to target position.
         */
        MasterBotNode.prototype.place = function() {
            this.node.position.x = this.targetPosition.x;
            this.node.position.y = this.targetPosition.y;
            this.node.position.z = this.targetPosition.z;
        };

        // Return "class"
        return MasterBotNode
    });