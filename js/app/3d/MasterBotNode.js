define([
        "lib/three",
        "app/3d/Resources/MeshFactory",
        "app/3d/Behaviours/MovableBehaviour"
    ],

    function (THREE, MeshFactory, MovableBehaviour) {

        /**
         *  Create a Master bot
         * @param id - String, object's id
         * @constructor
         */
        function MasterBotNode(id) {
            this.id = id;
            this.node = new THREE.Object3D();
            this.node.add(MeshFactory.createBotMesh());
            this.node.position.y = 10;
            this.movable = new MovableBehaviour();
        }

        /**
         * Instantly move the bot to target position.
         */
        MasterBotNode.prototype.place = function() {
            this.movable.setTargetPosition(this.movable.targetPosition);
            this.node.position.x = this.movable.targetPosition.x;
            this.node.position.y = this.movable.targetPosition.y;
            this.node.position.z = this.movable.targetPosition.z;
        };

        // Return "class"
        return MasterBotNode;
    });